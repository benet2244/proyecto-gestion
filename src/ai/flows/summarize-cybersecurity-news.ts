'use server';
/**
 * @fileOverview Summarizes cybersecurity news articles to provide quick insights.
 *
 * - summarizeCybersecurityNews - A function that summarizes a given cybersecurity news article.
 * - SummarizeCybersecurityNewsInput - The input type for the summarizeCybersecurityNews function.
 * - SummarizeCybersecurityNewsOutput - The return type for the summarizeCybersecurityNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCybersecurityNewsInputSchema = z.object({
  articleContent: z
    .string()
    .describe('The content of the cybersecurity news article to summarize.'),
});
export type SummarizeCybersecurityNewsInput = z.infer<
  typeof SummarizeCybersecurityNewsInputSchema
>;

const SummarizeCybersecurityNewsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the cybersecurity news article.'),
});
export type SummarizeCybersecurityNewsOutput = z.infer<
  typeof SummarizeCybersecurityNewsOutputSchema
>;

export async function summarizeCybersecurityNews(
  input: SummarizeCybersecurityNewsInput
): Promise<SummarizeCybersecurityNewsOutput> {
  return summarizeCybersecurityNewsFlow(input);
}

const summarizeCybersecurityNewsPrompt = ai.definePrompt({
  name: 'summarizeCybersecurityNewsPrompt',
  input: {schema: SummarizeCybersecurityNewsInputSchema},
  output: {schema: SummarizeCybersecurityNewsOutputSchema},
  prompt: `Summarize the following cybersecurity news article:

  {{articleContent}}
  `,
});

const summarizeCybersecurityNewsFlow = ai.defineFlow(
  {
    name: 'summarizeCybersecurityNewsFlow',
    inputSchema: SummarizeCybersecurityNewsInputSchema,
    outputSchema: SummarizeCybersecurityNewsOutputSchema,
  },
  async input => {
    const {output} = await summarizeCybersecurityNewsPrompt(input);
    return output!;
  }
);
