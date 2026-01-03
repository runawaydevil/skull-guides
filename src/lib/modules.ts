export interface Module {
  id: string;
  name: string;
  file: string;
  order: number;
}

export const modules: Module[] = [
  { id: '1', name: 'Introduction to Ethical Hacking', file: '1-Introduction.md', order: 1 },
  { id: '2', name: 'Footprinting and Reconnaissance', file: '2-Footprinting-and-Reconnaissance.md', order: 2 },
  { id: '3', name: 'Scanning Networks', file: '3-Scanning-Networks.md', order: 3 },
  { id: '5', name: 'Vulnerability Analysis', file: '5-Vulnerability-Analysis.md', order: 5 },
  { id: '6', name: 'System Hacking', file: '6-System-Hacking.md', order: 6 },
  { id: '7', name: 'Malware Threats', file: '7-Malware.md', order: 7 },
  { id: '8', name: 'Sniffing', file: '8-Sniffing.md', order: 8 },
  { id: '9', name: 'Social Engineering', file: '9-Social-Engineering.md', order: 9 },
  { id: '10', name: 'Denial of Service', file: '10-Denial-of-Service.md', order: 10 },
  { id: '11', name: 'Session Hijacking', file: '11-Session-Hijacking.md', order: 11 },
  { id: '12', name: 'Evading IDS, Firewalls, and Honeypots', file: '12-Evading-IDS-Firewalls-and-Honeypots.md', order: 12 },
  { id: '13', name: 'Hacking Web Servers', file: '13-Hacking-Web-Servers.md', order: 13 },
  { id: '14', name: 'Hacking Web Applications', file: '14-Hacking-Web-Applications.md', order: 14 },
  { id: '14-pentest', name: 'SQL Injection / Pentesting', file: '14-Pentesting.md', order: 15 },
  { id: '16', name: 'Hacking Wireless Networks', file: '16-Hacking-Wireless-Networks.md', order: 16 },
  { id: '17', name: 'Hacking Mobile Platforms and IoT', file: '17-Hacking-Mobile-Platforms-and-IoT.md', order: 17 },
  { id: '19', name: 'Cloud Computing', file: '19-Cloud Computing.md', order: 19 },
  { id: '20', name: 'Cryptography', file: '20-Cryptography.md', order: 20 },
];

export const REPO_OWNER = 'runawaydevil';
export const REPO_NAME = 'skull-guides';
export const REPO_BRANCH = 'main';
export const DOCS_PATH = 'docs';

/**
 * Get modules for a specific repository
 * Returns modules if the repository matches, null otherwise
 */
export function getModulesForRepo(owner: string, repo: string): Module[] | null {
  if (owner === REPO_OWNER && repo === REPO_NAME) {
    return modules;
  }
  return null;
}

