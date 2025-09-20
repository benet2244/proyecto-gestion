
'use server';
/**
 * @fileOverview Analyzes a file hash using the VirusTotal API to determine its threat level.
 *
 * - analyzeHash - A function that takes a hash and returns a threat analysis.
 */

import { ai } from '@/ai/genkit';
import type { AnalyzeHashInput, AnalyzeHashOutput } from '@/lib/definitions';
import { AnalyzeHashInputSchema, AnalyzeHashOutputSchema } from '@/lib/definitions';


const threatLevelThresholds = {
    'Crítico': 20,
    'Alto': 10,
    'Medio': 1,
    'Bajo': 0, 
    'No Detectado': 0, 
};

// --- HELPER FUNCTIONS ---

function determineThreatLevel(maliciousCount: number): AnalyzeHashOutput['threatLevel'] {
    if (maliciousCount >= threatLevelThresholds['Crítico']) return 'Crítico';
    if (maliciousCount >= threatLevelThresholds['Alto']) return 'Alto';
    if (maliciousCount >= threatLevelThresholds['Medio']) return 'Medio';
    if (maliciousCount > threatLevelThresholds['Bajo']) return 'Bajo';
    return 'No Detectado';
}

function extractVirusInfo(analysisResults: any[]): { virusType?: string, virusName?: string } {
    const malwareKeywords = /(Trojan|Worm|Virus|Ransom|Spyware|Backdoor|Keylogger|Malware)/i;
    const detectedTypes = new Set<string>();
    const detectedNames = new Set<string>();

    for (const result of Object.values(analysisResults)) {
        if (result && typeof result === 'object' && 'result' in result && result.result) {
            detectedNames.add(result.result);
            const match = (result.result as string).match(malwareKeywords);
            if (match && match[1]) {
                detectedTypes.add(match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase());
            }
        }
    }
    
    return {
        virusType: detectedTypes.size > 0 ? Array.from(detectedTypes).join(', ') : undefined,
        virusName: detectedNames.size > 0 ? Array.from(detectedNames).join(', ') : undefined,
    };
}


// --- GENKIT FLOW ---

const analyzeHashFlow = ai.defineFlow(
  {
    name: 'analyzeHashFlow',
    inputSchema: AnalyzeHashInputSchema,
    outputSchema: AnalyzeHashOutputSchema,
  },
  async ({ hash }) => {
    const apiKey = process.env.VIRUSTOTAL_API_KEY;
    if (!apiKey) {
      throw new Error('VIRUSTOTAL_API_KEY is not set in environment variables.');
    }

    const urlApi = `https://www.virustotal.com/api/v3/files/${hash}`;
    const headers = { 'x-apikey': apiKey, 'Accept': 'application/json' };
    
    try {
        const response = await fetch(urlApi, { headers });

        if (response.status === 404) {
             return {
                threatLevel: 'Desconocido',
                maliciousCount: 0,
                totalScans: 0,
            };
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`VirusTotal API error (${response.status}): ${errorData?.error?.message || 'Unknown error'}`);
        }

        const vtResult = await response.json();
        
        const attributes = vtResult.data?.attributes;
        const stats = attributes?.last_analysis_stats;
        const results = attributes?.last_analysis_results;

        if (!stats) {
             return {
                threatLevel: 'Desconocido',
                maliciousCount: 0,
                totalScans: 0,
                virusName: 'No analysis stats found.'
            };
        }

        const maliciousCount = stats.malicious || 0;
        const totalScans = (stats.harmless || 0) + (stats.malicious || 0) + (stats.suspicious || 0) + (stats.undetected || 0) + (stats.timeout || 0);
        
        const threatLevel = determineThreatLevel(maliciousCount);
        const { virusType, virusName } = extractVirusInfo(results || []);

        return {
            threatLevel,
            maliciousCount,
            totalScans,
            virusType,
            virusName
        };

    } catch (error) {
        console.error("Error connecting to VirusTotal:", error);
        throw new Error('Failed to analyze hash with VirusTotal.');
    }
  }
);


// --- EXPORTED WRAPPER FUNCTION ---

export async function analyzeHash(
  input: AnalyzeHashInput
): Promise<AnalyzeHashOutput> {
  return analyzeHashFlow(input);
}
