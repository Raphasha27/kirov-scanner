# Kirov Scanner

Multi-vector security reconnaissance and vulnerability scanning platform with real-time threat analysis, MITRE ATT&CK mapping, and automated reporting.

Built with Next.js and TypeScript. Part of the Kirov Security Labs ecosystem.

## Capabilities

| Capability | Description |
|-----------|-------------|
| Network Scanning | Automated reconnaissance across subnets and services |
| Vulnerability Detection | Real-time CVE matching and severity classification |
| MITRE ATT&CK Mapping | Maps findings to adversary techniques and tactics |
| Multi-Protocol | HTTP, DNS, SSL/TLS, port scanning, service fingerprinting |
| Reporting | PDF and HTML reports with severity scoring and remediation |

## Architecture

```
User / API
    
Kirov Scanner (Next.js + TypeScript)
    
+-- Scan Engine (network, web, DNS, SSL)
+-- Detection Engine (CVE matching, signature-based)
+-- Mapping Engine (MITRE ATT&CK)
+-- Report Engine (PDF, HTML, JSON)
    
Output: Findings + Severity + Remediation
```

## Quick Start

```bash
git clone https://github.com/Raphasha27/kirov-scanner.git
cd kirov-scanner
npm install
npm run dev
```

## Use Cases

- **Security Audits**: Pre-deployment vulnerability assessment
- **Continuous Monitoring**: Scheduled scans for regression detection
- **Compliance**: Mapping findings to compliance frameworks (PCI-DSS, HIPAA, POPIA)
- **Incident Response**: Rapid reconnaissance during active incidents

## Related

| Project | Description |
|---------|-------------|
| [Kirov Security Core](https://github.com/Raphasha27/kirov-security-core) | Unified security dashboard |
| [Kirov Threat SDK](https://github.com/Raphasha27/kirov-threat-sdk) | Threat intelligence with MITRE ATT&CK |
| [Github-Harden2](https://github.com/Raphasha27/Github-Harden2) | Repository hardening automation |

## Product Ladder

```
GitHub (this repo)
    
Portfolio  https://raphasha27.github.io/raphasha-dev-portfolio
    
Live Demo  https://github.com/Raphasha27/kirov-scanner
    
Contact  https://github.com/Raphasha27
```

Part of the [Kirov Dynamics](https://github.com/Raphasha27/kirov-dynamics) ecosystem.

**Built by Koketso Raphasha — Practical AI for Africa**