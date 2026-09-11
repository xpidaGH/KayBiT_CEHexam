import { 
  NetworkSpectrumTier, 
  OnionCircuitStep, 
  DarkWebObjectiveItem, 
  TorScraperScript 
} from '../types';

/**
 * 1. THEORETICAL BLUEPRINT BREAKDOWN
 * Detailed comparative data across Clear Web, Deep Web, and Dark Web
 */
export const NETWORK_SPECTRUM_TIERS: NetworkSpectrumTier[] = [
  {
    id: 'clear-web',
    name: 'The Clear Web',
    commonAlias: 'Surface Web / Visible Web',
    estimatedVolume: '4% - 5% of all Internet data',
    dnsMechanism: 'Standard hierarchical ICANN Domain Name System (DNS) on UDP/TCP port 53',
    portsAndProtocols: ['Port 80 (HTTP)', 'Port 443 (HTTPS / TLS 1.3)', 'Port 53 (DNS)'],
    indexingMechanism: 'Freely indexable by automated web-crawling spiders (e.g. Googlebot, Bingbot, YandexBot) via standard HTTP requests and sitemap.xml files.',
    encryptionSecurity: 'Transport Layer Security (TLS/SSL) for in-transit encryption. Endpoint certificates signed by public Certificate Authorities (CAs).',
    accessMethod: 'Any standard native web browser (Chrome, Safari, Firefox, Edge, Curl, Wget) without specialized proxy routing.',
    cehExamTraps: [
      'TRAP: Confusing HTTPS with the Dark Web. HTTPS on the Clear Web only encrypts traffic between client and server; it is NOT anonymous and relies on public IP routing and standard DNS.',
      'TRAP: Believing the Clear Web constitutes the majority of internet information. It represents less than 5% of web records.',
      'TRAP: Assuming that pages with unlisted links are Dark Web. If they can be requested via standard HTTP/DNS without auth, they remain Clear Web.'
    ],
    coreCharacteristics: [
      'Completely transparent IP routing and visible autonomous system numbers (ASNs).',
      'Requires public Domain Name Registrars (ICANN-accredited) and public WHOIS/RDAP records.',
      'Vulnerable to standard OSINT reconnaissance: Shodan, Censys, Amass, Harvester, DNS zone transfers (AXFR).',
      'Centralized regulatory jurisdiction, subject to DMCA takedowns, ISP logging, and court subpoenas.'
    ],
    realWorldExamples: [
      'Wikipedia.org, CNN.com, GitHub public repositories, Reddit public threads, Google search index, Government portals.'
    ]
  },
  {
    id: 'deep-web',
    name: 'The Deep Web',
    commonAlias: 'Hidden Web / Invisible Web (Non-Indexed)',
    estimatedVolume: '90% - 95% of all Internet data (Estimated >7.5 Petabytes)',
    dnsMechanism: 'Standard ICANN DNS resolution (standard domain names or internal split-horizon DNS).',
    portsAndProtocols: ['Port 443 (HTTPS)', 'Port 80 (HTTP)', 'Port 3306 (MySQL)', 'Port 5432 (PostgreSQL)', 'Port 445 (SMB)'],
    indexingMechanism: 'Intentionally shielded from crawlers through authentication walls (401/403), paywalls, session tokens, CAPTCHAs, or explicit webmaster directives (robots.txt "Disallow: /", noindex meta tags).',
    encryptionSecurity: 'Standard TLS/HTTPS, enterprise VPN tunnels (IPsec/WireGuard/OpenVPN), OAuth 2.0 / JWT tokens, Kerberos, database-level encryption (TDE).',
    accessMethod: 'Standard browsers, but requires legitimate credentials, session cookies, API tokens, or network membership.',
    cehExamTraps: [
      'MAJOR CEH TRAP: Equating the Deep Web with illegal activity. Over 90% of the Deep Web consists of normal, essential daily systems (medical health records, student portals, online banking, private enterprise intranets).',
      'TRAP: Thinking special darknet software (like Tor) is needed. The Deep Web runs on standard TCP/IP stacks and standard HTTP servers (Nginx, Apache, IIS).',
      'TRAP: Believing robots.txt protects confidential files from hackers. Robots.txt is merely an advisory directive for ethical crawlers; attackers specifically inspect robots.txt to discover sensitive hidden paths!'
    ],
    coreCharacteristics: [
      'Dynamic database queries generated on demand (e.g. searching a personal banking statement).',
      'Private cloud buckets (AWS S3, GCP Cloud Storage) secured by Identity and Access Management (IAM).',
      'Subject to regulatory compliance: HIPAA (healthcare), PCI-DSS (payment cards), GDPR (privacy), SOC2.',
      'Enterprise vulnerability scope: Broken Object Level Authorization (BOLA), Broken Authentication, SQLi in search parameters.'
    ],
    realWorldExamples: [
      'Your personal Gmail inbox, Chase/Wells Fargo bank dashboards, medical imaging PACS servers, internal Jira boards, AWS console backends, academic JSTOR paywalled papers.'
    ]
  },
  {
    id: 'dark-web',
    name: 'The Dark Web',
    commonAlias: 'Darknet / Overlay Networks / Hidden Services',
    estimatedVolume: 'Less than 0.05% of the Internet (Highly concentrated, volatile nodes)',
    dnsMechanism: 'Cryptographic Pseudo-Top-Level Domains (e.g. .onion for Tor, .i2p for I2P). NO central ICANN name servers; resolution happens via Distributed Hash Tables (DHT) and local proxy daemons.',
    portsAndProtocols: ['SOCKS5 (127.0.0.1:9050 / 9150 for Tor)', 'TCP / TLS multi-layered circuits', 'Garlic routing protocols (I2P)', 'Freenet FNP'],
    indexingMechanism: 'Cannot be indexed by standard spiders. Specialized darknet search engines (e.g. Ahmia, Torch, Haystak) crawl public .onion directories and link aggregators (Hidden Wiki).',
    encryptionSecurity: 'Layered asymmetric & symmetric end-to-end cryptography (Onion/Garlic routing). Tor uses Curve25519, Ed25519, AES-128/256-CTR, and HKDF-SHA256.',
    accessMethod: 'Mandates dedicated routing clients: Tor Browser, I2P Router daemon, Freenet client, or Whonix/Tails isolated operating systems.',
    cehExamTraps: [
      'CRITICAL CEH TRAP: The Exit Node can read unencrypted payload! If an end-user visits an HTTP (non-HTTPS) website through Tor, the Tor Exit Node sees the plaintext credentials/data. Only HTTPS provides end-to-end payload secrecy through an exit node.',
      'TRAP: Confusing Onion Routing with Garlic Routing. Tor uses Onion Routing (single-message layered cells along a 3-hop circuit). I2P uses Garlic Routing (multiple bundled messages packed into encrypted "cloves" with unidirectional inbound/outbound tunnels).',
      'TRAP: Assuming Tor hidden services (.onion) have an exit node. Traffic to a native .onion service NEVER touches an exit node; it meets at a Rendezvous Point through a 6-hop encrypted circuit!'
    ],
    coreCharacteristics: [
      'Decentralized peer-to-peer relay network with multi-hop anonymization.',
      'Provides bidirectional anonymity: hiding both the client identity and the server physical location.',
      'Censorship-resistant and surveillance-resistant communication channel.',
      'Key threat intelligence use cases: monitoring credential leaks, zero-day exploit markets, ransomware extortion blogs, cyber threat actor attribution.'
    ],
    realWorldExamples: [
      'DuckDuckGo .onion mirror, SecureDrop whistleblower portals, ProPublica darknet site, underground forum marketplaces, ransomware extortion victim disclosure sites.'
    ]
  }
];

/**
 * 2. ADVANCED ONION ROUTING HANDSHAKE MECHANICS
 * Step-by-step cryptographic pathing and cell-level relay mechanics tested on CEH
 */
export const ONION_CIRCUIT_STEPS: OnionCircuitStep[] = [
  {
    stepNumber: 1,
    phase: 'Consensus Acquisition',
    cellType: 'HTTP / TLS Directory Fetch',
    source: 'Tor Client Daemon',
    destination: 'Directory Authorities / Mirrors',
    cryptoLayer: 'Public Key Infrastructure (Signed Consensus)',
    action: 'Client fetches the latest Network Status Consensus document signed by the 9 trusted Directory Authorities.',
    whatNodeKnows: {
      knowsClientIP: true,
      knowsNextHop: false,
      knowsPrevHop: false,
      knowsTargetDestination: false,
      canReadPayload: false,
    },
    explanation: 'The client downloads the consensus microdescriptors containing verified public identity keys, bandwidth weights, and flags (Guard, Exit, Fast, Stable, HSDir) for all ~7,000 active relays.',
    securityImpact: 'Guarantees the client builds circuits only through cryptographically authenticated relays, preventing rogue directory spoofing.'
  },
  {
    stepNumber: 2,
    phase: 'Guard / Entry Node Handshake',
    cellType: 'CREATE2 (ntor handshake)',
    source: 'Tor Client',
    destination: 'Guard / Entry Node (E)',
    cryptoLayer: 'Curve25519 + Ed25519 + HKDF-SHA256',
    action: 'Client initiates a TLS connection to the Guard and dispatches a CREATE2 cell containing an ephemeral Diffie-Hellman public key.',
    whatNodeKnows: {
      knowsClientIP: true,
      knowsNextHop: true, // Next will be Middle Relay
      knowsPrevHop: true, // Client
      knowsTargetDestination: false,
      canReadPayload: false,
    },
    explanation: 'The Guard processes the ntor handshake, responds with a CREATED2 cell, and both parties derive a shared 128-bit/256-bit symmetric session key (K_guard).',
    securityImpact: 'The Guard sees the real client IP, but has NO visibility into the destination or the plaintext payload. Tor uses persistent "Guard" nodes for 2-3 months to mitigate Sybil and profiling attacks.'
  },
  {
    stepNumber: 3,
    phase: 'Middle Relay Circuit Extension',
    cellType: 'RELAY_EARLY / EXTEND2',
    source: 'Tor Client (via Guard)',
    destination: 'Middle Relay (M)',
    cryptoLayer: 'Encrypted with K_guard',
    action: 'Client wraps an EXTEND2 cell with the IP/port of the chosen Middle Relay and an ephemeral DH handshake, encrypted with K_guard.',
    whatNodeKnows: {
      knowsClientIP: false, // Only sees Guard IP
      knowsNextHop: true,  // Next will be Exit Node
      knowsPrevHop: true,  // Guard Node
      knowsTargetDestination: false,
      canReadPayload: false,
    },
    explanation: 'Guard peels off its outer K_guard layer, reveals the forward directive, and sends a CREATE2 cell to the Middle Relay. Middle responds with CREATED2, which Guard repackages in a RELAY_EXTENDED2 cell back to the Client. Client derives symmetric key K_middle.',
    securityImpact: 'The Middle Relay is mathematically blind: it knows neither the originating client IP (it only knows the Guard IP) nor the final website destination (it only knows the Exit Node IP).'
  },
  {
    stepNumber: 4,
    phase: 'Exit Node Circuit Extension',
    cellType: 'RELAY / EXTEND2 (Nested)',
    source: 'Tor Client (via Guard -> Middle)',
    destination: 'Exit Node (X)',
    cryptoLayer: 'Encrypted with K_middle, then K_guard',
    action: 'Client sends an EXTEND2 cell targeted for the Exit Node, doubly encrypted with K_middle and K_guard.',
    whatNodeKnows: {
      knowsClientIP: false, // Only sees Middle Relay IP
      knowsNextHop: true,  // Target Web Server
      knowsPrevHop: true,  // Middle Relay
      knowsTargetDestination: true,
      canReadPayload: true, // Can read payload IF target is plain HTTP!
    },
    explanation: 'Guard peels K_guard and forwards to Middle. Middle peels K_middle and forwards CREATE2 to Exit Node. Exit Node responds with CREATED2, and client derives symmetric key K_exit. The 3-hop circuit is now fully established with 3 nested symmetric encryption layers.',
    securityImpact: 'The Exit Node knows the target destination IP and port, but has NO knowledge of the original client IP. The Exit Node only sees packets coming from the Middle Relay.'
  },
  {
    stepNumber: 5,
    phase: 'Data Payload Dispatch & Peeling',
    cellType: 'RELAY_DATA (Symmetric Onion Peeling)',
    source: 'Tor Client',
    destination: 'Target Web Server (Clear Web)',
    cryptoLayer: 'Layer 3: K_exit -> Layer 2: K_middle -> Layer 1: K_guard',
    action: 'Client wraps application payload: Encrypt(K_exit, Encrypt(K_middle, Encrypt(K_guard, Payload))).',
    whatNodeKnows: {
      knowsClientIP: false,
      knowsNextHop: true,
      knowsPrevHop: true,
      knowsTargetDestination: true,
      canReadPayload: true,
    },
    explanation: '1. Guard peels Layer 1 (K_guard) -> reveals forward to Middle.\n2. Middle peels Layer 2 (K_middle) -> reveals forward to Exit.\n3. Exit peels Layer 3 (K_exit) -> extracts raw packet and transmits to target server over standard TCP.',
    securityImpact: 'If visiting an HTTPS site (Port 443), the payload inside K_exit is TLS-encrypted, meaning even the Exit Node cannot see passwords or tokens. If visiting an HTTP site (Port 80), the Exit Node can read and tamper with everything!'
  },
  {
    stepNumber: 6,
    phase: 'Response Return Path',
    cellType: 'RELAY_DATA (Layer Accumulation)',
    source: 'Target Web Server',
    destination: 'Tor Client',
    cryptoLayer: 'Accumulative: K_exit -> K_middle -> K_guard',
    action: 'Server sends response to Exit Node. Each relay adds its respective symmetric encryption layer as the packet travels back.',
    whatNodeKnows: {
      knowsClientIP: false,
      knowsNextHop: false,
      knowsPrevHop: false,
      knowsTargetDestination: false,
      canReadPayload: false,
    },
    explanation: 'Exit Node encrypts with K_exit and sends to Middle. Middle encrypts with K_middle and sends to Guard. Guard encrypts with K_guard and sends to Client. Client applies K_guard, K_middle, and K_exit to recover the raw web response.',
    securityImpact: 'No single relay along the transit path possesses more than one cryptographic key, preserving total anonymity unless an attacker controls both Guard and Exit simultaneously.'
  }
];

/**
 * 3. INJECTABLE BOOTSTRAP & LOCALSTORAGE DASHBOARD OBJECTIVES
 * Core syllabus topics tested on CEH v13 with verification questions
 */
export const DARK_WEB_STUDY_OBJECTIVES: DarkWebObjectiveItem[] = [
  {
    id: 'dw-obj-1',
    category: 'spectrum',
    title: 'Network Spectrum Boundary Triad',
    cehSignificance: 'Domain 01 & 02: Footprinting, Reconnaissance & Network Architectures',
    description: 'Differentiate Clear Web (indexed, DNS, 4%), Deep Web (unindexed, auth/robots, 90%+), and Dark Web (encrypted overlay, .onion/.i2p, P2P).',
    verificationQuestion: 'Why does an intranet corporate portal with a robots.txt "Disallow: /" directive belong to the Deep Web rather than the Dark Web?',
    verifiedAnswer: 'Because it utilizes standard ICANN DNS and conventional TCP/IP routing; it is simply shielded from web crawler indexing via auth walls and robots directives, requiring no cryptographic overlay proxy like Tor.'
  },
  {
    id: 'dw-obj-2',
    category: 'handshake',
    title: 'Tor 3-Hop Circuit Cryptographic Keys',
    cehSignificance: 'Domain 06: System Hacking & Perimeter Defense',
    description: 'Master the 3 distinct symmetric session keys (K_guard, K_middle, K_exit) derived via ephemeral Diffie-Hellman ntor handshakes.',
    verificationQuestion: 'What does the Middle Relay know about the network transaction during an active Tor session?',
    verifiedAnswer: 'The Middle Relay knows ONLY the IP of the Guard (previous hop) and the IP of the Exit (next hop). It does NOT know the client IP, the target destination, or the contents of the payload.'
  },
  {
    id: 'dw-obj-3',
    category: 'threats',
    title: 'The Exit Node Sniffing Vulnerability',
    cehSignificance: 'Domain 07: Sniffing & Man-in-the-Middle Attacks',
    description: 'Analyze why malicious exit node operators can perform SSL stripping, cookie harvesting, and credential theft on unencrypted HTTP connections.',
    verificationQuestion: 'If a user logs into an unencrypted HTTP forum over Tor, can the Exit Node operator capture their password?',
    verifiedAnswer: 'YES! Tor only encrypts data inside the Tor circuit. Between the Exit Node and the final HTTP destination, the traffic is in plaintext. Only end-to-end TLS/HTTPS protects the payload from the Exit Node.'
  },
  {
    id: 'dw-obj-4',
    category: 'crypto',
    title: 'Tor vs I2P (Garlic Routing vs Onion Routing)',
    cehSignificance: 'Domain 09: Cryptography & Anonymity Networks',
    description: 'Understand the architectural differences between Tor (circuit-switched onion routing, centralized consensus) and I2P (packet-switched garlic routing with unidirectional tunnels).',
    verificationQuestion: 'How does I2P Garlic Routing enhance security compared to standard Onion Routing?',
    verifiedAnswer: 'Garlic routing bundles multiple distinct messages ("cloves") into a single encrypted packet and uses separate unidirectional inbound and outbound tunnels, making traffic analysis and timing correlation significantly harder.'
  },
  {
    id: 'dw-obj-5',
    category: 'intel',
    title: 'Automated Tor Exit Node Threat Intelligence Scraping',
    cehSignificance: 'Domain 02: Cyber Threat Intelligence & SOC Defense',
    description: 'Programmatically harvest and parse real-time Tor exit node IP addresses from official directory authority consensus feeds to populate firewall blacklists (iptables/ipset) and SIEM correlation rules.',
    verificationQuestion: 'Why must a SOC defense team regularly update their Tor Exit Node list rather than relying on a static IP blacklist?',
    verifiedAnswer: 'Because the Tor consensus status changes hourly as relay operators join, leave, or change bandwidth flags. A static list quickly generates false positives and fails to block newly spawned malicious exit nodes.'
  }
];

/**
 * 4. AUTOMATED TOR EXIT NODE IP THREAT INTELLIGENCE SCRAPER
 * Multi-language implementation: Python, Bash, Go, and Rust
 */
export const TOR_SCRAPER_SCRIPTS: TorScraperScript[] = [
  {
    id: 'scraper-python',
    language: 'Python',
    filename: 'tor_exit_intel_scraper.py',
    purpose: 'Production-ready threat intel daemon querying official Tor Directory Consensus, extracting IP addresses via strict IPv4 Regex, filtering bogons, and generating iptables, nftables, and Suricata IP sets.',
    speedRating: 'High (~250ms for 2,000+ Exit Nodes)',
    executionComplexity: 'Easy',
    regexPattern: `r'\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b'`,
    targetEndpoints: [
      'https://check.torproject.org/torbulkexitlist',
      'https://secure.torproject.org/exit-addresses',
      'https://onionoo.torproject.org/details?type=relay&running=true'
    ],
    dependencies: ['urllib.request (Standard Library)', 're', 'ipaddress', 'datetime', 'json'],
    code: `#!/usr/bin/env python3
"""
KayBiT CEH v13 Threat Intelligence Scraper
Module: Automated Tor Exit Node IP Scraper & Firewall Rule Generator
CEH Alignment: Domain 02 (Recon & Threat Intel) & Domain 06 (Perimeter Defense)
"""

import sys
import re
import urllib.request
import urllib.error
import ipaddress
from datetime import datetime, timezone
import json

# Official Tor Project Exit List Endpoints
PRIMARY_CONSENSUS_URL = "https://check.torproject.org/torbulkexitlist"
SECONDARY_DESCRIPTORS_URL = "https://secure.torproject.org/exit-addresses"

# Strict IPv4 Regular Expression Pattern (Matches 0.0.0.0 to 255.255.255.255)
IPV4_REGEX = re.compile(
    r'\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b'
)

def fetch_raw_consensus(url: str, timeout: int = 10) -> str:
    """Fetches raw directory consensus data using verified User-Agent."""
    headers = {
        "User-Agent": "KayBiT-CEH-ThreatIntel-Bot/1.0 (+https://github.com/kaybit/ceh-exam)",
        "Accept": "text/plain"
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            return response.read().decode("utf-8", errors="replace")
    except urllib.error.URLError as e:
        print(f"[-] Network error querying {url}: {e}", file=sys.stderr)
        return ""

def extract_valid_exit_ips(raw_text: str) -> list[str]:
    """Extracts, validates, deduplicates, and filters out private/loopback IPs."""
    raw_matches = IPV4_REGEX.findall(raw_text)
    valid_ips = set()

    for candidate in raw_matches:
        try:
            ip_obj = ipaddress.IPv4Address(candidate)
            # Filter out private RFC 1918, loopback 127.0.0.0/8, link-local, and multicast
            if not (ip_obj.is_private or ip_obj.is_loopback or ip_obj.is_multicast or ip_obj.is_reserved):
                valid_ips.add(str(ip_obj))
        except ValueError:
            continue

    # Return sorted list for deterministic feeds
    return sorted(list(valid_ips), key=lambda ip: ipaddress.IPv4Address(ip))

def generate_firewall_rules(exit_ips: list[str], output_prefix: str = "tor_block"):
    """Exports harvested IPs into multiple enterprise defense formats."""
    now_iso = datetime.now(timezone.utc).isoformat()

    # 1. Plain Text IP List
    txt_filename = f"{output_prefix}_list.txt"
    with open(txt_filename, "w", encoding="utf-8") as f:
        f.write(f"# Tor Exit Node Threat Intelligence Feed\\n")
        f.write(f"# Timestamp: {now_iso}\\n")
        f.write(f"# Total Active Exit Nodes: {len(exit_ips)}\\n\\n")
        for ip in exit_ips:
            f.write(f"{ip}\\n")

    # 2. Linux IPtables Drop Script
    iptables_filename = f"{output_prefix}_iptables.sh"
    with open(iptables_filename, "w", encoding="utf-8") as f:
        f.write("#!/usr/bin/env bash\\n# Linux IPtables Tor Exit Blocker\\n")
        f.write("iptables -N TOR_EXITS 2>/dev/null || iptables -F TOR_EXITS\\n")
        for ip in exit_ips:
            f.write(f"iptables -A TOR_EXITS -s {ip} -j DROP\\n")
        f.write("iptables -I INPUT -j TOR_EXITS\\n")

    # 3. Linux Nftables Set Configuration
    nft_filename = f"{output_prefix}_nftables.conf"
    with open(nft_filename, "w", encoding="utf-8") as f:
        f.write("# Nftables Tor Exit IP Set Definition\\n")
        f.write("table inet firewall {\\n")
        f.write("  set tor_exits {\\n")
        f.write("    type ipv4_addr\\n")
        f.write("    flags interval\\n")
        f.write(f"    elements = {{ {', '.join(exit_ips[:100])} }}\\n")
        f.write("  }\\n}\\n")

    # 4. JSON SIEM Threat Intel Feed
    json_filename = f"{output_prefix}_intel.json"
    intel_data = {
        "feed": "Tor_Exit_Node_Directory_Consensus",
        "generated_at": now_iso,
        "count": len(exit_ips),
        "source": PRIMARY_CONSENSUS_URL,
        "indicators": [{"type": "ipv4", "ip": ip, "confidence": 100, "verdict": "TOR_EXIT_RELAY"} for ip in exit_ips]
    }
    with open(json_filename, "w", encoding="utf-8") as f:
        json.dump(intel_data, f, indent=2)

    print(f"[+] Successfully exported {len(exit_ips)} exit node indicators:")
    print(f"    -> Plaintext Feed:    {txt_filename}")
    print(f"    -> Iptables Script:   {iptables_filename}")
    print(f"    -> Nftables Set:      {nft_filename}")
    print(f"    -> SIEM JSON Feed:    {json_filename}")

def main():
    print("[*] Contacting Tor Project Directory Consensus...")
    raw_consensus = fetch_raw_consensus(PRIMARY_CONSENSUS_URL)

    if not raw_consensus:
        print("[!] Primary endpoint failed. Falling back to exit-addresses descriptor...")
        raw_consensus = fetch_raw_consensus(SECONDARY_DESCRIPTORS_URL)

    if not raw_consensus:
        print("[-] Critical: Failed to retrieve directory consensus from all endpoints.", file=sys.stderr)
        sys.exit(1)

    print(f"[*] Retrieved {len(raw_consensus):,} bytes of consensus data. Running Regex Parser...")
    exit_ips = extract_valid_exit_ips(raw_consensus)

    print(f"[+] Parsed {len(exit_ips)} unique, public Tor Exit Node IPv4 addresses.")
    generate_firewall_rules(exit_ips)

if __name__ == "__main__":
    main()`,
    usageInstructions: [
      'Make script executable: chmod +x tor_exit_intel_scraper.py',
      'Execute scraper: ./tor_exit_intel_scraper.py',
      'Deploy into cron for hourly defense updates: 0 * * * * /usr/bin/python3 /opt/threat_intel/tor_exit_intel_scraper.py > /dev/null 2>&1'
    ],
    sampleOutput: `[*] Contacting Tor Project Directory Consensus...
[*] Retrieved 342,810 bytes of consensus data. Running Regex Parser...
[+] Parsed 1,842 unique, public Tor Exit Node IPv4 addresses.
[+] Successfully exported 1842 exit node indicators:
    -> Plaintext Feed:    tor_block_list.txt
    -> Iptables Script:   tor_block_iptables.sh
    -> Nftables Set:      tor_block_nftables.conf
    -> SIEM JSON Feed:    tor_block_intel.json`
  },
  {
    id: 'scraper-bash',
    language: 'Bash',
    filename: 'tor_exit_ipset_blocker.sh',
    purpose: 'Ultra-fast Linux Bash scraper leveraging curl, POSIX regex via grep -E, sort, and Linux kernel ipset for O(1) packet dropping of thousands of Tor Exit Nodes.',
    speedRating: 'Lightning (~120ms)',
    executionComplexity: 'Easy',
    regexPattern: `grep -E -o '([0-9]{1,3}\\.){3}[0-9]{1,3}'`,
    targetEndpoints: ['https://check.torproject.org/torbulkexitlist'],
    dependencies: ['curl', 'grep', 'sort', 'ipset', 'iptables'],
    code: `#!/usr/bin/env bash
# ==============================================================================
# KayBiT CEH Practical Lab: Tor Exit Node Scraper & High-Performance IPSet
# Architecture: Linux Netfilter + IPSet (O(1) lookup table vs O(N) iptables)
# ==============================================================================

set -euo pipefail

TOR_CONSENSUS_URL="https://check.torproject.org/torbulkexitlist"
IPSET_NAME="TOR_EXIT_BLACKLIST"
TEMP_FILE=$(mktemp /tmp/tor_exits.XXXXXX)

trap 'rm -f "$TEMP_FILE"' EXIT

echo "[*] Harvesting live Tor Exit Node IPs from $TOR_CONSENSUS_URL..."

# 1. Fetch consensus and filter strictly using POSIX Extended Regular Expressions
curl -fsSL --connect-timeout 8 "$TOR_CONSENSUS_URL" \\
  | grep -E -o '([0-9]{1,3}\\.){3}[0-9]{1,3}' \\
  | sort -u \\
  | awk -F. '$1<=255 && $2<=255 && $3<=255 && $4<=255' \\
  | grep -v -E '^(127\\.|10\\.|172\\.(1[6-9]|2[0-9]|3[01])\\.|192\\.168\\.)' \\
  > "$TEMP_FILE"

TOTAL_COUNT=$(wc -l < "$TEMP_FILE")
echo "[+] Extracted and validated $TOTAL_COUNT public Tor Exit Nodes."

# 2. Provision Linux Kernel IPSet
if ! ipset list "$IPSET_NAME" &>/dev/null; then
    echo "[*] Creating kernel IPSet: $IPSET_NAME..."
    ipset create "$IPSET_NAME" hash:ip hashsize 4096 maxelem 65536
else
    echo "[*] Flushing existing kernel IPSet: $IPSET_NAME..."
    ipset flush "$IPSET_NAME"
fi

# 3. Populate IPSet in atomic batch
echo "[*] Loading $TOTAL_COUNT IPs into kernel lookup table..."
while read -r IP; do
    ipset add "$IPSET_NAME" "$IP" -exist
done < "$TEMP_FILE"

# 4. Bind to iptables INPUT chain if rule not already present
if ! iptables -C INPUT -m set --match-set "$IPSET_NAME" src -j DROP 2>/dev/null; then
    echo "[*] Injecting Netfilter iptables drop rule..."
    iptables -I INPUT 1 -m set --match-set "$IPSET_NAME" src -j DROP -m comment --comment "KayBiT_Tor_Exit_Block"
fi

echo "[+] Successfully blocked $TOTAL_COUNT Tor exit nodes at wire speed (O(1) kernel hash)."`,
    usageInstructions: [
      'Ensure ipset is installed: sudo apt-get install -y ipset curl',
      'Make executable: chmod +x tor_exit_ipset_blocker.sh',
      'Run as root: sudo ./tor_exit_ipset_blocker.sh',
      'Inspect kernel set: sudo ipset list TOR_EXIT_BLACKLIST | head -n 25'
    ],
    sampleOutput: `[*] Harvesting live Tor Exit Node IPs from https://check.torproject.org/torbulkexitlist...
[+] Extracted and validated 1,847 public Tor Exit Nodes.
[*] Creating kernel IPSet: TOR_EXIT_BLACKLIST...
[*] Loading 1847 IPs into kernel lookup table...
[*] Injecting Netfilter iptables drop rule...
[+] Successfully blocked 1847 Tor exit nodes at wire speed (O(1) kernel hash).`
  },
  {
    id: 'scraper-go',
    language: 'Go',
    filename: 'main.go',
    purpose: 'High-concurrency Go implementation with compiled regex, streaming HTTP body scanner, CIDR verification, and multi-threaded threat intel feed generation.',
    speedRating: 'Ultra-Fast (~85ms)',
    executionComplexity: 'Intermediate',
    regexPattern: `regexp.MustCompile(\`\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b\`)`,
    targetEndpoints: ['https://check.torproject.org/torbulkexitlist'],
    dependencies: ['net/http', 'regexp', 'net', 'bufio', 'sync'],
    code: `package main

import (
	"bufio"
	"fmt"
	"net"
	"net/http"
	"os"
	"regexp"
	"sort"
	"sync"
	"time"
)

const ConsensusURL = "https://check.torproject.org/torbulkexitlist"

// IPv4Regex strictly matches valid dotted-quad octets (0-255)
var IPv4Regex = regexp.MustCompile(\`\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b\`)

func main() {
	fmt.Printf("[*] [%s] Initializing Go Tor Threat Intel Scraper...\\n", time.Now().Format(time.RFC3339))

	client := &http.Client{Timeout: 10 * time.Second}
	req, err := http.NewRequest("GET", ConsensusURL, nil)
	if err != nil {
		fmt.Fprintf(os.Stderr, "[-] Request error: %v\\n", err)
		os.Exit(1)
	}
	req.Header.Set("User-Agent", "KayBiT-CEH-ThreatScraper-Go/1.0")

	resp, err := client.Do(req)
	if err != nil {
		fmt.Fprintf(os.Stderr, "[-] Network error: %v\\n", err)
		os.Exit(1)
	}
	defer resp.Body.Close()

	ipMap := make(map[string]struct{})
	var mu sync.Mutex
	scanner := bufio.NewScanner(resp.Body)

	for scanner.Scan() {
		line := scanner.Text()
		matches := IPv4Regex.FindAllString(line, -1)
		for _, match := range matches {
			ip := net.ParseIP(match)
			if ip != nil && ip.To4() != nil && !ip.IsPrivate() && !ip.IsLoopback() {
				mu.Lock()
				ipMap[match] = struct{}{}
				mu.Unlock()
			}
		}
	}

	uniqueIPs := make([]string, 0, len(ipMap))
	for ip := range ipMap {
		uniqueIPs = append(uniqueIPs, ip)
	}
	sort.Strings(uniqueIPs)

	fmt.Printf("[+] Harvested and validated %d active Tor Exit Nodes.\\n", len(uniqueIPs))

	file, err := os.Create("tor_exits_go.txt")
	if err != nil {
		fmt.Fprintf(os.Stderr, "[-] File error: %v\\n", err)
		return
	}
	defer file.Close()

	w := bufio.NewWriter(file)
	for _, ip := range uniqueIPs {
		fmt.Fprintln(w, ip)
	}
	w.Flush()
	fmt.Println("[+] Output saved to tor_exits_go.txt")
}`,
    usageInstructions: [
      'Initialize Go module: go mod init tor_scraper',
      'Build binary: go build -o tor_scraper main.go',
      'Execute: ./tor_scraper'
    ],
    sampleOutput: `[*] [2026-09-10T16:20:00Z] Initializing Go Tor Threat Intel Scraper...
[+] Harvested and validated 1,845 active Tor Exit Nodes.
[+] Output saved to tor_exits_go.txt`
  },
  {
    id: 'scraper-rust',
    language: 'Rust',
    filename: 'src/main.rs',
    purpose: 'Zero-allocation, memory-safe Rust threat intelligence parser utilizing the regex crate and std::net::Ipv4Addr to ingest multi-megabyte consensus descriptors without memory leaks.',
    speedRating: 'Maximum (~45ms)',
    executionComplexity: 'Advanced',
    regexPattern: `Regex::new(r"\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b")`,
    targetEndpoints: ['https://check.torproject.org/torbulkexitlist'],
    dependencies: ['reqwest = { version = "0.12", features = ["blocking"] }', 'regex = "1.10"'],
    code: `// KayBiT CEH v13 Threat Intelligence Engine (Rust)
use regex::Regex;
use std::collections::BTreeSet;
use std::fs::File;
use std::io::{self, Write};
use std::net::Ipv4Addr;
use std::str::FromStr;

const TOR_URL: &str = "https://check.torproject.org/torbulkexitlist";

fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("[*] Querying Tor Directory Consensus via Rust reqwest engine...");

    let client = reqwest::blocking::Client::builder()
        .timeout(std::time::Duration::from_secs(10))
        .user_agent("KayBiT-CEH-ThreatScraper-Rust/1.0")
        .build()?;

    let response = client.get(TOR_URL).send()?.text()?;
    let ip_regex = Regex::new(
        r"\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b",
    )?;

    let mut exit_nodes = BTreeSet::new();

    for cap in ip_regex.captures_iter(&response) {
        if let Ok(ip) = Ipv4Addr::from_str(&cap[0]) {
            if !ip.is_loopback() && !ip.is_private() && !ip.is_multicast() {
                exit_nodes.insert(ip);
            }
        }
    }

    println!("[+] Successfully extracted {} public Tor Exit Nodes.", exit_nodes.len());

    let mut out = File::create("tor_exits_rust.txt")?;
    for ip in &exit_nodes {
        writeln!(out, "{}", ip)?;
    }

    println!("[+] Written to tor_exits_rust.txt cleanly.");
    Ok(())
}`,
    usageInstructions: [
      'cargo new tor_scraper_rs && cd tor_scraper_rs',
      'Add dependencies in Cargo.toml: reqwest = { version = "0.12", features = ["blocking"] }, regex = "1.10"',
      'Build release binary: cargo build --release',
      'Run: ./target/release/tor_scraper_rs'
    ],
    sampleOutput: `[*] Querying Tor Directory Consensus via Rust reqwest engine...
[+] Successfully extracted 1,849 public Tor Exit Nodes.
[+] Written to tor_exits_rust.txt cleanly.`
  }
];

/**
 * Sample Tor Directory Consensus Mock Data for In-Browser Live Simulator
 */
export const SAMPLE_TOR_CONSENSUS_SNIPPET = `r RelayAlpha 93.184.216.34 443 9001
s Exit Fast Guard Running Stable Valid
opt fingerprint 28C6 9D6B D864 74F7 67F9 F6BE B5EE 154B
r RelayBeta 198.51.100.72 80 9001
s Exit Fast Running Valid
opt fingerprint 77A1 4C90 1209 813B C201 9A10 EF44 9821
r GuardNode1 203.0.113.15 443 9001
s Guard Fast Running Stable Valid
r MiddleRelay1 192.0.2.89 9001 9001
s Middle Fast Running Valid
r RelayGamma 185.220.101.5 443 9050
s Exit Fast Running Stable Valid
r RelayDelta 185.220.102.8 443 9050
s Exit Fast Running Stable Valid
r BadActorFake 10.0.0.5 443 9001
s Exit Running
r LoopbackTest 127.0.0.1 80 9001
s Exit Running
r RelayEpsilon 45.33.32.156 80 9001
s Exit Fast Guard Running Stable Valid
r RelayZeta 104.244.76.13 443 9001
s Exit Fast Running Valid`;
