import { useState } from 'react';

type DomainColor = { bg: string; badge: string; light: string; text: string };
type GenericSkill = { name: string; prereqs: string[]; levels: string[] };
type GenericCategory = { name: string; bridging?: string; skills: GenericSkill[] };
type GenericDomain = { domain: string; icon: string; note?: string; categories: GenericCategory[] };
type CompanySkill = { area: string; desc: string };
type CompanyLevel = {
    level: string;
    title: string;
    scope: string;
    comp: string;
    summary: string;
    skills: CompanySkill[];
    prereqs: string[];
};
type CompanyData = {
    name: string;
    icon: string;
    accentBg: string;
    accentText: string;
    accentBorder: string;
    description: string;
    levels: CompanyLevel[];
};

const getDomainColor = (domain: string): DomainColor => {
    return DOMAIN_COLORS[domain as keyof typeof DOMAIN_COLORS] ?? DOMAIN_COLORS.Programming;
};

const LEVELS = ['L1', 'L2', 'L3', 'L4', 'L5'];
const LEVEL_NAMES = ['Beginner', 'Developing', 'Proficient', 'Advanced', 'Expert'];
const LEVEL_BG = ['#eff6ff', '#f0fdfa', '#fefce8', '#fff7ed', '#faf5ff'];
const LEVEL_TEXT = ['#1d4ed8', '#0f766e', '#854d0e', '#9a3412', '#6b21a8'];
const LEVEL_BORDER = ['#bfdbfe', '#99f6e4', '#fde68a', '#fed7aa', '#e9d5ff'];
const DOMAIN_COLORS = {
    Programming: { bg: '#1e293b', badge: '#3b82f6', light: '#eff6ff', text: '#1d4ed8' },
    Web: { bg: '#164e63', badge: '#06b6d4', light: '#ecfeff', text: '#0e7490' },
    Engineering: { bg: '#1e3a5f', badge: '#6366f1', light: '#eef2ff', text: '#4338ca' },
    'Cross-Cutting': { bg: '#3b1f5e', badge: '#a855f7', light: '#faf5ff', text: '#7e22ce' },
    'Cloud & Infra': { bg: '#064e3b', badge: '#10b981', light: '#ecfdf5', text: '#065f46' },
    Security: { bg: '#450a0a', badge: '#ef4444', light: '#fef2f2', text: '#b91c1c' },
    Data: { bg: '#431407', badge: '#f97316', light: '#fff7ed', text: '#c2410c' },
    Networking: { bg: '#1a2e05', badge: '#84cc16', light: '#f7fee7', text: '#3f6212' },
};

const genericMatrix: GenericDomain[] = [
    {
        domain: 'Programming',
        icon: '⌨️',
        categories: [
            {
                name: 'Scripting & Automation',
                skills: [
                    {
                        name: 'Scripting',
                        prereqs: [],
                        levels: [
                            'Writes simple single-purpose scripts with guidance',
                            'Writes scripts to automate repetitive tasks independently',
                            'Writes modular, reusable scripts with error handling and logging',
                            'Designs script libraries and frameworks for team reuse',
                            'Defines scripting standards and automation strategy org-wide',
                        ],
                    },
                ],
            },
            {
                name: 'Software Development',
                skills: [
                    {
                        name: 'Coding',
                        prereqs: [],
                        levels: [
                            'Writes basic code with syntax guidance',
                            'Implements features in an existing codebase with minor guidance',
                            'Writes clean, tested, maintainable code independently',
                            'Leads code quality initiatives; mentors others',
                            'Sets coding standards and drives engineering culture org-wide',
                        ],
                    },
                    {
                        name: 'Programming Paradigms',
                        prereqs: ['Coding L2'],
                        levels: [
                            'Familiar with one paradigm',
                            'Applies OOP or functional patterns',
                            'Fluidly uses multiple paradigms',
                            'Teaches paradigm selection across teams',
                            'Shapes org-wide approach to software design',
                        ],
                    },
                    {
                        name: 'Version Control',
                        prereqs: [],
                        levels: [
                            'Uses basic Git commands with guidance',
                            'Branches, merges, resolves conflicts independently',
                            'Designs branching strategies; enforces workflows',
                            'Defines VCS standards across teams',
                            'Drives source control strategy org-wide',
                        ],
                    },
                ],
            },
        ],
    },
    {
        domain: 'Web',
        icon: '🌐',
        categories: [
            {
                name: 'Frontend Development',
                skills: [
                    {
                        name: 'Frontend Development',
                        prereqs: ['Coding L2'],
                        levels: [
                            'Builds static pages using HTML/CSS',
                            'Builds interactive UI with a framework',
                            'Designs responsive, accessible UIs',
                            'Leads frontend architecture across a product',
                            'Defines frontend strategy and standards org-wide',
                        ],
                    },
                ],
            },
            {
                name: 'Backend Development',
                skills: [
                    {
                        name: 'Backend Development',
                        prereqs: ['Coding L2'],
                        levels: [
                            'Implements simple CRUD endpoints',
                            'Builds and maintains APIs independently',
                            'Designs scalable backend services',
                            'Leads backend architecture across services',
                            'Defines backend platform strategy',
                        ],
                    },
                    {
                        name: 'Full Stack Development',
                        prereqs: ['Frontend Development L2', 'Backend Development L2'],
                        levels: [
                            'Makes small guided changes across the stack',
                            'Builds complete features end-to-end with guidance',
                            'Delivers full-stack features with production quality',
                            'Designs and owns full-stack systems',
                            'Drives full-stack engineering vision',
                        ],
                    },
                ],
            },
            {
                name: 'DevOps',
                skills: [
                    {
                        name: 'DevOps & CI/CD',
                        prereqs: ['Scripting L2', 'Version Control L2'],
                        levels: [
                            'Understands CI/CD; runs existing pipelines',
                            'Configures and maintains pipelines',
                            'Designs CI/CD systems; implements IaC',
                            'Leads DevOps transformation',
                            'Defines DevOps and SRE strategy org-wide',
                        ],
                    },
                ],
            },
        ],
    },
    {
        domain: 'Engineering',
        icon: '⚙️',
        categories: [
            {
                name: 'Software Engineering',
                skills: [
                    {
                        name: 'Engineering Practices',
                        prereqs: ['Coding L2', 'Version Control L2'],
                        levels: [
                            'Follows established processes',
                            'Applies best practices consistently',
                            'Elevates team practices and tooling',
                            'Defines engineering practices at org level',
                            'Sets engineering excellence standards org-wide',
                        ],
                    },
                ],
            },
            {
                name: 'Architecture',
                skills: [
                    {
                        name: 'System Design',
                        prereqs: ['Backend Development L3'],
                        levels: [
                            'Understands basic system components',
                            'Designs simple systems with guidance',
                            'Designs scalable systems for a product',
                            'Leads architecture for a domain',
                            'Defines architectural vision for the org',
                        ],
                    },
                    {
                        name: 'Technical Architecture',
                        prereqs: ['System Design L3'],
                        levels: [
                            'Reads architecture diagrams',
                            'Contributes to architectural decisions',
                            'Owns architecture for a service area',
                            'Drives architectural standards across teams',
                            'Shapes long-term technical strategy',
                        ],
                    },
                ],
            },
        ],
    },
    {
        domain: 'Cross-Cutting',
        icon: '🔗',
        note: 'Bridges multiple domains.',
        categories: [
            {
                name: 'Testing & QA',
                bridging: 'Programming ↔ Engineering',
                skills: [
                    {
                        name: 'Testing & QA',
                        prereqs: ['Coding L1'],
                        levels: [
                            'Writes basic unit tests with guidance',
                            'Writes unit and integration tests independently',
                            'Designs test strategies; introduces TDD/BDD',
                            'Owns quality engineering; builds automated QA pipelines',
                            'Defines org-wide quality standards and testing culture',
                        ],
                    },
                ],
            },
            {
                name: 'API Design',
                bridging: 'Frontend ↔ Backend',
                skills: [
                    {
                        name: 'API Design',
                        prereqs: ['Backend Development L2', 'Frontend Development L2'],
                        levels: [
                            'Consumes APIs; understands REST basics',
                            'Designs simple RESTful endpoints',
                            'Designs clean, versioned APIs',
                            'Leads API design standards; introduces GraphQL/gRPC',
                            'Defines API strategy and governance org-wide',
                        ],
                    },
                ],
            },
            {
                name: 'Observability & Monitoring',
                bridging: 'DevOps ↔ Engineering',
                skills: [
                    {
                        name: 'Observability',
                        prereqs: ['DevOps & CI/CD L2'],
                        levels: [
                            'Reads dashboards and alerts',
                            'Adds instrumentation; creates dashboards',
                            'Designs observability strategy for a service',
                            'Leads observability platform; drives SLO/SLA culture',
                            'Defines org-wide observability standards',
                        ],
                    },
                ],
            },
            {
                name: 'Documentation',
                bridging: 'All domains',
                skills: [
                    {
                        name: 'Technical Documentation',
                        prereqs: [],
                        levels: [
                            'Writes basic READMEs and comments',
                            'Documents features, APIs, and runbooks',
                            'Establishes docs standards for a team',
                            'Drives documentation culture org-wide',
                            'Defines org-wide knowledge management strategy',
                        ],
                    },
                ],
            },
        ],
    },
    {
        domain: 'Cloud & Infra',
        icon: '☁️',
        categories: [
            {
                name: 'Cloud Platforms',
                skills: [
                    {
                        name: 'Cloud Services',
                        prereqs: ['DevOps & CI/CD L2'],
                        levels: [
                            'Uses managed cloud services with guidance',
                            'Deploys and manages cloud resources independently',
                            'Designs cloud architectures; optimizes cost',
                            'Leads multi-cloud or hybrid strategies',
                            'Defines cloud platform strategy org-wide',
                        ],
                    },
                ],
            },
            {
                name: 'Infrastructure as Code',
                skills: [
                    {
                        name: 'IaC',
                        prereqs: ['Cloud Services L2', 'Scripting L2'],
                        levels: [
                            'Reads existing IaC templates',
                            'Writes and applies IaC for simple changes',
                            'Designs full IaC-driven environments',
                            'Leads IaC strategy across teams',
                            'Defines infrastructure automation standards',
                        ],
                    },
                ],
            },
            {
                name: 'Containers & Orchestration',
                skills: [
                    {
                        name: 'Containers',
                        prereqs: ['DevOps & CI/CD L2'],
                        levels: [
                            'Runs Docker containers with guidance',
                            'Builds and manages container images independently',
                            'Designs containerized architectures',
                            'Leads Kubernetes strategy for a team',
                            'Defines container standards org-wide',
                        ],
                    },
                ],
            },
        ],
    },
    {
        domain: 'Security',
        icon: '🔒',
        categories: [
            {
                name: 'Application Security',
                skills: [
                    {
                        name: 'Secure Coding',
                        prereqs: ['Coding L2'],
                        levels: [
                            'Aware of OWASP Top 10',
                            'Applies secure coding practices consistently',
                            'Conducts threat modeling; integrates security in dev lifecycle',
                            'Leads AppSec program; champions shift-left',
                            'Defines application security strategy org-wide',
                        ],
                    },
                ],
            },
            {
                name: 'Infrastructure Security',
                skills: [
                    {
                        name: 'Infra Security',
                        prereqs: ['Cloud Services L2'],
                        levels: [
                            'Understands least privilege and firewalls',
                            'Configures IAM, security groups, and hardening',
                            'Designs secure cloud architectures; conducts reviews',
                            'Leads infrastructure security posture',
                            'Defines security architecture and zero-trust org-wide',
                        ],
                    },
                ],
            },
            {
                name: 'Security Operations',
                skills: [
                    {
                        name: 'SecOps',
                        prereqs: ['Observability L2'],
                        levels: [
                            'Monitors alerts; escalates per playbook',
                            'Triages and responds to incidents independently',
                            'Builds detection rules and response playbooks',
                            'Leads SOC and threat intelligence program',
                            'Defines SecOps maturity model org-wide',
                        ],
                    },
                ],
            },
        ],
    },
    {
        domain: 'Data',
        icon: '🗄️',
        categories: [
            {
                name: 'Databases',
                skills: [
                    {
                        name: 'SQL & Relational DBs',
                        prereqs: [],
                        levels: [
                            'Writes basic SELECT queries',
                            'Writes complex queries; designs simple schemas',
                            'Optimizes queries; designs normalized schemas',
                            'Leads DB architecture; implements replication/sharding',
                            'Defines data storage standards and governance',
                        ],
                    },
                    {
                        name: 'NoSQL & Distributed DBs',
                        prereqs: ['SQL & Relational DBs L2'],
                        levels: [
                            'Understands SQL vs NoSQL',
                            'Uses a NoSQL DB independently',
                            'Selects and designs the right data store per workload',
                            'Leads multi-model data architecture',
                            'Defines data platform strategy including streaming',
                        ],
                    },
                ],
            },
            {
                name: 'Data Engineering',
                skills: [
                    {
                        name: 'Data Pipelines',
                        prereqs: ['SQL & Relational DBs L2', 'Scripting L2'],
                        levels: [
                            'Understands ETL; runs existing pipelines',
                            'Builds simple ETL/ELT pipelines',
                            'Designs reliable, scalable data pipelines',
                            'Leads data platform architecture',
                            'Defines org-wide data engineering standards',
                        ],
                    },
                ],
            },
        ],
    },
    {
        domain: 'Networking',
        icon: '🌍',
        categories: [
            {
                name: 'Network Fundamentals',
                skills: [
                    {
                        name: 'Networking Basics',
                        prereqs: [],
                        levels: [
                            'Understands IP, DNS, HTTP/S, TCP/IP model',
                            'Configures network settings; troubleshoots connectivity',
                            'Designs subnets, VPNs, and routing',
                            'Leads network architecture; implements SDN',
                            'Defines networking strategy org-wide',
                        ],
                    },
                ],
            },
            {
                name: 'Network Security',
                skills: [
                    {
                        name: 'Network Security',
                        prereqs: ['Networking Basics L2', 'Infra Security L1'],
                        levels: [
                            'Understands firewalls, VLANs, hardening basics',
                            'Configures firewalls, load balancers, VPN gateways',
                            'Designs secure network architectures',
                            'Leads network security posture across environments',
                            'Defines network security standards org-wide',
                        ],
                    },
                ],
            },
        ],
    },
];

// ── COMPANY DATA ──────────────────────────────────────────────────────────────
const companies = {
    aws: {
        name: 'AWS',
        icon: '🟠',
        accentBg: '#fff7ed',
        accentText: '#c2410c',
        accentBorder: '#fed7aa',
        description:
            'Levels L4–L10. Culture driven by 16 Leadership Principles. Strong emphasis on Ownership and operational excellence.',
        levels: [
            {
                level: 'L4',
                title: 'SDE II',
                scope: 'Team',
                comp: '$150–200k',
                summary: 'Independently delivers features; beginning cross-team collaboration.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Designs and implements medium-complexity features. Writes high-quality, well-tested code. Contributes to system design within a team.',
                    },
                    {
                        area: 'Ownership',
                        desc: 'Takes end-to-end ownership of components including oncall. Proactively identifies and resolves operational issues.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Works effectively across teams. Participates in design reviews. Provides constructive code review feedback.',
                    },
                    {
                        area: 'Leadership Principles',
                        desc: 'Demonstrates Customer Obsession, Ownership, and Deliver Results consistently at the IC level.',
                    },
                ],
                prereqs: [],
            },
            {
                level: 'L5',
                title: 'SDE III',
                scope: 'Team–Domain',
                comp: '$180–250k',
                summary: 'Senior IC; drives significant technical scope and mentors others.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Designs complex systems; leads technical direction for a project. Identifies architectural issues proactively.',
                    },
                    {
                        area: 'Ownership',
                        desc: 'Owns services in production. Sets the bar for operational excellence. Reduces toil through automation.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Mentors L4s. Influences roadmap through data and technical recommendations. Drives team alignment.',
                    },
                    {
                        area: 'Leadership Principles',
                        desc: 'Demonstrates Dive Deep, Invent and Simplify, Are Right A Lot. Earns trust with stakeholders.',
                    },
                ],
                prereqs: ['L4'],
            },
            {
                level: 'L6',
                title: 'Principal SDE',
                scope: 'Domain',
                comp: '$220–320k',
                summary: 'Principal; drives technical strategy across a domain.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Sets technical direction for a domain. Makes architectural decisions spanning multiple teams.',
                    },
                    {
                        area: 'Ownership',
                        desc: 'Owns reliability and efficiency across multiple services. Drives large-scale migrations.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Partners with senior PMs and managers. Influences hiring bar. Drives cross-org alignment.',
                    },
                    {
                        area: 'Leadership Principles',
                        desc: 'Models Think Big, Bias for Action. Actively grows others through standards and patterns.',
                    },
                ],
                prereqs: ['L5'],
            },
            {
                level: 'L7',
                title: 'Senior Principal SDE',
                scope: 'Org / VP',
                comp: '$300–450k',
                summary: 'Senior Principal; shapes strategy at VP org level.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Owns the technical strategy for a major product area. Introduces paradigms that reshape how teams build.',
                    },
                    {
                        area: 'Ownership',
                        desc: 'Accountable for multi-year technical outcomes. Partners on business strategy.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Works with VPs and Directors. Represents Amazon externally. Shapes hiring and promotion bar.',
                    },
                    {
                        area: 'Leadership Principles',
                        desc: 'Demonstrates Have Backbone; Disagree and Commit and Hire and Develop the Best at org level.',
                    },
                ],
                prereqs: ['L6'],
            },
            {
                level: 'L8',
                title: 'Distinguished Engineer',
                scope: 'Business Unit',
                comp: '$450–700k+',
                summary: 'Distinguished; company-wide technical authority.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Defines technical vision for an entire business unit. Identifies strategic bets 3–5 years out.',
                    },
                    {
                        area: 'Ownership',
                        desc: 'Accountable for technical outcomes that directly affect P&L. Drives standards adopted across Amazon.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Advises S-team execs. Represents Amazon with partners and regulators.',
                    },
                    {
                        area: 'Leadership Principles',
                        desc: 'Embodies all 16 LPs; role model for senior technical leadership across the company.',
                    },
                ],
                prereqs: ['L7'],
            },
            {
                level: 'L9',
                title: 'VP & Distinguished Engineer',
                scope: 'Amazon-wide',
                comp: '$700k–$1.5M+',
                summary: "VP-level fellow; defines Amazon's multi-year engineering direction.",
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Sets technical strategy for Amazon globally. Owns decisions affecting hundreds of millions of customers.',
                    },
                    {
                        area: 'Ownership',
                        desc: 'Responsible for foundational platform choices underpinning AWS, retail, Alexa.',
                    },
                    { area: 'Collaboration', desc: 'Partners with C-suite. External face of Amazon technology.' },
                    {
                        area: 'Leadership Principles',
                        desc: 'Defines what LPs mean in practice at the highest level. Shapes culture through direct coaching.',
                    },
                ],
                prereqs: ['L8'],
            },
            {
                level: 'L10',
                title: 'SVP & Fellow',
                scope: 'Amazon-wide',
                comp: 'Executive / equity-dominant',
                summary: 'SVP Fellow; rarest technical distinction for transformative leaders.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Responsible for transformative platform shifts (e.g., AWS itself). Defines decade-long trajectories.',
                    },
                    {
                        area: 'Ownership',
                        desc: 'Accountable to Board and shareholders. Shapes M&A through a technical lens.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Board-level visibility. Represents Amazon at highest levels of industry and government.',
                    },
                    {
                        area: 'Leadership Principles',
                        desc: 'Has materially shaped the Leadership Principles themselves.',
                    },
                ],
                prereqs: ['L9'],
            },
        ],
    },
    meta: {
        name: 'Meta',
        icon: '🔵',
        accentBg: '#eff6ff',
        accentText: '#1d4ed8',
        accentBorder: '#bfdbfe',
        description:
            'Levels E3–E10. Impact-first culture. Promotion driven by demonstrated scope of impact, not tenure.',
        levels: [
            {
                level: 'E3',
                title: 'Software Engineer',
                scope: 'Task',
                comp: '$140–180k',
                summary: 'Entry-level; executes well-scoped tasks with guidance.',
                skills: [
                    {
                        area: 'Technical Execution',
                        desc: 'Completes assigned tasks on time. Writes clean, well-tested code. Participates meaningfully in code reviews.',
                    },
                    {
                        area: 'Communication',
                        desc: 'Communicates progress and blockers clearly. Writes understandable design docs for small features.',
                    },
                    {
                        area: 'Impact',
                        desc: 'Delivers individual features and bug fixes. Contributes to team velocity.',
                    },
                    { area: 'Growth', desc: "Actively seeks feedback. Learning Meta's stack, systems, and culture." },
                ],
                prereqs: [],
            },
            {
                level: 'E4',
                title: 'Software Engineer',
                scope: 'Feature',
                comp: '$175–240k',
                summary: 'Mid-level; independently delivers features and influences team approach.',
                skills: [
                    {
                        area: 'Technical Execution',
                        desc: 'Independently designs and ships multi-week features. Identifies edge cases and operational concerns proactively.',
                    },
                    {
                        area: 'Communication',
                        desc: 'Writes solid design docs. Presents designs to the team. Gives actionable code review feedback.',
                    },
                    {
                        area: 'Impact',
                        desc: 'Delivers impactful product features. Improves team processes through example.',
                    },
                    { area: 'Growth', desc: 'Mentors E3s informally. Starts developing a technical point of view.' },
                ],
                prereqs: ['E3'],
            },
            {
                level: 'E5',
                title: 'Senior Software Engineer',
                scope: 'Project',
                comp: '$230–340k',
                summary: 'Senior engineer; leads projects and raises team bar.',
                skills: [
                    {
                        area: 'Technical Execution',
                        desc: 'Leads design and implementation of complex projects. Makes pragmatic tradeoffs.',
                    },
                    {
                        area: 'Communication',
                        desc: 'Drives alignment across teams on design decisions. Writes detailed technical specs.',
                    },
                    {
                        area: 'Impact',
                        desc: 'Drives cross-team projects to completion. Improves reliability or developer productivity at scale.',
                    },
                    {
                        area: 'Growth',
                        desc: 'Actively mentors E3–E4. Sets high technical bar through PR reviews and design critique.',
                    },
                ],
                prereqs: ['E4'],
            },
            {
                level: 'E6',
                title: 'Staff Software Engineer',
                scope: 'Team of teams',
                comp: '$320–500k',
                summary: 'Staff; defines technical direction for a product area.',
                skills: [
                    {
                        area: 'Technical Execution',
                        desc: 'Owns the technical roadmap for a product or platform area. Drives multi-quarter architectural initiatives.',
                    },
                    {
                        area: 'Communication',
                        desc: 'Partners with Director-level leadership. Shapes OKRs from a technical perspective.',
                    },
                    {
                        area: 'Impact',
                        desc: 'Creates leverage across multiple teams. Introduces patterns improving org-wide velocity.',
                    },
                    {
                        area: 'Growth',
                        desc: 'Grows E5s into senior roles. Builds technical community (guilds, working groups, RFCs).',
                    },
                ],
                prereqs: ['E5'],
            },
            {
                level: 'E7',
                title: 'Senior Staff Engineer',
                scope: 'Org',
                comp: '$450–700k',
                summary: 'Senior Staff; shapes technology strategy across an org.',
                skills: [
                    {
                        area: 'Technical Execution',
                        desc: 'Defines multi-year technical strategy for a major org. Resolves the most complex, ambiguous challenges at Meta.',
                    },
                    {
                        area: 'Communication',
                        desc: 'Advises VPs on technical strategy. Produces org-wide technical vision documents.',
                    },
                    {
                        area: 'Impact',
                        desc: 'Responsible for technical outcomes spanning orgs. Creates frameworks adopted company-wide.',
                    },
                    { area: 'Growth', desc: 'Sponsors E5–E6 engineers. Shapes technical culture of an entire org.' },
                ],
                prereqs: ['E6'],
            },
            {
                level: 'E8',
                title: 'Principal Engineer',
                scope: 'Meta-wide',
                comp: '$700k–$1.2M+',
                summary: 'Principal; company-wide technical authority.',
                skills: [
                    {
                        area: 'Technical Execution',
                        desc: "Sets technical direction for a fundamental part of Meta's infrastructure. Owns decisions affecting billions of users.",
                    },
                    { area: 'Communication', desc: 'Advises C-suite. Represents Meta externally as a thought leader.' },
                    {
                        area: 'Impact',
                        desc: "Defines what Meta's technical stack looks like 5+ years out. Drives paradigm shifts.",
                    },
                    {
                        area: 'Growth',
                        desc: 'Develops future Principal and Staff engineers. Defines engineering standards across Meta.',
                    },
                ],
                prereqs: ['E7'],
            },
            {
                level: 'E9',
                title: 'Distinguished Engineer',
                scope: 'Meta-wide',
                comp: '$1M–$2M+',
                summary: 'Distinguished; transformative technical impact at the company level.',
                skills: [
                    {
                        area: 'Technical Execution',
                        desc: 'Drives the most strategically important technical bets at Meta. Work shapes products used by 3B+ people.',
                    },
                    {
                        area: 'Communication',
                        desc: 'Partners with Mark Zuckerberg and C-suite directly on technical strategy.',
                    },
                    {
                        area: 'Impact',
                        desc: "Responsible for architectural foundations of Meta's core systems (React, Hack, TAO, Cassandra-scale infra).",
                    },
                    {
                        area: 'Growth',
                        desc: 'Shapes engineering culture and hiring bar across Meta. Mentors Principal Engineers.',
                    },
                ],
                prereqs: ['E8'],
            },
            {
                level: 'E10',
                title: 'Fellow',
                scope: 'Industry',
                comp: '$2M+',
                summary: 'Fellow; the highest individual technical distinction at Meta.',
                skills: [
                    {
                        area: 'Technical Execution',
                        desc: "Has personally created technologies that define an era of computing. Sets Meta's decade-long technical vision.",
                    },
                    {
                        area: 'Communication',
                        desc: "Industry-wide thought leader. External face of Meta's engineering philosophy.",
                    },
                    {
                        area: 'Impact',
                        desc: 'Work has redefined how the internet is built (e.g., open-source projects adopted industry-wide).',
                    },
                    {
                        area: 'Growth',
                        desc: 'Defines what great engineering means at Meta and for the industry at large.',
                    },
                ],
                prereqs: ['E9'],
            },
        ],
    },
    netflix: {
        name: 'Netflix',
        icon: '🔴',
        accentBg: '#fef2f2',
        accentText: '#b91c1c',
        accentBorder: '#fecaca',
        description:
            "Levels L3–L10. Freedom & Responsibility culture. 'Keeper test' — every role must be filled by someone exceptional.",
        levels: [
            {
                level: 'L3',
                title: 'Software Engineer',
                scope: 'Task/Feature',
                comp: '$150–210k',
                summary: 'Entry SWE; executes on well-defined work with mentorship.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Implements features with guidance. Writes clean, tested code. Participates in code reviews and design discussions.',
                    },
                    {
                        area: 'Judgment',
                        desc: "Understands the 'why' behind decisions. Makes sound low-risk technical choices with coaching.",
                    },
                    {
                        area: 'Communication',
                        desc: 'Communicates status and blockers proactively. Contributes to team planning.',
                    },
                    {
                        area: 'Culture Fit',
                        desc: 'Demonstrates Netflix values: Judgment, Communication, Impact. Learning culture of freedom and responsibility.',
                    },
                ],
                prereqs: [],
            },
            {
                level: 'L4',
                title: 'Senior Software Engineer',
                scope: 'Feature/Component',
                comp: '$200–290k',
                summary: 'Senior SWE; independently owns features and components.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Designs and delivers complete features independently. Addresses reliability and performance concerns proactively.',
                    },
                    {
                        area: 'Judgment',
                        desc: 'Makes sound technical decisions autonomously. Knows when to escalate vs. decide.',
                    },
                    {
                        area: 'Communication',
                        desc: 'Writes clear design docs. Influences team technical direction through reasoned proposals.',
                    },
                    {
                        area: 'Culture Fit',
                        desc: "Highly selfless; makes the team better. Lives the 'keeper test' — is a stunning colleague.",
                    },
                ],
                prereqs: ['L3'],
            },
            {
                level: 'L5',
                title: 'Senior Software Engineer II',
                scope: 'Project',
                comp: '$270–380k',
                summary: 'Leads projects; broad technical influence across a team.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Leads complex, multi-quarter projects. Defines technical approach for a product area.',
                    },
                    {
                        area: 'Judgment',
                        desc: 'Exercises strong judgment in ambiguous situations. Balances tech debt vs. speed with sophistication.',
                    },
                    {
                        area: 'Communication',
                        desc: 'Drives alignment across teams. Partners with PMs and designers on tradeoffs.',
                    },
                    {
                        area: 'Culture Fit',
                        desc: 'Raises the bar for the team. Actively removes obstacles. Models ownership and courage.',
                    },
                ],
                prereqs: ['L4'],
            },
            {
                level: 'L6',
                title: 'Staff Software Engineer',
                scope: 'Team of teams',
                comp: '$350–520k',
                summary: 'Staff SWE; cross-team technical leadership and strategy.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Defines multi-team technical roadmaps. Identifies and resolves systemic risks before they manifest.',
                    },
                    {
                        area: 'Judgment',
                        desc: 'Shapes product and technical strategy jointly with Directors. Long-horizon thinking (1–3 years).',
                    },
                    {
                        area: 'Communication',
                        desc: 'Advises VP-level stakeholders. Produces technical strategy documents that shape org direction.',
                    },
                    {
                        area: 'Culture Fit',
                        desc: 'Amplifies impact of everyone around them. Builds psychological safety. Challenges bad ideas with courage.',
                    },
                ],
                prereqs: ['L5'],
            },
            {
                level: 'L7',
                title: 'Principal Engineer',
                scope: 'Org',
                comp: '$480–700k',
                summary: 'Principal; org-wide technical authority.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Owns the most technically complex or strategically critical systems. Resolves engineering crises.',
                    },
                    {
                        area: 'Judgment',
                        desc: "Makes bets on technologies that shape Netflix's competitive advantage 3–5 years out.",
                    },
                    {
                        area: 'Communication',
                        desc: 'Advises C-staff on technology strategy. Shapes external engineering narrative (blog, talks).',
                    },
                    {
                        area: 'Culture Fit',
                        desc: "Defines what 'dream team' engineering looks like at Netflix. Hired because they are exceptional, not merely senior.",
                    },
                ],
                prereqs: ['L6'],
            },
            {
                level: 'L8',
                title: 'Senior Principal Engineer',
                scope: 'Netflix-wide',
                comp: '$700k–$1.1M+',
                summary: 'Sr. Principal; company-wide technical direction and platform bets.',
                skills: [
                    {
                        area: 'Technical',
                        desc: "Responsible for Netflix's most critical platform decisions. Work affects 260M+ subscribers.",
                    },
                    {
                        area: 'Judgment',
                        desc: 'Defines the engineering principles that guide how Netflix builds software at scale.',
                    },
                    {
                        area: 'Communication',
                        desc: 'Partners directly with CTO and CEO on technical strategy. Industry thought leader.',
                    },
                    {
                        area: 'Culture Fit',
                        desc: "Has materially shaped Netflix's engineering culture. Sets the standard for freedom and responsibility at the highest level.",
                    },
                ],
                prereqs: ['L7'],
            },
            {
                level: 'L9',
                title: 'Distinguished Engineer',
                scope: 'Netflix-wide / Industry',
                comp: '$1M–$1.8M+',
                summary: 'Distinguished; transformative technical leadership at Netflix and industry level.',
                skills: [
                    {
                        area: 'Technical',
                        desc: "Has personally created technologies that define Netflix's technical identity (e.g., Chaos Monkey, Hystrix).",
                    },
                    {
                        area: 'Judgment',
                        desc: "Shapes the industry's understanding of large-scale distributed systems.",
                    },
                    {
                        area: 'Communication',
                        desc: 'Represents Netflix as a global technical authority. Work cited across the industry.',
                    },
                    {
                        area: 'Culture Fit',
                        desc: 'Embodies and has helped define the Netflix Culture Memo at the engineering level.',
                    },
                ],
                prereqs: ['L8'],
            },
            {
                level: 'L10',
                title: 'Fellow',
                scope: 'Industry',
                comp: '$2M+',
                summary: 'Fellow; the highest technical honor at Netflix.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Decade-defining technical contributions. Has fundamentally changed how streaming or internet-scale systems are built.',
                    },
                    { area: 'Judgment', desc: 'Judgment trusted unconditionally by the Board and C-suite.' },
                    {
                        area: 'Communication',
                        desc: 'Work speaks for itself industry-wide. Shapes conversation at IEEE, ACM, or equivalent.',
                    },
                    { area: 'Culture Fit', desc: 'Is the Netflix culture at its highest expression.' },
                ],
                prereqs: ['L9'],
            },
        ],
    },
    google: {
        name: 'Google',
        icon: '🔷',
        accentBg: '#f0fdf4',
        accentText: '#15803d',
        accentBorder: '#bbf7d0',
        description:
            "Levels L3–L10. Strong emphasis on technical depth, 'Googleyness', and large-scale distributed systems expertise.",
        levels: [
            {
                level: 'L3',
                title: 'Software Engineer III',
                scope: 'Task',
                comp: '$150–200k',
                summary: 'New grad / entry level; executes well-defined tasks with mentorship.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Implements well-scoped features. Writes clean, tested Go/Java/Python. Participates in design docs and code reviews.',
                    },
                    {
                        area: 'Complexity',
                        desc: 'Handles straightforward technical problems. Learning Google-scale systems and internal tooling (Blaze, Critique, Spanner).',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Works within the team. Communicates blockers clearly. Contributes to team PRDs and design discussions.',
                    },
                    {
                        area: 'Googleyness',
                        desc: "Demonstrates intellectual humility, curiosity, and care for users. Learning Google's culture of rigor and data-driven decisions.",
                    },
                ],
                prereqs: [],
            },
            {
                level: 'L4',
                title: 'Software Engineer IV',
                scope: 'Feature',
                comp: '$185–260k',
                summary: 'Mid-level; independently owns features and components.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Independently designs and delivers features end-to-end. Considers reliability, scalability, and maintainability in designs.',
                    },
                    {
                        area: 'Complexity',
                        desc: 'Handles moderately complex technical problems. Contributes to cross-team design discussions. Aware of broader system context.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Mentors L3s. Writes high-quality design docs. Influences team technical direction.',
                    },
                    {
                        area: 'Googleyness',
                        desc: 'Acts with integrity. Contributes to a positive team culture. Engages constructively in difficult conversations.',
                    },
                ],
                prereqs: ['L3'],
            },
            {
                level: 'L5',
                title: 'Senior Software Engineer',
                scope: 'Project',
                comp: '$230–350k',
                summary: 'Senior; technical lead for a project or component area.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Technical lead for a project or component. Makes architectural decisions with team-wide impact. Drives technical design from inception to launch.',
                    },
                    {
                        area: 'Complexity',
                        desc: 'Solves complex, often ambiguous problems. Anticipates systemic risks. Designs for Google-scale (billions of users).',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Significant influence on team roadmap. Partners with PMs and UX. Mentors L3–L4. Leads design reviews.',
                    },
                    {
                        area: 'Googleyness',
                        desc: 'Proactively improves team culture and processes. Takes on work outside their immediate scope to help the team succeed.',
                    },
                ],
                prereqs: ['L4'],
            },
            {
                level: 'L6',
                title: 'Staff Software Engineer',
                scope: 'Team of teams',
                comp: '$320–500k',
                summary:
                    "Staff; technical leader across teams; a 'strong L6' is the typical ceiling for most engineers.",
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Drives technical strategy and architectural decisions across multiple teams or a product area. Resolves highest-complexity technical problems.',
                    },
                    {
                        area: 'Complexity',
                        desc: 'Operates on highly ambiguous, multi-year problems. Defines the technical vision for a product or platform area.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Influences roadmap and strategy at Director level. Mentors senior engineers. Drives cross-org technical alignment.',
                    },
                    {
                        area: 'Googleyness',
                        desc: 'Builds bridges across orgs. Models the highest standards of technical and collaborative conduct at Google.',
                    },
                ],
                prereqs: ['L5'],
            },
            {
                level: 'L7',
                title: 'Senior Staff Software Engineer',
                scope: 'Org',
                comp: '$450–700k',
                summary: 'Senior Staff; drives technical direction for a major Google org or product.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Owns the technical direction of a major product (e.g., Search, Maps, Ads). Introduces technologies that reshape how Google builds.',
                    },
                    {
                        area: 'Complexity',
                        desc: 'Sets 3–5 year technical vision. Navigates the most politically and technically complex decisions at Google.',
                    },
                    {
                        area: 'Collaboration',
                        desc: "Advises VPs and SVPs. Speaks externally for Google's technical strategy (papers, talks, standards bodies).",
                    },
                    {
                        area: 'Googleyness',
                        desc: 'Shapes the technical culture of an org. Champions inclusion and psychological safety at scale.',
                    },
                ],
                prereqs: ['L6'],
            },
            {
                level: 'L8',
                title: 'Principal Engineer',
                scope: 'Google-wide',
                comp: '$700k–$1.2M+',
                summary: 'Principal; company-wide technical authority across Google product areas.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Owns the most critical technical bets across Google. Responsible for decisions affecting billions of users and thousands of engineers.',
                    },
                    {
                        area: 'Complexity',
                        desc: 'Defines how Google approaches its hardest technical challenges (AI/ML at scale, privacy, infrastructure).',
                    },
                    {
                        area: 'Collaboration',
                        desc: "Partners with SVPs and Sundar Pichai's leadership team. Represents Google at the highest levels of industry and academia.",
                    },
                    {
                        area: 'Googleyness',
                        desc: 'Is the technical conscience of Google. Sets the bar for what world-class engineering means at the company.',
                    },
                ],
                prereqs: ['L7'],
            },
            {
                level: 'L9',
                title: 'Distinguished Engineer',
                scope: 'Google-wide',
                comp: '$1M–$2M+',
                summary: 'Distinguished; transformative, decade-defining technical leadership.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Has personally driven technologies that define an era of computing (e.g., MapReduce, Bigtable, TensorFlow, Kubernetes).',
                    },
                    {
                        area: 'Complexity',
                        desc: 'Defines the engineering paradigms that Google and the industry will use for a decade.',
                    },
                    {
                        area: 'Collaboration',
                        desc: "Works at Alphabet board level on technical strategy. External face of Google's engineering philosophy.",
                    },
                    {
                        area: 'Googleyness',
                        desc: "Embodies Google's mission and values at the highest level. Has shaped what Google is as a technical company.",
                    },
                ],
                prereqs: ['L8'],
            },
            {
                level: 'L10',
                title: 'Google Fellow',
                scope: 'Industry',
                comp: '$2M+ / equity-dominant',
                summary: 'Fellow; the highest individual technical honor at Google.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Fewer than 20 people hold this distinction. Has personally created foundational technologies used globally.',
                    },
                    {
                        area: 'Complexity',
                        desc: 'Shapes the long arc of computing. Work is cited in university curricula and industry standards.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Peer to Nobel laureates and Turing Award winners. Defines what it means to be a world-class computer scientist.',
                    },
                    {
                        area: 'Googleyness',
                        desc: "The living embodiment of Google's mission to organize the world's information.",
                    },
                ],
                prereqs: ['L9'],
            },
        ],
    },
    apple: {
        name: 'Apple',
        icon: '🍎',
        accentBg: '#f8fafc',
        accentText: '#374151',
        accentBorder: '#cbd5e1',
        description:
            "Levels ICT2–ICT6 (Individual Contributor Track). Apple's ladder is less publicized; deep craft, secrecy, and excellence in execution are core values.",
        levels: [
            {
                level: 'ICT2',
                title: 'Software Engineer',
                scope: 'Task',
                comp: '$140–190k',
                summary: 'Entry level; focused execution within defined scope.',
                skills: [
                    {
                        area: 'Technical Craft',
                        desc: 'Writes clean, idiomatic Swift/Objective-C/C++. Implements features to spec. Deep attention to quality and polish.',
                    },
                    {
                        area: 'Execution',
                        desc: 'Delivers assigned work on schedule. Raises quality issues proactively. Engages seriously with code review.',
                    },
                    {
                        area: 'Collaboration',
                        desc: "Works within a small, focused team. Communicates clearly about progress. Understands Apple's secrecy culture and operates accordingly.",
                    },
                    {
                        area: 'Values',
                        desc: 'Obsesses over product quality and user experience. Brings craftsmanship mindset — details matter enormously at Apple.',
                    },
                ],
                prereqs: [],
            },
            {
                level: 'ICT3',
                title: 'Senior Software Engineer',
                scope: 'Feature',
                comp: '$180–260k',
                summary: 'Senior IC; independently owns significant features.',
                skills: [
                    {
                        area: 'Technical Craft',
                        desc: 'Independently designs and ships major features (e.g., iOS framework API, hardware driver, Siri component). Deep platform expertise.',
                    },
                    {
                        area: 'Execution',
                        desc: 'Drives features from concept to shipping. Manages technical risk proactively. Owns the quality of what ships.',
                    },
                    {
                        area: 'Collaboration',
                        desc: "Works closely with hardware, design, and product counterparts — Apple's cross-functional integration is uniquely deep. Mentors ICT2s.",
                    },
                    {
                        area: 'Values',
                        desc: 'Has strong opinions about user experience. Pushes back on compromises that would degrade quality. Takes pride in work that is used by billions.',
                    },
                ],
                prereqs: ['ICT2'],
            },
            {
                level: 'ICT4',
                title: 'Staff Software Engineer',
                scope: 'Component / System',
                comp: '$250–380k',
                summary: 'Staff; owns significant system area and drives technical direction.',
                skills: [
                    {
                        area: 'Technical Craft',
                        desc: 'Owns a major system or framework (e.g., Core Data, Metal, iCloud sync). Makes architectural decisions with product-wide impact.',
                    },
                    {
                        area: 'Execution',
                        desc: 'Drives multi-cycle technical roadmap. Defines quality and performance bar for a system area. Manages dependencies across hardware and software.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Influences engineering direction across a product org. Partners with Senior PMs and Design leads. Shapes team hiring and technical standards.',
                    },
                    {
                        area: 'Values',
                        desc: 'Willing to delay a ship rather than compromise quality. Acts as the technical conscience for the product area.',
                    },
                ],
                prereqs: ['ICT3'],
            },
            {
                level: 'ICT5',
                title: 'Principal Engineer',
                scope: 'Product / Org',
                comp: '$380–600k+',
                summary: 'Principal; technical authority across a major Apple product.',
                skills: [
                    {
                        area: 'Technical Craft',
                        desc: 'Defines the technical direction of a flagship product or platform (macOS, iOS, M-chip software stack). Work shapes the roadmap for years.',
                    },
                    {
                        area: 'Execution',
                        desc: 'Owns the most complex technical bets in a product area. Resolves the highest-stakes technical crises. Accountable for multi-year reliability.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Works directly with SVPs (Phil Schiller, Craig Federighi-level). Shapes cross-org technical decisions. Represents Apple in standards bodies (WebKit, W3C, USB-C).',
                    },
                    {
                        area: 'Values',
                        desc: "Embodies Steve Jobs's maxim that the best engineers also care about the product experience. Has taste as well as skill.",
                    },
                ],
                prereqs: ['ICT4'],
            },
            {
                level: 'ICT6',
                title: 'Distinguished Engineer / Fellow',
                scope: 'Apple-wide',
                comp: '$700k–$2M+',
                summary: 'The apex of individual contribution at Apple; fewer than 50 people hold this distinction.',
                skills: [
                    {
                        area: 'Technical Craft',
                        desc: "Has personally driven technologies foundational to Apple's competitive advantage (ARM transition, M1/M2 chip software, Swift language, Metal).",
                    },
                    {
                        area: 'Execution',
                        desc: "Accountable for Apple's most strategic multi-year technical bets. Work shapes what Apple is as a technology company.",
                    },
                    {
                        area: 'Collaboration',
                        desc: "Peer to Tim Cook and Jony Ive-level leaders on technical strategy. Speaks for Apple's engineering philosophy externally.",
                    },
                    {
                        area: 'Values',
                        desc: "The living expression of Apple's commitment to craftsmanship and excellence. Has materially shaped how Apple thinks about building products.",
                    },
                ],
                prereqs: ['ICT5'],
            },
        ],
    },
    microsoft: {
        name: 'Microsoft',
        icon: '🪟',
        accentBg: '#eff6ff',
        accentText: '#1e40af',
        accentBorder: '#93c5fd',
        description:
            'Levels 59–80 (simplified to SDE I through Technical Fellow). Growth Mindset culture; emphasis on impact, learn-it-all over know-it-all.',
        levels: [
            {
                level: 'SDE I (59–60)',
                title: 'Software Engineer I',
                scope: 'Task',
                comp: '$130–175k',
                summary: 'Entry level; learning the codebase and executing defined tasks.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Implements features in C#/.NET, TypeScript, or Python. Writes unit tests. Contributes to code reviews and team discussions.',
                    },
                    {
                        area: 'Impact',
                        desc: 'Delivers assigned work. Fixes bugs and improves quality in existing systems. Learning the Azure, M365, or Xbox tech stack.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Works within the team under guidance. Communicates progress clearly. Builds relationships with peers.',
                    },
                    {
                        area: 'Growth Mindset',
                        desc: "Embodies 'learn-it-all over know-it-all.' Seeks feedback actively. Demonstrates curiosity and resilience.",
                    },
                ],
                prereqs: [],
            },
            {
                level: 'SDE II (61–62)',
                title: 'Software Engineer II',
                scope: 'Feature',
                comp: '$165–230k',
                summary: 'Mid-level; independently delivers features; growing technical breadth.',
                skills: [
                    {
                        area: 'Technical',
                        desc: "Independently designs and ships medium-complexity features. Contributes to system design. Proficient in Microsoft's distributed services and cloud patterns.",
                    },
                    {
                        area: 'Impact',
                        desc: 'Measurable impact on team outcomes. Improves code quality and test coverage. Proactively addresses technical debt.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Mentors SDE Is. Partners with PM and design. Participates in hiring interviews.',
                    },
                    {
                        area: 'Growth Mindset',
                        desc: 'Experiments with new technologies (Azure Cognitive Services, Copilot features). Brings learnings back to the team.',
                    },
                ],
                prereqs: ['SDE I (59–60)'],
            },
            {
                level: 'Senior SDE (63–64)',
                title: 'Senior Software Engineer',
                scope: 'Project',
                comp: '$210–320k',
                summary: 'Senior; technical lead for complex projects with cross-team impact.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Leads technical design for significant features or services. Makes architectural decisions. Deep expertise in one or more Microsoft platform areas.',
                    },
                    {
                        area: 'Impact',
                        desc: 'Drives cross-team technical projects. Improves systems reliability, performance, or developer experience at Microsoft scale.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Mentors SDE IIs. Partners with Group PMs. Influences team and adjacent team direction.',
                    },
                    {
                        area: 'Growth Mindset',
                        desc: 'Champions new approaches (AI-assisted engineering, responsible AI practices). Builds psychological safety and a learning culture on the team.',
                    },
                ],
                prereqs: ['SDE II (61–62)'],
            },
            {
                level: 'Principal SDE (65–67)',
                title: 'Principal Software Engineer',
                scope: 'Domain',
                comp: '$300–480k',
                summary: 'Principal; sets technical direction for a domain or product area.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Defines technical strategy for a product or platform (e.g., Azure Kubernetes Service, Office platform, Windows kernel). Resolves highest-ambiguity technical problems.',
                    },
                    {
                        area: 'Impact',
                        desc: 'Drives multi-year technical outcomes. Creates leverage across multiple teams. Accountable for significant revenue-impacting systems.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Partners with Directors and GMs. Influences product strategy from a technical perspective. Represents Microsoft externally.',
                    },
                    {
                        area: 'Growth Mindset',
                        desc: 'Models lifelong learning. Champions diversity and inclusion in technical discourse. Creates the conditions for others to grow.',
                    },
                ],
                prereqs: ['Senior SDE (63–64)'],
            },
            {
                level: 'Partner (68)',
                title: 'Partner Software Engineer',
                scope: 'Org',
                comp: '$450–700k',
                summary: 'Partner; distinguished technical or engineering management leader at org level.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Owns the technical identity of a major Microsoft product or service. Makes decisions that shape the product roadmap for years.',
                    },
                    {
                        area: 'Impact',
                        desc: 'Accountable for outcomes at the VP org level. Drives company-wide technical transformations (e.g., cloud-first, AI-first pivot).',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Works with CVPs and EVPs. Represents Microsoft in standards bodies, government, and industry fora.',
                    },
                    {
                        area: 'Growth Mindset',
                        desc: "Champions Satya's culture of empathy and growth across the organization. Drives psychological safety at scale.",
                    },
                ],
                prereqs: ['Principal SDE (65–67)'],
            },
            {
                level: 'Distinguished (69–80)',
                title: 'Distinguished Engineer',
                scope: 'Microsoft-wide',
                comp: '$800k–$1.5M+',
                summary: "Distinguished; company-wide technical authority; architecture of Microsoft's future.",
                skills: [
                    {
                        area: 'Technical',
                        desc: "Defines Microsoft's most critical technical bets (Azure architecture, AI supercomputing, Windows platform evolution). Work affects hundreds of millions of devices and users.",
                    },
                    {
                        area: 'Impact',
                        desc: 'Accountable to the Board for technical strategy. Shapes M&A and partnership strategy through a technical lens.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Works directly with Satya Nadella on technical vision. External face of Microsoft engineering (keynotes, research, standards).',
                    },
                    {
                        area: 'Growth Mindset',
                        desc: "Embodies Microsoft's transformation from 'know-it-all' to 'learn-it-all' culture at the highest level.",
                    },
                ],
                prereqs: ['Partner (68)'],
            },
            {
                level: 'Technical Fellow',
                title: 'Technical Fellow',
                scope: 'Industry',
                comp: '$2M+ / equity-dominant',
                summary: 'The apex title at Microsoft; fewer than 20 people hold it at any time.',
                skills: [
                    {
                        area: 'Technical',
                        desc: "Has personally driven technologies that define Microsoft's competitive position (e.g., Anders Hejlsberg / C#, Mark Russinovich / Sysinternals & Azure). Decade-long trajectories.",
                    },
                    {
                        area: 'Impact',
                        desc: 'Work is foundational to an entire ecosystem. Impact is measured in industry adoption and historical significance.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Peer to Turing Award winners. Represents Microsoft at the highest levels of computing history.',
                    },
                    {
                        area: 'Growth Mindset',
                        desc: 'Has materially shaped what Microsoft means as a technology company and what its culture aspires to be.',
                    },
                ],
                prereqs: ['Distinguished (69–80)'],
            },
        ],
    },
    twitter: {
        name: 'X / Twitter',
        icon: '𝕏',
        accentBg: '#f8fafc',
        accentText: '#0f172a',
        accentBorder: '#94a3b8',
        description:
            "Levels L3–L8 (pre- and post-acquisition). Post-Musk: lean teams, extreme ownership, high individual output bar. 'Hardcore' engineering culture.",
        levels: [
            {
                level: 'L3',
                title: 'Software Engineer',
                scope: 'Task',
                comp: '$130–180k',
                summary: 'Entry level; executes well-defined work with guidance.',
                skills: [
                    {
                        area: 'Technical',
                        desc: "Implements features in Scala/Java/Python on Twitter's distributed systems. Writes tests. Contributes to code and design reviews.",
                    },
                    {
                        area: 'Velocity',
                        desc: "Ships fast. Learning Twitter's high-throughput, low-latency systems (Kafka, Manhattan, Finagle). Comfortable with rapid iteration.",
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Works closely with the team. Raises blockers quickly. Contributes to incident response and on-call rotation.',
                    },
                    {
                        area: 'Ownership',
                        desc: 'Takes pride in shipping. Beginning to own components end-to-end rather than just tasks.',
                    },
                ],
                prereqs: [],
            },
            {
                level: 'L4',
                title: 'Senior Software Engineer',
                scope: 'Feature/Component',
                comp: '$175–250k',
                summary: 'Senior; independently delivers and owns features at scale.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Independently designs and ships features serving 250M+ daily active users. Deep understanding of distributed systems, consistency, and availability tradeoffs.',
                    },
                    {
                        area: 'Velocity',
                        desc: 'High individual output. Moves fast with confidence. Understands when to slow down for quality vs. when to ship and iterate.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Mentors L3s. Drives technical discussions. Participates in on-call and contributes to incident retrospectives.',
                    },
                    {
                        area: 'Ownership',
                        desc: 'Owns components in production. Takes responsibility for reliability. Proactively improves systems without being asked.',
                    },
                ],
                prereqs: ['L3'],
            },
            {
                level: 'L5',
                title: 'Staff Software Engineer',
                scope: 'Project',
                comp: '$250–380k',
                summary: 'Staff; leads cross-team technical projects with high autonomy.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Leads significant technical projects (e.g., timeline ranking, ad serving, safety systems). Designs for extreme scale and reliability.',
                    },
                    {
                        area: 'Velocity',
                        desc: 'Drives projects from 0 to 1 with minimal oversight. Creates leverage through reusable platforms. Multiplies team output.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Works across teams. Influences product roadmap. Sets technical direction for peers and is a go-to for complex problems.',
                    },
                    {
                        area: 'Ownership',
                        desc: 'Fully accountable for systems in production. Drives cultural norms around operational excellence.',
                    },
                ],
                prereqs: ['L4'],
            },
            {
                level: 'L6',
                title: 'Principal Engineer',
                scope: 'Org',
                comp: '$380–580k',
                summary: 'Principal; technical strategy and architecture at the org level.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Owns the technical direction for a major area (Home Timeline, Ads, Trust & Safety infra). Makes architectural decisions with years-long impact.',
                    },
                    {
                        area: 'Velocity',
                        desc: 'Eliminates entire classes of problems through platform investments. Identifies and resolves the highest-leverage technical bets.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Works with VPs and product leadership on strategy. Represents X engineering externally.',
                    },
                    {
                        area: 'Ownership',
                        desc: 'Accountable for technical outcomes at the business-unit level. Shapes the engineering culture post-transformation.',
                    },
                ],
                prereqs: ['L5'],
            },
            {
                level: 'L7',
                title: 'Distinguished Engineer',
                scope: 'X-wide',
                comp: '$600k–$1M+',
                summary: "Distinguished; company-wide technical authority for X's core platform.",
                skills: [
                    {
                        area: 'Technical',
                        desc: "Responsible for X's most critical infrastructure decisions (real-time messaging at scale, AI/recommendation systems, payments integration). Shapes the platform for the next 5 years.",
                    },
                    {
                        area: 'Velocity',
                        desc: 'Sets the pace and technical standard for engineering at X. Identifies transformative opportunities that others miss.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Works directly with Elon Musk on technical vision. Represents X in standards and partner discussions.',
                    },
                    {
                        area: 'Ownership',
                        desc: 'Has end-to-end ownership of the technical identity of X as a platform. Accountable for uptime and reliability at global scale.',
                    },
                ],
                prereqs: ['L6'],
            },
            {
                level: 'L8',
                title: 'Fellow',
                scope: 'Industry',
                comp: '$1M+ / equity-dominant',
                summary: 'Fellow; the rarest and most senior technical role at X.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Has made decade-defining contributions to real-time communication systems or distributed computing. Work is foundational to how the internet operates.',
                    },
                    {
                        area: 'Velocity',
                        desc: 'Output has compounded industry-wide. Technologies or approaches pioneered here are adopted by peers across the industry.',
                    },
                    {
                        area: 'Collaboration',
                        desc: "Peer to industry legends. Represents X's vision of an 'everything app' at the highest technical level.",
                    },
                    {
                        area: 'Ownership',
                        desc: "Is personally accountable for X's technical identity — what it means to build at internet scale with minimal bureaucracy.",
                    },
                ],
                prereqs: ['L7'],
            },
        ],
    },
    openai: {
        name: 'OpenAI',
        icon: '🤖',
        accentBg: '#fafaf9',
        accentText: '#292524',
        accentBorder: '#a8a29e',
        description:
            'Levels L3–L7 (research & engineering tracks). Mission-driven: safe AGI for all of humanity. Extremely high technical bar; small, elite teams.',
        levels: [
            {
                level: 'L3',
                title: 'Software Engineer',
                scope: 'Task/Feature',
                comp: '$175–240k',
                summary: 'Entry-level; executes focused tasks in a research or product engineering team.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Implements features and experiments in Python/C++/CUDA. Writes clean, efficient code. Works on ML infrastructure, API, or product.',
                    },
                    {
                        area: 'Research Awareness',
                        desc: 'Understands the basics of transformer architectures, RL, and alignment research at a conceptual level. Can translate research code into production systems.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Works closely with researchers and PMs. Rapid iteration mindset. Contributes to a results-first culture.',
                    },
                    {
                        area: 'Mission',
                        desc: "Understands and is motivated by OpenAI's mission. Engages thoughtfully with AI safety and responsible deployment questions.",
                    },
                ],
                prereqs: [],
            },
            {
                level: 'L4',
                title: 'Senior Software Engineer',
                scope: 'Feature/System',
                comp: '$230–350k',
                summary: 'Senior IC; owns systems and bridges research and product.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Independently owns significant systems: model serving infra, RLHF pipelines, API platform, safety evals. Deep knowledge of ML systems at scale.',
                    },
                    {
                        area: 'Research Awareness',
                        desc: 'Can implement and extend research papers. Collaborates effectively with research scientists on systems that operationalize new capabilities.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Mentors L3s. Drives technical direction for a system area. Partnerships with Safety and Policy teams are a norm.',
                    },
                    {
                        area: 'Mission',
                        desc: 'Demonstrates judgment about safety-capability tradeoffs. Champions responsible deployment practices within the team.',
                    },
                ],
                prereqs: ['L3'],
            },
            {
                level: 'L5',
                title: 'Staff Software Engineer',
                scope: 'Product/Platform',
                comp: '$350–550k',
                summary: 'Staff; leads critical platforms and cross-cutting technical efforts.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Leads development of critical platforms (ChatGPT infra, GPT-4/5 API, DALL-E backend, Sora processing pipeline). Designs for massive scale and rapid capability growth.',
                    },
                    {
                        area: 'Research Awareness',
                        desc: 'Deep collaborator with research leads. Shapes how new models are deployed, evaluated, and iterated on safely. Drives evals architecture.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Works across Safety, Alignment, Research, and Product. Influences technical roadmap at the product org level.',
                    },
                    {
                        area: 'Mission',
                        desc: "Is a steward of OpenAI's safety commitments. Ensures technical decisions align with responsible scaling policy.",
                    },
                ],
                prereqs: ['L4'],
            },
            {
                level: 'L6',
                title: 'Principal Engineer',
                scope: 'Org',
                comp: '$550–900k',
                summary: "Principal; org-wide technical authority and architecture of OpenAI's core systems.",
                skills: [
                    {
                        area: 'Technical',
                        desc: "Owns the technical architecture of OpenAI's most critical systems. Makes decisions that affect frontier model development and global deployment.",
                    },
                    {
                        area: 'Research Awareness',
                        desc: "Deep expertise at the intersection of research and engineering. Helps define OpenAI's technical research agenda from a systems perspective.",
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Works directly with Sam Altman, Ilya Sutskever-equivalent leadership. Represents OpenAI on technical strategy externally.',
                    },
                    {
                        area: 'Mission',
                        desc: 'Is a key voice in defining what safe and beneficial AGI development looks like in practice. Shapes technical governance.',
                    },
                ],
                prereqs: ['L5'],
            },
            {
                level: 'L7',
                title: 'Distinguished Engineer / Fellow',
                scope: 'OpenAI-wide / AGI-field',
                comp: '$1M+ / equity-dominant',
                summary: 'The apex of technical contribution at OpenAI; shaping the trajectory of AGI.',
                skills: [
                    {
                        area: 'Technical',
                        desc: "Has personally driven breakthroughs foundational to OpenAI's mission (e.g., scaling laws, RLHF, Constitutional AI analog). Work defines the field.",
                    },
                    {
                        area: 'Research Awareness',
                        desc: 'Operates at the frontier of human knowledge in AI. Contributions are landmark papers and systems adopted industry-wide.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Peer to Turing Award winners and leading AI safety researchers. Shapes AGI governance globally.',
                    },
                    {
                        area: 'Mission',
                        desc: 'Is the living embodiment of what it means to build AGI safely and beneficially. Accountable to humanity.',
                    },
                ],
                prereqs: ['L6'],
            },
        ],
    },
    uber: {
        name: 'Uber',
        icon: '⬛',
        accentBg: '#1c1917',
        accentText: '#e7e5e4',
        accentBorder: '#44403c',
        description:
            'Levels L3–L7 (Uber Engineering). Fast-paced marketplace and real-time systems. Strong on reliability, distributed systems, and data engineering.',
        levels: [
            {
                level: 'L3',
                title: 'Software Engineer I',
                scope: 'Task',
                comp: '$130–185k',
                summary: 'Entry; executes defined tasks in real-time marketplace systems.',
                skills: [
                    {
                        area: 'Technical',
                        desc: "Implements features in Go/Java/Python on Uber's microservices platform. Writes tests. Familiar with DOMA (domain-oriented microservice architecture).",
                    },
                    {
                        area: 'Reliability',
                        desc: "Learning Uber's oncall culture. Understands the real-world impact of downtime (driver earnings, rider safety).",
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Works within a team. Communicates clearly in a global, distributed engineering org.',
                    },
                    {
                        area: 'Impact',
                        desc: 'Delivers assigned work reliably. Beginning to understand how code affects millions of rides and deliveries daily.',
                    },
                ],
                prereqs: [],
            },
            {
                level: 'L4',
                title: 'Software Engineer II',
                scope: 'Feature',
                comp: '$170–250k',
                summary: 'Mid-level; independently delivers features in marketplace or real-time systems.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Designs and ships features with marketplace or real-time constraints (dispatch, pricing, maps, payments). Understands CAP theorem tradeoffs in practice.',
                    },
                    {
                        area: 'Reliability',
                        desc: 'Actively participates in oncall. Writes runbooks. Improves monitoring and alerting for owned services.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Mentors L3s. Partners with data science and ML engineers. Contributes to city-specific feature discussions.',
                    },
                    {
                        area: 'Impact',
                        desc: 'Work directly affects driver/rider experience across dozens of cities. Takes ownership of quality end-to-end.',
                    },
                ],
                prereqs: ['L3'],
            },
            {
                level: 'L5',
                title: 'Senior Software Engineer',
                scope: 'Project',
                comp: '$240–370k',
                summary: 'Senior; leads technical projects with cross-team impact.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Leads complex technical projects (e.g., surge pricing redesign, driver app optimization, Eats dispatch). Deep expertise in distributed systems.',
                    },
                    {
                        area: 'Reliability',
                        desc: 'Drives SLA/SLO definitions. Leads incident retrospectives. Introduces chaos engineering or fault injection practices.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Works across Marketplace, Maps, Safety, and Payments teams. Influences roadmap from technical perspective.',
                    },
                    {
                        area: 'Impact',
                        desc: "Has measurable impact on platform efficiency (cost per ride, driver utilization, ETA accuracy). Work affects Uber's unit economics.",
                    },
                ],
                prereqs: ['L4'],
            },
            {
                level: 'L6',
                title: 'Staff Software Engineer',
                scope: 'Domain',
                comp: '$370–580k',
                summary: 'Staff; defines technical direction for a major Uber platform domain.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Owns technical direction for a domain (Marketplace platform, Uber AI, data platform, Maps). Resolves the highest-complexity systems problems.',
                    },
                    {
                        area: 'Reliability',
                        desc: 'Defines reliability and SLO standards across a domain. Accountable for multi-region uptime and disaster recovery.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Partners with Directors and GMs. Represents Uber engineering externally. Shapes hiring standards.',
                    },
                    {
                        area: 'Impact',
                        desc: 'Technical decisions have direct P&L impact. Creates platform leverage that benefits dozens of engineering teams.',
                    },
                ],
                prereqs: ['L5'],
            },
            {
                level: 'L7',
                title: 'Principal / Distinguished Engineer',
                scope: 'Uber-wide',
                comp: '$600k–$1.2M+',
                summary: "Principal; company-wide technical authority for Uber's core platform.",
                skills: [
                    {
                        area: 'Technical',
                        desc: "Defines Uber's multi-year technical architecture. Work spans Rides, Eats, Freight, and emerging business lines. Shapes how Uber builds at hyperscale.",
                    },
                    {
                        area: 'Reliability',
                        desc: 'Sets the reliability philosophy for all of Uber engineering. Drives resilience investments that protect billions in GMV.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Advises CEO/CTO on technical strategy. Represents Uber in standards bodies and industry fora.',
                    },
                    {
                        area: 'Impact',
                        desc: "Technical strategy decisions have $10B+ impact on Uber's business. Is accountable for the technical transformation of Uber as a platform.",
                    },
                ],
                prereqs: ['L6'],
            },
        ],
    },
    airbnb: {
        name: 'Airbnb',
        icon: '🏠',
        accentBg: '#fff1f2',
        accentText: '#be123c',
        accentBorder: '#fda4af',
        description:
            "Levels L3–L7. 'Belong Anywhere' culture applied to engineering: emphasis on empathy, craftsmanship, trust & safety, and product-minded engineering.",
        levels: [
            {
                level: 'L3',
                title: 'Software Engineer',
                scope: 'Task',
                comp: '$130–185k',
                summary: "Entry; learning Airbnb's stack and delivering well-defined features.",
                skills: [
                    {
                        area: 'Technical',
                        desc: "Implements features in React/TypeScript, Ruby, Java, or Python on Airbnb's service platform. Writes tests. Participates in code reviews.",
                    },
                    {
                        area: 'Product Mindset',
                        desc: 'Understands the host and guest experience context for work. Considers UX implications of technical decisions.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Works within a small cross-functional team (eng, design, data science, PM). Communicates clearly and with empathy.',
                    },
                    {
                        area: 'Trust',
                        desc: "Understands Airbnb's unique trust and safety challenges. Writes code that protects hosts and guests.",
                    },
                ],
                prereqs: [],
            },
            {
                level: 'L4',
                title: 'Senior Software Engineer',
                scope: 'Feature',
                comp: '$175–255k',
                summary: 'Senior; independently delivers and owns product features.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Independently designs and ships impactful product features (search ranking, payments, reviews, identity verification). Considers scalability and reliability.',
                    },
                    {
                        area: 'Product Mindset',
                        desc: 'Proactively identifies product opportunities through data. Shapes feature scope and UX through technical perspective.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Mentors L3s. Strong partner to design and data science. Drives technical alignment within team.',
                    },
                    {
                        area: 'Trust',
                        desc: 'Champions privacy and safety in design reviews. Understands the regulatory and trust complexity of a two-sided marketplace.',
                    },
                ],
                prereqs: ['L3'],
            },
            {
                level: 'L5',
                title: 'Staff Software Engineer',
                scope: 'Project',
                comp: '$250–400k',
                summary: 'Staff; leads cross-team projects with meaningful product and business impact.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Leads significant projects (e.g., pricing algorithms, host onboarding platform, search infrastructure). Designs for global scale and localization.',
                    },
                    {
                        area: 'Product Mindset',
                        desc: 'Co-creates roadmap with PM and design. Connects technical investments to business outcomes (conversion, NPS, revenue).',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Drives cross-team alignment. Works with Safety, Payments, and Community teams. Mentors seniors.',
                    },
                    {
                        area: 'Trust',
                        desc: 'Is a steward of community trust. Technical decisions are made with explicit consideration of vulnerable users (guests in unfamiliar places).',
                    },
                ],
                prereqs: ['L4'],
            },
            {
                level: 'L6',
                title: 'Principal Engineer',
                scope: 'Org',
                comp: '$400–650k',
                summary: 'Principal; technical authority and strategy at the org level.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Owns technical direction for a major Airbnb platform area (Core Product, Payments, Trust, Data/ML). Multi-year architectural vision.',
                    },
                    {
                        area: 'Product Mindset',
                        desc: "Is a technical product leader. Shapes Airbnb's strategy from a technology perspective. Evangelizes product-engineering craft.",
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Partners with VPs and Design VPs. Represents Airbnb engineering externally. Mentors Staff engineers.',
                    },
                    {
                        area: 'Trust',
                        desc: "Ensures Airbnb's technical decisions maintain the global community's trust. Is accountable for the platform's integrity.",
                    },
                ],
                prereqs: ['L5'],
            },
            {
                level: 'L7',
                title: 'Distinguished Engineer',
                scope: 'Airbnb-wide',
                comp: '$700k–$1.5M+',
                summary: 'Distinguished; the apex of individual technical contribution at Airbnb.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Responsible for the most strategic technical bets at Airbnb. Work defines the platform for the next decade (AI-powered search, new category expansion, global payments infrastructure).',
                    },
                    {
                        area: 'Product Mindset',
                        desc: 'Has shaped how Airbnb thinks about the relationship between technology and community. A defining voice on what Airbnb builds.',
                    },
                    {
                        area: 'Collaboration',
                        desc: "Works with Brian Chesky-level leadership. External face of Airbnb's engineering identity.",
                    },
                    {
                        area: 'Trust',
                        desc: 'Has built the technical foundations that allow 100M+ guests and 4M+ hosts to trust each other globally.',
                    },
                ],
                prereqs: ['L6'],
            },
        ],
    },
    stripe: {
        name: 'Stripe',
        icon: '🟣',
        accentBg: '#faf5ff',
        accentText: '#6d28d9',
        accentBorder: '#c4b5fd',
        description:
            "Levels L1–L5 (Stripe IC Track). 'Increase the GDP of the internet.' Extremely high bar for writing, clarity, and technical rigor. Docs-first culture.",
        levels: [
            {
                level: 'L1',
                title: 'Software Engineer I',
                scope: 'Task',
                comp: '$130–185k',
                summary: 'Entry; contributes to well-defined tasks with a focus on learning and quality.',
                skills: [
                    {
                        area: 'Technical',
                        desc: "Implements features in Ruby, Go, or TypeScript on Stripe's payment infrastructure. Writes clean, well-documented code. Deep attention to edge cases.",
                    },
                    {
                        area: 'Writing',
                        desc: "Writes clear technical docs, design docs, and commit messages. Stripe's writing culture is central — prose matters as much as code.",
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Works within a team of very smart, curious people. Asks great questions. Is a strong listener and learner.',
                    },
                    {
                        area: 'Mission',
                        desc: "Understands how Stripe's infrastructure moves money globally. Feels the weight of financial reliability: every bug has a merchant on the other end.",
                    },
                ],
                prereqs: [],
            },
            {
                level: 'L2',
                title: 'Software Engineer II',
                scope: 'Feature',
                comp: '$175–255k',
                summary: 'Mid-level; independently owns features with a strong writing and quality bar.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Independently designs and ships significant payment or developer platform features. Deep knowledge of payment networks (Visa, SWIFT, ACH) and their quirks.',
                    },
                    {
                        area: 'Writing',
                        desc: 'Writes exceptional design docs. Is cited as a model by others for clarity. Can explain complex distributed systems tradeoffs in plain language.',
                    },
                    {
                        area: 'Collaboration',
                        desc: "Mentors L1s. Partners with API design, risk, and operations. Contributes to Stripe's API design philosophy.",
                    },
                    {
                        area: 'Mission',
                        desc: 'Is passionate about making financial infrastructure accessible to any developer globally. Cares about the long-tail developer, not just FAANG.',
                    },
                ],
                prereqs: ['L1'],
            },
            {
                level: 'L3',
                title: 'Senior Software Engineer',
                scope: 'Project',
                comp: '$250–400k',
                summary: 'Senior; leads projects and shapes technical approach across a product area.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Leads complex projects (fraud detection, Stripe Billing, Connect platform, Treasury). Designs for extreme reliability (99.999% uptime, financial-grade consistency).',
                    },
                    {
                        area: 'Writing',
                        desc: 'Produces project-defining technical specs. Writing shapes what gets built across Stripe. Has a distinctive, trusted voice.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Leads cross-functional discussions. Partners with Risk, Legal, Finance, and Ops on technical decisions. Raises the writing bar across the team.',
                    },
                    {
                        area: 'Mission',
                        desc: 'Drives technical projects that literally grow the GDP of the internet. Work enables new categories of business to exist.',
                    },
                ],
                prereqs: ['L2'],
            },
            {
                level: 'L4',
                title: 'Staff Software Engineer',
                scope: 'Domain',
                comp: '$400–700k',
                summary: 'Staff; defines technical direction for a major Stripe platform domain.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Owns technical direction for a domain (Payments infrastructure, Stripe Connect, Developer Platform, Money movement). Multi-year architectural responsibility.',
                    },
                    {
                        area: 'Writing',
                        desc: 'Defines the technical narrative for a product domain. Writing is read across all of Stripe and externally on the Stripe blog.',
                    },
                    {
                        area: 'Collaboration',
                        desc: "Partners with VPs and GMs. Shapes Stripe's engineering culture. Represents Stripe in financial standards bodies.",
                    },
                    {
                        area: 'Mission',
                        desc: 'Has measurably grown the GDP of the internet through platform decisions. Is accountable for technical infrastructure that processes $1T+ annually.',
                    },
                ],
                prereqs: ['L3'],
            },
            {
                level: 'L5',
                title: 'Principal Engineer',
                scope: 'Stripe-wide',
                comp: '$800k–$2M+',
                summary: 'Principal; the apex of IC contribution at Stripe; shaping global financial infrastructure.',
                skills: [
                    {
                        area: 'Technical',
                        desc: "Responsible for Stripe's most strategic technical bets. Work defines what financial infrastructure looks like for the next decade (AI-powered risk, stablecoin rails, global banking relationships).",
                    },
                    {
                        area: 'Writing',
                        desc: 'Has materially shaped how Stripe communicates its technical philosophy. Writing has influenced industry thinking.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Works with Patrick and John Collison directly on technical vision. External face of Stripe engineering.',
                    },
                    {
                        area: 'Mission',
                        desc: "Is personally accountable for Stripe's mission. Has made it meaningfully easier for millions of businesses to start, grow, and thrive.",
                    },
                ],
                prereqs: ['L4'],
            },
        ],
    },
    tesla: {
        name: 'Tesla',
        icon: '⚡',
        accentBg: '#fefce8',
        accentText: '#854d0e',
        accentBorder: '#fde68a',
        description:
            "Levels ICT2–ICT6 (Individual Contributor Track). Mission: accelerate the world's transition to sustainable energy. Move fast, full-stack ownership, no room for 'not my problem.'",
        levels: [
            {
                level: 'ICT2',
                title: 'Software Engineer',
                scope: 'Task',
                comp: '$130–185k',
                summary: 'Entry; executes well-defined tasks in vehicle software, energy, or Autopilot.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Implements features in C++/Python for vehicle firmware, energy management, or full-stack web (React/Node). Writes tests. Attention to real-time constraints.',
                    },
                    {
                        area: 'Ownership',
                        desc: "Owns tasks end-to-end with minimal handoff culture. Learning Tesla's philosophy: no bureaucracy, just ship.",
                    },
                    {
                        area: 'Collaboration',
                        desc: "Works directly with hardware, firmware, and manufacturing engineers. Tesla's hardware-software co-design is unusually deep.",
                    },
                    {
                        area: 'Mission',
                        desc: 'Understands the urgency of the energy transition. Code shipped here runs in millions of cars and grid-scale energy systems.',
                    },
                ],
                prereqs: [],
            },
            {
                level: 'ICT3',
                title: 'Senior Software Engineer',
                scope: 'Feature/System',
                comp: '$175–265k',
                summary: 'Senior; independently owns systems in Autopilot, FSD, energy, or vehicle software.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Owns significant systems: Autopilot perception pipeline, FSD planner, Powerwall firmware, Supercharger network software, manufacturing execution systems.',
                    },
                    {
                        area: 'Ownership',
                        desc: 'Takes full ownership from design to deployment to monitoring. Comfortable making decisions with incomplete information. Moves fast.',
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Works closely with AI researchers, hardware engineers, and manufacturing. Cross-functional depth is essential at Tesla.',
                    },
                    {
                        area: 'Mission',
                        desc: 'Personal contribution is traceable to accelerated energy transition outcomes (GWh deployed, miles driven autonomously, CO2 avoided).',
                    },
                ],
                prereqs: ['ICT2'],
            },
            {
                level: 'ICT4',
                title: 'Staff Software Engineer',
                scope: 'Product/Platform',
                comp: '$260–420k',
                summary: 'Staff; leads technical direction for a product or major system.',
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Defines technical approach for a product (FSD v12+ neural planner, Dojo training infrastructure, Vehicle OS architecture, Energy cloud platform). Deep systems expertise.',
                    },
                    {
                        area: 'Ownership',
                        desc: 'Accountable for technical outcomes of a product area. No silos — owns the full vertical from bit to vehicle behavior or grid response.',
                    },
                    {
                        area: 'Collaboration',
                        desc: "Partners with Elon's direct reports on technical execution. Works across Vehicle, Energy, AI, and Manufacturing orgs.",
                    },
                    {
                        area: 'Mission',
                        desc: "Has direct accountability for Tesla's technology leadership in EVs, autonomy, or energy. Work accelerates the transition at scale.",
                    },
                ],
                prereqs: ['ICT3'],
            },
            {
                level: 'ICT5',
                title: 'Principal Engineer',
                scope: 'Org',
                comp: '$420–700k',
                summary: "Principal; shapes Tesla's technical strategy at the org level.",
                skills: [
                    {
                        area: 'Technical',
                        desc: 'Owns the technical direction of a major Tesla platform (Autopilot/FSD stack, Dojo supercomputer, vehicle electrical architecture, grid software). Multi-year vision.',
                    },
                    {
                        area: 'Ownership',
                        desc: "Is personally accountable for Tesla's technical competitiveness. Makes decisions that determine whether Tesla leads or follows in autonomous driving or energy.",
                    },
                    {
                        area: 'Collaboration',
                        desc: 'Works directly with Elon Musk on technical priorities. Interfaces with regulatory bodies on Autopilot certification.',
                    },
                    {
                        area: 'Mission',
                        desc: "Has demonstrably moved the needle on Tesla's mission. Work is measurable in gigawatts and autonomous miles.",
                    },
                ],
                prereqs: ['ICT4'],
            },
            {
                level: 'ICT6',
                title: 'Distinguished Engineer / Fellow',
                scope: 'Tesla-wide / Industry',
                comp: '$1M+ / equity-dominant',
                summary: 'The apex of IC contribution at Tesla; defining the future of autonomy and energy.',
                skills: [
                    {
                        area: 'Technical',
                        desc: "Has personally driven Tesla's most important technical breakthroughs (e.g., FSD without LiDAR, 4680 cell BMS, Dojo architecture, Optimus motion planning). Decade-defining work.",
                    },
                    {
                        area: 'Ownership',
                        desc: "Accountable to the Board and Elon for Tesla's technical identity. Work determines whether Tesla achieves its mission.",
                    },
                    {
                        area: 'Collaboration',
                        desc: "Peer to leaders in robotics, AI, and energy research globally. Represents Tesla's technical vision publicly.",
                    },
                    {
                        area: 'Mission',
                        desc: "Is the living expression of Tesla's mission. Has materially accelerated the world's transition to sustainable energy through technical leadership.",
                    },
                ],
                prereqs: ['ICT5'],
            },
        ],
    },
} satisfies Record<string, CompanyData>;

type CompanyKey = keyof typeof companies;
type TabId = 'generic' | CompanyKey;

// ── PREREQ MAP ────────────────────────────────────────────────────────────────
type PositionedSkill = GenericSkill & {
    domain: string;
    icon: string;
    color: DomainColor;
    x: number;
    y: number;
    cx: number;
    cy: number;
};

function PrereqMap({ matrix }: { matrix: GenericDomain[] }) {
    const [hover, setHover] = useState<string | null>(null);
    const allSkillList: Array<GenericSkill & { domain: string; icon: string; color: DomainColor }> = [];
    matrix.forEach((d) =>
        d.categories.forEach((c) =>
            c.skills.forEach((s) =>
                allSkillList.push({ ...s, domain: d.domain, icon: d.icon, color: getDomainColor(d.domain) })
            )
        )
    );
    const GRID_COLS = 4,
        NW = 200,
        NH = 56,
        GAPX = 20,
        GAPY = 14;
    const positioned: PositionedSkill[] = allSkillList.map((s, i) => {
        const col = i % GRID_COLS,
            row = Math.floor(i / GRID_COLS);
        return {
            ...s,
            x: col * (NW + GAPX),
            y: row * (NH + GAPY),
            cx: col * (NW + GAPX) + NW / 2,
            cy: row * (NH + GAPY) + NH / 2 + NH / 2,
        };
    });
    const posMap: Record<string, PositionedSkill> = {};
    positioned.forEach((p) => {
        posMap[p.name] = p;
    });
    const edges: Array<{ from: PositionedSkill; to: PositionedSkill }> = [];
    positioned.forEach((p) =>
        (p.prereqs || []).forEach((pr) => {
            const pname = pr.split(' L')[0];
            if (posMap[pname]) edges.push({ from: posMap[pname], to: p });
        })
    );
    const totalW = GRID_COLS * (NW + GAPX),
        totalH = Math.ceil(allSkillList.length / GRID_COLS) * (NH + GAPY) + 20;
    return (
        <div style={{ overflowX: 'auto' }}>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>
                Hover a node to highlight its dependency links.
            </p>
            <svg width={totalW + 20} height={totalH}>
                <defs>
                    <marker id="arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                        <polygon points="0 0,7 3.5,0 7" fill="#6366f1" opacity="0.7" />
                    </marker>
                    <marker id="arrHL" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                        <polygon points="0 0,7 3.5,0 7" fill="#f59e0b" />
                    </marker>
                </defs>
                <g transform="translate(10,10)">
                    {edges.map((e, i) => {
                        const isHL = hover && (hover === e.from.name || hover === e.to.name);
                        return (
                            <g key={i} opacity={hover && !isHL ? 0.1 : 1}>
                                <path
                                    d={`M${e.from.cx},${e.from.cy} C${e.from.cx},${(e.from.cy + e.to.cy) / 2} ${e.to.cx},${(e.from.cy + e.to.cy) / 2} ${e.to.cx},${e.to.cy - NH / 2}`}
                                    fill="none"
                                    stroke={isHL ? '#f59e0b' : '#6366f1'}
                                    strokeWidth={isHL ? 2 : 1.2}
                                    strokeDasharray={isHL ? 'none' : '4 3'}
                                    markerEnd={isHL ? 'url(#arrHL)' : 'url(#arr)'}
                                    opacity={0.75}
                                />
                            </g>
                        );
                    })}
                    {positioned.map((p, i) => {
                        const isHL = hover === p.name;
                        const isConn =
                            hover &&
                            edges.some(
                                (e) =>
                                    (e.from.name === hover && e.to.name === p.name) ||
                                    (e.to.name === hover && e.from.name === p.name)
                            );
                        const dim = hover && !isHL && !isConn;
                        return (
                            <g
                                key={i}
                                transform={`translate(${p.x},${p.y})`}
                                onMouseEnter={() => setHover(p.name)}
                                onMouseLeave={() => setHover(null)}
                                style={{ cursor: 'default' }}
                                opacity={dim ? 0.2 : 1}
                            >
                                <rect
                                    width={NW}
                                    height={NH}
                                    rx={8}
                                    fill={isHL ? p.color.light : '#f8fafc'}
                                    stroke={isHL ? p.color.badge : '#e2e8f0'}
                                    strokeWidth={isHL ? 2 : 1}
                                />
                                <text x={10} y={18} fontSize={13}>
                                    {p.icon}
                                </text>
                                <text
                                    x={28}
                                    y={19}
                                    fontSize={11}
                                    fontWeight={700}
                                    fill={isHL ? p.color.text : '#1e293b'}
                                >
                                    {p.name}
                                </text>
                                <text x={10} y={34} fontSize={9.5} fill="#94a3b8">
                                    {p.domain}
                                </text>
                                {p.prereqs && p.prereqs.length > 0 && (
                                    <text x={10} y={48} fontSize={9} fill="#a5b4fc">
                                        needs: {p.prereqs.join(', ')}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
}

// ── GENERIC MATRIX ────────────────────────────────────────────────────────────
function GenericMatrix({ matrix }: { matrix: GenericDomain[] }) {
    const [openDomains, setOpenDomains] = useState<Record<number, boolean>>(
        matrix.reduce(
            (acc, _, i) => {
                acc[i] = i < 3;
                return acc;
            },
            {} as Record<number, boolean>
        )
    );
    const [openCats, setOpenCats] = useState<Record<string, boolean>>({});
    const [activeLevel, setActiveLevel] = useState<number | null>(null);
    const [highlightSkill, setHighlightSkill] = useState<string | null>(null);
    const [view, setView] = useState<'matrix' | 'prereqs'>('matrix');
    return (
        <div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {(['matrix', 'prereqs'] as const).map((v) => (
                    <button
                        key={v}
                        onClick={() => setView(v)}
                        style={{
                            padding: '5px 12px',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: '1.5px solid',
                            background: view === v ? '#1e293b' : '#f8fafc',
                            color: view === v ? '#fff' : '#64748b',
                            borderColor: view === v ? '#1e293b' : '#e2e8f0',
                        }}
                    >
                        {v === 'matrix' ? '📊 Matrix' : '🔗 Prereq Map'}
                    </button>
                ))}
            </div>
            {view === 'prereqs' ? (
                <PrereqMap matrix={matrix} />
            ) : (
                <>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>FILTER:</span>
                        {LEVELS.map((l, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveLevel(activeLevel === i ? null : i)}
                                style={{
                                    padding: '4px 12px',
                                    borderRadius: 20,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    border: '1.5px solid',
                                    background:
                                        activeLevel === i
                                            ? LEVEL_BG[i]
                                            : activeLevel === null
                                              ? LEVEL_BG[i] + '88'
                                              : '#f1f5f9',
                                    color:
                                        activeLevel === i
                                            ? LEVEL_TEXT[i]
                                            : activeLevel === null
                                              ? LEVEL_TEXT[i]
                                              : '#94a3b8',
                                    borderColor:
                                        activeLevel === i
                                            ? LEVEL_BORDER[i]
                                            : activeLevel === null
                                              ? LEVEL_BORDER[i]
                                              : '#e2e8f0',
                                }}
                            >
                                {l} · {LEVEL_NAMES[i]}
                            </button>
                        ))}
                        {activeLevel !== null && (
                            <button
                                onClick={() => setActiveLevel(null)}
                                style={{
                                    padding: '4px 10px',
                                    borderRadius: 20,
                                    fontSize: 11,
                                    background: 'none',
                                    border: '1.5px solid #e2e8f0',
                                    color: '#94a3b8',
                                    cursor: 'pointer',
                                }}
                            >
                                ✕ Clear
                            </button>
                        )}
                    </div>
                    {matrix.map((dom, di) => {
                        const dc = getDomainColor(dom.domain);
                        const isOpen = openDomains[di] !== false;
                        return (
                            <div
                                key={di}
                                style={{
                                    marginBottom: 10,
                                    borderRadius: 12,
                                    border: '1.5px solid #e2e8f0',
                                    overflow: 'hidden',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                }}
                            >
                                <button
                                    onClick={() => setOpenDomains((p) => ({ ...p, [di]: !p[di] }))}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '10px 16px',
                                        background: dc.bg,
                                        color: '#fff',
                                        fontSize: 13,
                                        fontWeight: 700,
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <span>
                                        {dom.icon} {dom.domain}
                                        {dom.note && (
                                            <span
                                                style={{ fontSize: 10, fontWeight: 400, marginLeft: 8, opacity: 0.7 }}
                                            >
                                                {dom.note}
                                            </span>
                                        )}
                                    </span>
                                    <span style={{ fontSize: 10, opacity: 0.6 }}>{isOpen ? '▲' : '▼'}</span>
                                </button>
                                {isOpen &&
                                    dom.categories.map((cat, ci) => {
                                        const ck = `${di}-${ci}`;
                                        const catOpen = openCats[ck] !== false;
                                        return (
                                            <div key={ci} style={{ borderTop: '1px solid #e2e8f0' }}>
                                                <button
                                                    onClick={() =>
                                                        setOpenCats((p) => ({
                                                            ...p,
                                                            [ck]: p[ck] === false ? true : false,
                                                        }))
                                                    }
                                                    style={{
                                                        width: '100%',
                                                        textAlign: 'left',
                                                        padding: '7px 14px',
                                                        background: '#f8fafc',
                                                        fontSize: 11,
                                                        fontWeight: 700,
                                                        color: '#475569',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <span>
                                                        📁 {cat.name}
                                                        {cat.bridging && (
                                                            <span
                                                                style={{
                                                                    marginLeft: 6,
                                                                    fontSize: 9,
                                                                    fontWeight: 600,
                                                                    padding: '1px 6px',
                                                                    borderRadius: 10,
                                                                    background: dc.light,
                                                                    color: dc.text,
                                                                    border: `1px solid ${dc.badge}40`,
                                                                }}
                                                            >
                                                                🔗 {cat.bridging}
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span style={{ fontSize: 9, color: '#94a3b8' }}>
                                                        {catOpen ? '▲' : '▼'}
                                                    </span>
                                                </button>
                                                {catOpen &&
                                                    cat.skills.map((skill, si) => (
                                                        <div key={si} style={{ borderTop: '1px solid #f1f5f9' }}>
                                                            <div
                                                                style={{
                                                                    padding: '6px 14px 4px 24px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 6,
                                                                    flexWrap: 'wrap',
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        fontSize: 10,
                                                                        fontWeight: 700,
                                                                        color: '#475569',
                                                                        textTransform: 'uppercase',
                                                                        letterSpacing: '0.04em',
                                                                    }}
                                                                >
                                                                    🔹 {skill.name}
                                                                </span>
                                                                {skill.prereqs.length > 0 && (
                                                                    <span style={{ fontSize: 9, color: '#94a3b8' }}>
                                                                        requires:{' '}
                                                                        {skill.prereqs.map((p, pi) => (
                                                                            <span
                                                                                key={pi}
                                                                                onMouseEnter={() =>
                                                                                    setHighlightSkill(p.split(' L')[0])
                                                                                }
                                                                                onMouseLeave={() =>
                                                                                    setHighlightSkill(null)
                                                                                }
                                                                                style={{
                                                                                    display: 'inline-block',
                                                                                    marginRight: 3,
                                                                                    padding: '1px 6px',
                                                                                    borderRadius: 10,
                                                                                    background: '#f1f5f9',
                                                                                    color: '#6366f1',
                                                                                    fontWeight: 600,
                                                                                    border: '1px solid #e0e7ff',
                                                                                    cursor: 'default',
                                                                                    fontSize: 9,
                                                                                }}
                                                                            >
                                                                                {p}
                                                                            </span>
                                                                        ))}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div
                                                                style={{
                                                                    display: 'grid',
                                                                    gridTemplateColumns: 'repeat(5,1fr)',
                                                                }}
                                                            >
                                                                {skill.levels.map((desc, li) => {
                                                                    const dimmed =
                                                                        activeLevel !== null && activeLevel !== li;
                                                                    const isHL =
                                                                        highlightSkill && skill.name === highlightSkill;
                                                                    return (
                                                                        <div
                                                                            key={li}
                                                                            style={{
                                                                                padding: '8px 10px',
                                                                                borderRight:
                                                                                    li < 4
                                                                                        ? '1px solid #f1f5f9'
                                                                                        : 'none',
                                                                                borderTop: '1px solid #f1f5f9',
                                                                                background: isHL
                                                                                    ? '#fef9c3'
                                                                                    : dimmed
                                                                                      ? '#fafafa'
                                                                                      : LEVEL_BG[li],
                                                                                opacity: dimmed && !isHL ? 0.3 : 1,
                                                                                transition: 'all 0.15s',
                                                                            }}
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    fontSize: 9,
                                                                                    fontWeight: 700,
                                                                                    marginBottom: 2,
                                                                                    color: LEVEL_TEXT[li],
                                                                                }}
                                                                            >
                                                                                {LEVELS[li]}
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    fontSize: 10,
                                                                                    color: '#374151',
                                                                                    lineHeight: 1.4,
                                                                                }}
                                                                            >
                                                                                {desc}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        );
                                    })}
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
}

// ── COMPANY MATRIX ────────────────────────────────────────────────────────────
function CompanyMatrix({ co }: { co: CompanyData }) {
    const { levels, accentBg, accentText, accentBorder, description } = co;
    const [active, setActive] = useState<number | null>(null);
    const [hoverPrereq, setHoverPrereq] = useState<string | null>(null);
    const visible = active !== null ? [levels[active]] : levels;
    return (
        <div>
            <p
                style={{
                    fontSize: 12,
                    color: '#64748b',
                    marginBottom: 14,
                    padding: '8px 12px',
                    background: '#f8fafc',
                    borderRadius: 8,
                    borderLeft: `3px solid ${accentBorder}`,
                }}
            >
                {description}
            </p>
            <div style={{ display: 'flex', gap: 5, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>FILTER:</span>
                {levels.map((l, i) => (
                    <button
                        key={i}
                        onClick={() => setActive(active === i ? null : i)}
                        style={{
                            padding: '3px 10px',
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: `1.5px solid`,
                            background: active === i ? accentBg : '#f8fafc',
                            color: active === i ? accentText : '#64748b',
                            borderColor: active === i ? accentBorder : '#e2e8f0',
                        }}
                    >
                        {l.level}
                    </button>
                ))}
                {active !== null && (
                    <button
                        onClick={() => setActive(null)}
                        style={{
                            padding: '3px 8px',
                            borderRadius: 20,
                            fontSize: 10,
                            background: 'none',
                            border: '1.5px solid #e2e8f0',
                            color: '#94a3b8',
                            cursor: 'pointer',
                        }}
                    >
                        ✕
                    </button>
                )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {visible.map((l) => (
                    <div
                        key={l.level}
                        style={{
                            borderRadius: 10,
                            border: `1.5px solid ${accentBorder}`,
                            overflow: 'hidden',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                        }}
                    >
                        <div
                            style={{
                                background: accentBg,
                                padding: '10px 16px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 6,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 16, fontWeight: 800, color: accentText }}>{l.level}</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: accentText }}>{l.title}</span>
                                <span
                                    style={{
                                        fontSize: 11,
                                        color: '#64748b',
                                        padding: '2px 7px',
                                        background: '#f1f5f9',
                                        borderRadius: 8,
                                    }}
                                >
                                    📐 {l.scope}
                                </span>
                                <span
                                    style={{
                                        fontSize: 11,
                                        color: '#059669',
                                        padding: '2px 7px',
                                        background: '#ecfdf5',
                                        borderRadius: 8,
                                        border: '1px solid #bbf7d0',
                                    }}
                                >
                                    💰 {l.comp}
                                </span>
                            </div>
                            {l.prereqs.length > 0 && (
                                <div style={{ fontSize: 10, color: '#94a3b8' }}>
                                    requires:{' '}
                                    {l.prereqs.map((p, pi) => (
                                        <span
                                            key={pi}
                                            onMouseEnter={() => setHoverPrereq(p)}
                                            onMouseLeave={() => setHoverPrereq(null)}
                                            style={{
                                                padding: '1px 7px',
                                                borderRadius: 10,
                                                background: '#eef2ff',
                                                color: '#6366f1',
                                                fontWeight: 600,
                                                border: '1px solid #e0e7ff',
                                                cursor: 'default',
                                                fontSize: 10,
                                                marginRight: 3,
                                            }}
                                        >
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div
                            style={{
                                padding: '8px 16px',
                                background: '#fafafa',
                                fontSize: 12,
                                color: '#475569',
                                borderBottom: '1px solid #f1f5f9',
                            }}
                        >
                            <em>{l.summary}</em>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))' }}>
                            {l.skills.map((s, si) => (
                                <div
                                    key={si}
                                    style={{
                                        padding: '10px 14px',
                                        borderRight: '1px solid #f1f5f9',
                                        borderBottom: '1px solid #f1f5f9',
                                        background: '#fff',
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            color: accentText,
                                            marginBottom: 4,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                        }}
                                    >
                                        {s.area}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#374151', lineHeight: 1.5 }}>{s.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {/* Progression map */}
            <div style={{ marginTop: 22 }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 10 }}>
                    🔗 Level Progression
                </h3>
                <div style={{ overflowX: 'auto' }}>
                    <svg width={Math.max(levels.length * 115 + 20, 300)} height={70}>
                        <defs>
                            <marker
                                id={`arr-${co.name}`}
                                markerWidth="6"
                                markerHeight="6"
                                refX="5"
                                refY="3"
                                orient="auto"
                            >
                                <polygon points="0 0,6 3,0 6" fill={accentBorder} />
                            </marker>
                        </defs>
                        {levels.map((l, i) => {
                            const x = 10 + i * 115,
                                y = 10;
                            const isHL = hoverPrereq === l.level;
                            return (
                                <g key={i}>
                                    {i < levels.length - 1 && (
                                        <line
                                            x1={x + 72}
                                            y1={y + 20}
                                            x2={x + 113}
                                            y2={y + 20}
                                            stroke={accentBorder}
                                            strokeWidth={2}
                                            markerEnd={`url(#arr-${co.name})`}
                                        />
                                    )}
                                    <rect
                                        x={x}
                                        y={y}
                                        width={72}
                                        height={40}
                                        rx={7}
                                        fill={isHL ? accentBg : '#f8fafc'}
                                        stroke={accentBorder}
                                        strokeWidth={isHL ? 2 : 1}
                                    />
                                    <text
                                        x={x + 36}
                                        y={y + 15}
                                        textAnchor="middle"
                                        fontSize={10}
                                        fontWeight={700}
                                        fill={accentText}
                                    >
                                        {l.level}
                                    </text>
                                    <text x={x + 36} y={y + 29} textAnchor="middle" fontSize={8} fill="#64748b">
                                        {l.title.split(' ').slice(-1)[0]}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>
        </div>
    );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
const TABS: Array<{ id: TabId; label: string }> = [
    { id: 'generic', label: '🗂 IT Matrix' },
    { id: 'aws', label: '🟠 AWS' },
    { id: 'meta', label: '🔵 Meta' },
    { id: 'netflix', label: '🔴 Netflix' },
    { id: 'google', label: '🔷 Google' },
    { id: 'apple', label: '🍎 Apple' },
    { id: 'microsoft', label: '🪟 Microsoft' },
    { id: 'twitter', label: '𝕏 Twitter' },
    { id: 'openai', label: '🤖 OpenAI' },
    { id: 'uber', label: '⬛ Uber' },
    { id: 'airbnb', label: '🏠 Airbnb' },
    { id: 'stripe', label: '🟣 Stripe' },
    { id: 'tesla', label: '⚡ Tesla' },
];

export default function App() {
    const [tab, setTab] = useState<TabId>('generic');

    return (
        <div style={{ fontFamily: 'system-ui,sans-serif', maxWidth: 1040, margin: '0 auto', padding: '18px 12px' }}>
            <div style={{ marginBottom: 16 }}>
                <h1 style={{ fontSize: 19, fontWeight: 800, margin: '0 0 2px' }}>Engineering Leveling Matrix</h1>
                <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>
                    Generic IT Matrix · FAANG · AWS · OpenAI · Uber · Airbnb · Stripe · Tesla
                </p>
            </div>

            {/* Tab bar — two rows */}
            <div style={{ marginBottom: 18, borderBottom: '2px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            style={{
                                padding: '7px 13px',
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: 'pointer',
                                border: 'none',
                                borderBottom: tab === t.id ? '3px solid #6366f1' : '3px solid transparent',
                                background: 'none',
                                color: tab === t.id ? '#6366f1' : '#64748b',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.15s',
                                marginBottom: -2,
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {tab === 'generic' && <GenericMatrix matrix={genericMatrix} />}
            {tab !== 'generic' && <CompanyMatrix co={companies[tab]} />}
        </div>
    );
}
