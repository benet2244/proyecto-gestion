import { Incident, NewsArticle } from '@/lib/definitions';

export const incidents: Incident[] = [
  {
    id: 'INC-001',
    title: 'Phishing Attack on Finance Department',
    description: 'A targeted phishing campaign was identified affecting multiple users in the finance department. Credentials may have been compromised.',
    status: 'In Progress',
    severity: 'High',
    reportedAt: '2024-07-20T09:15:00Z',
    reporter: { name: 'Alice Johnson', email: 'alice.j@example.com' },
    assignedTo: { name: 'Bob Williams', email: 'bob.w@ciberseg.com' },
    updates: [
      { timestamp: '2024-07-20T09:30:00Z', update: 'Incident confirmed. Affected accounts are being identified and reset.' },
      { timestamp: '2024-07-20T11:00:00Z', update: 'All affected accounts have had their passwords reset. Monitoring for suspicious activity.' },
    ],
  },
  {
    id: 'INC-002',
    title: 'Unusual Login Activity on Production Server',
    description: 'Multiple failed login attempts detected from an unrecognized IP address targeting the main production database server.',
    status: 'Closed',
    severity: 'Critical',
    reportedAt: '2024-07-19T22:45:00Z',
    reporter: { name: 'System Alert', email: 'alerts@monitoring.com' },
    assignedTo: { name: 'Charlie Brown', email: 'charlie.b@ciberseg.com' },
    updates: [
      { timestamp: '2024-07-19T22:50:00Z', update: 'IP address has been blocked at the firewall level.' },
      { timestamp: '2024-07-20T01:00:00Z', update: 'Investigation complete. No breach detected. Closing incident.' },
    ],
  },
  {
    id: 'INC-003',
    title: 'Malware Detected on Marketing Laptop',
    description: 'Antivirus software flagged and quarantined a trojan on the laptop assigned to a member of the marketing team.',
    status: 'Open',
    severity: 'Medium',
    reportedAt: '2024-07-21T14:00:00Z',
    reporter: { name: 'Diana Prince', email: 'diana.p@example.com' },
    updates: [],
  },
    {
    id: 'INC-004',
    title: 'DDoS Attack on Main Website',
    description: 'The main corporate website is experiencing a Distributed Denial of Service (DDoS) attack, causing intermittent outages.',
    status: 'In Progress',
    severity: 'Critical',
    reportedAt: '2024-07-22T10:00:00Z',
    reporter: { name: 'System Alert', email: 'alerts@monitoring.com' },
    assignedTo: { name: 'Bob Williams', email: 'bob.w@ciberseg.com' },
    updates: [
      { timestamp: '2024-07-22T10:05:00Z', update: 'DDoS mitigation service has been activated.' },
    ],
  },
  {
    id: 'INC-005',
    title: 'Outdated SSL Certificate',
    description: 'The SSL certificate for a secondary domain expired, causing browser warnings for visitors.',
    status: 'Resolved',
    severity: 'Low',
    reportedAt: '2024-07-18T16:00:00Z',
    reporter: { name: 'Frank Miller', email: 'frank.m@example.com' },
    assignedTo: { name: 'Charlie Brown', email: 'charlie.b@ciberseg.com' },
    updates: [
       { timestamp: '2024-07-18T16:30:00Z', update: 'New SSL certificate has been installed and verified.' },
    ]
  }
];

export const newsArticles: NewsArticle[] = [
    {
    id: 'NEWS-001',
    title: 'Critical RCE Vulnerability Found in Popular Web Server',
    source: 'CyberWire Daily',
    url: '#',
    publishedAt: '2024-07-22T08:00:00Z',
    imageUrl: 'https://picsum.photos/seed/101/600/400',
    imageHint: 'code server',
    category: 'vulnerabilities',
    content: 'A critical remote code execution (RCE) vulnerability, tracked as CVE-2024-12345, has been discovered in the widely used "Nexus" web server software. The flaw allows unauthenticated attackers to execute arbitrary code on the server, potentially leading to a full system compromise. Administrators are urged to apply the patch immediately. The vulnerability exists in the way the server processes file uploads, allowing a specially crafted file to bypass security checks. All versions prior to 3.5.2 are affected. Security researchers at SecureLayer demonstrated a proof-of-concept exploit that gains a reverse shell on a target system. The vendor has released a patch and a detailed advisory.'
  },
  {
    id: 'NEWS-002',
    title: 'New "Chrono-Ransom" Malware Encrypts Files Based on Timestamps',
    source: 'ThreatPost',
    url: '#',
    publishedAt: '2024-07-21T12:30:00Z',
    imageUrl: 'https://picsum.photos/seed/102/600/400',
    imageHint: 'malware virus',
    category: 'malware',
    content: 'A new strain of ransomware dubbed "Chrono-Ransom" has been observed in the wild. Unlike traditional ransomware, Chrono-Ransom selectively encrypts files based on their creation and modification dates, targeting newer files first to maximize disruption. The malware is primarily distributed through phishing emails containing malicious Microsoft Office documents. Once executed, it establishes persistence and begins encrypting files in the background. The ransom note demands payment in cryptocurrency and threatens to leak data if the ransom is not paid within 72 hours. Experts recommend robust email filtering and regular offline backups to mitigate this threat.'
  },
  {
    id: 'NEWS-003',
    title: 'Microsoft Releases Emergency Out-of-Band Patch for Windows Kernel',
    source: 'Bleeping Computer',
    url: '#',
    publishedAt: '2024-07-20T15:00:00Z',
    imageUrl: 'https://picsum.photos/seed/103/600/400',
    imageHint: 'update software',
    category: 'patches',
    content: 'Microsoft has issued an emergency out-of-band security update to address a privilege escalation vulnerability in the Windows Kernel. The flaw, CVE-2024-54321, could allow a local attacker to gain SYSTEM privileges on a compromised machine. The vulnerability was reportedly being actively exploited by a state-sponsored threat actor group known as "Shadow Weavers". The patch is available for all supported versions of Windows and Windows Server. System administrators are advised to deploy the update as soon as possible to prevent potential exploitation.'
  },
    {
    id: 'NEWS-004',
    title: 'State-Sponsored Hackers Target Aerospace and Defense Industries',
    source: 'Krebs on Security',
    url: '#',
    publishedAt: '2024-07-22T11:00:00Z',
    imageUrl: 'https://picsum.photos/seed/104/600/400',
    imageHint: 'hacker network',
    category: 'threats',
    content: 'A sophisticated cyber-espionage campaign attributed to the APT42 group is actively targeting companies in the aerospace and defense sectors. The attackers use advanced social engineering techniques and custom-built malware to infiltrate networks and exfiltrate sensitive intellectual property, including blueprints and research data. The campaign has been active for at least six months and has shown a high degree of operational security, making detection difficult. The primary infection vector appears to be spear-phishing emails sent to high-profile employees.'
  },
  {
    id: 'NEWS-005',
    title: 'The Rise of AI in Phishing Attacks: What to Watch For',
    source: 'Dark Reading',
    url: '#',
    publishedAt: '2024-07-19T09:00:00Z',
    imageUrl: 'https://picsum.photos/seed/105/600/400',
    imageHint: 'ai phishing',
    category: 'general',
    content: 'Cybercriminals are increasingly leveraging generative AI to create highly convincing and personalized phishing emails at scale. These AI-crafted emails often lack the typical grammatical errors and awkward phrasing of older phishing attempts, making them much harder to detect. Security experts are advising organizations to update their security awareness training to educate employees on these new, more sophisticated threats. Key indicators now include contextual inconsistencies and an unusual sense of urgency, rather than just spelling mistakes.'
  }
];
