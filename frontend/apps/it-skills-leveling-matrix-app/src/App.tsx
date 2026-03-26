import { useState } from 'react';

const LEVELS = ['L1', 'L2', 'L3', 'L4', 'L5'];
const LEVEL_NAMES = ['Beginner', 'Developing', 'Proficient', 'Advanced', 'Expert'];
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
const LEVEL_BG = ['#eff6ff', '#f0fdfa', '#fefce8', '#fff7ed', '#faf5ff'];
const LEVEL_TEXT = ['#1d4ed8', '#0f766e', '#854d0e', '#9a3412', '#6b21a8'];
const LEVEL_BORDER = ['#bfdbfe', '#99f6e4', '#fde68a', '#fed7aa', '#e9d5ff'];

const matrix = [
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
                            'Writes basic code with syntax guidance; reads simple programs',
                            'Implements features in an existing codebase with minor guidance',
                            'Writes clean, tested, maintainable code independently',
                            'Leads code quality initiatives; mentors others on best practices',
                            'Sets coding standards and drives engineering culture org-wide',
                        ],
                    },
                    {
                        name: 'Programming Paradigms',
                        prereqs: ['Coding L2'],
                        levels: [
                            'Familiar with one paradigm (e.g. procedural)',
                            'Applies OOP or functional patterns with understanding',
                            'Fluidly uses multiple paradigms; selects appropriately per problem',
                            'Teaches paradigm selection; guides design across teams',
                            'Shapes org-wide approach to software design at a foundational level',
                        ],
                    },
                    {
                        name: 'Version Control',
                        prereqs: [],
                        levels: [
                            'Uses basic Git commands (clone, commit, push) with guidance',
                            'Branches, merges, and resolves conflicts independently',
                            'Designs branching strategies; enforces clean Git workflows',
                            'Defines VCS standards and tooling across teams',
                            'Drives source control strategy org-wide including monorepo vs polyrepo decisions',
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
                            'Builds static pages using HTML/CSS with guidance',
                            'Builds interactive UI components using a framework (e.g. React)',
                            'Designs responsive, accessible UIs; owns frontend architecture for a feature',
                            'Leads frontend architecture across a product; establishes patterns',
                            'Defines frontend strategy, tooling, and standards org-wide',
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
                            'Implements simple CRUD endpoints with guidance',
                            'Builds and maintains APIs and services independently',
                            'Designs scalable backend services; owns data modeling decisions',
                            'Leads backend architecture across multiple services',
                            'Defines backend platform strategy and engineering principles',
                        ],
                    },
                    {
                        name: 'Full Stack Development',
                        prereqs: ['Frontend Development L2', 'Backend Development L2'],
                        levels: [
                            'Makes small guided changes across frontend and backend',
                            'Builds complete features end-to-end with some guidance',
                            'Independently delivers full-stack features with production quality',
                            'Designs and owns full-stack systems; enables others across the stack',
                            'Drives full-stack engineering vision and cross-cutting technical decisions',
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
                            'Understands CI/CD concepts; runs existing pipelines',
                            'Configures and maintains pipelines and deployment workflows',
                            'Designs and owns CI/CD systems; implements Infrastructure as Code',
                            'Leads DevOps transformation; builds platform engineering capabilities',
                            'Defines DevOps and SRE strategy across the engineering organization',
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
                            'Follows established processes (VCS, code review, basic testing)',
                            'Applies engineering best practices consistently and independently',
                            'Elevates team practices; introduces improvements to process and tooling',
                            'Defines engineering practices at team or org level',
                            'Sets engineering excellence standards across the organization',
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
                            'Understands basic system components (client, server, database)',
                            'Designs simple systems or modules with guidance',
                            'Independently designs scalable, maintainable systems for a product',
                            'Leads architecture for a domain; makes cross-system design decisions',
                            'Defines architectural vision and governance for the entire organization',
                        ],
                    },
                    {
                        name: 'Technical Architecture',
                        prereqs: ['System Design L3'],
                        levels: [
                            'Reads and understands architecture diagrams',
                            'Contributes to architectural decisions with guidance',
                            'Owns architecture for a service or product area',
                            'Drives architectural standards and reviews across teams',
                            "Shapes the org's long-term technical strategy and architecture",
                        ],
                    },
                ],
            },
        ],
    },
    {
        domain: 'Cross-Cutting',
        icon: '🔗',
        note: 'These skills bridge multiple domains and are expected at every level.',
        categories: [
            {
                name: 'Testing & QA',
                bridging: 'Programming ↔ Engineering',
                skills: [
                    {
                        name: 'Testing & QA',
                        prereqs: ['Coding L1'],
                        levels: [
                            'Writes basic unit tests with guidance; understands why testing matters',
                            'Writes unit and integration tests independently; follows a test plan',
                            'Designs test strategies; introduces TDD/BDD practices on a team',
                            'Owns quality engineering across a product; builds automated QA pipelines',
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
                            'Consumes existing APIs; understands REST basics',
                            'Designs simple RESTful endpoints; writes basic API documentation',
                            'Designs clean, versioned APIs; considers backward compatibility',
                            'Leads API design standards; introduces GraphQL or gRPC where appropriate',
                            'Defines API strategy and governance across the organization',
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
                            'Reads existing dashboards and alerts; understands logs and metrics',
                            'Adds instrumentation to services; creates basic dashboards',
                            'Designs observability strategy for a service (logs, metrics, traces)',
                            'Leads observability platform across teams; drives SLO/SLA culture',
                            'Defines org-wide observability standards and incident response maturity',
                        ],
                    },
                ],
            },
            {
                name: 'Documentation & Technical Writing',
                bridging: 'All domains',
                skills: [
                    {
                        name: 'Technical Documentation',
                        prereqs: [],
                        levels: [
                            'Writes basic README files and inline code comments',
                            'Documents features, APIs, and runbooks clearly and independently',
                            'Establishes documentation standards for a team; maintains living docs',
                            'Drives documentation culture; integrates docs into the dev workflow',
                            'Defines org-wide knowledge management and documentation strategy',
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
                            'Uses managed cloud services (storage, compute) with guidance',
                            'Deploys and manages cloud resources independently on one provider',
                            'Designs cloud architectures; optimizes for cost and reliability',
                            'Leads multi-cloud or hybrid strategies across teams',
                            'Defines cloud platform strategy and FinOps governance org-wide',
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
                            'Reads and understands existing IaC templates (e.g. Terraform)',
                            'Writes and applies IaC for simple infrastructure changes',
                            'Designs and maintains full IaC-driven environments independently',
                            'Leads IaC strategy and module design across teams',
                            'Defines infrastructure automation standards org-wide',
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
                            'Runs and inspects Docker containers with guidance',
                            'Builds and manages container images independently',
                            'Designs containerized application architectures',
                            'Leads Kubernetes or orchestration platform strategy for a team',
                            'Defines container and orchestration standards org-wide',
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
                            'Aware of common vulnerabilities (OWASP Top 10); avoids obvious mistakes',
                            'Applies secure coding practices consistently (input validation, auth basics)',
                            'Conducts threat modeling; integrates security into the dev lifecycle',
                            'Leads AppSec program; champions shift-left security across teams',
                            'Defines application security strategy and policy org-wide',
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
                            'Understands basic principles: least privilege, firewalls, patching',
                            'Configures IAM roles, security groups, and basic hardening independently',
                            'Designs secure network and cloud architectures; conducts security reviews',
                            'Leads infrastructure security posture across environments',
                            'Defines security architecture and zero-trust strategy org-wide',
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
                            'Monitors alerts; escalates incidents per playbook',
                            'Triages and responds to security incidents independently',
                            'Builds detection rules and incident response playbooks',
                            'Leads SOC capabilities and threat intelligence program',
                            'Defines SecOps maturity model and org-wide incident response strategy',
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
                            'Writes basic SELECT queries; understands tables and joins',
                            'Writes complex queries; designs simple schemas',
                            'Optimizes queries; designs normalized schemas for production systems',
                            'Leads database architecture decisions; implements replication/sharding',
                            'Defines data storage standards and DB governance org-wide',
                        ],
                    },
                    {
                        name: 'NoSQL & Distributed DBs',
                        prereqs: ['SQL & Relational DBs L2'],
                        levels: [
                            'Understands the difference between SQL and NoSQL; reads NoSQL queries',
                            'Uses a NoSQL DB (e.g. MongoDB, Redis) independently for a use case',
                            'Selects and designs the right data store per workload',
                            'Leads multi-model data architecture across systems',
                            'Defines data platform strategy including streaming and analytical stores',
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
                            'Understands ETL concepts; runs existing pipelines with guidance',
                            'Builds simple ETL/ELT pipelines independently',
                            'Designs reliable, scalable data pipelines with monitoring',
                            'Leads data platform architecture; introduces data mesh or lakehouse patterns',
                            'Defines org-wide data engineering standards and data strategy',
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
                            'Understands IP, DNS, HTTP/S, and basic TCP/IP model',
                            'Configures basic network settings; troubleshoots connectivity issues',
                            'Designs subnets, VPNs, and routing for a cloud or on-prem environment',
                            'Leads network architecture across environments; implements SDN',
                            'Defines networking strategy including zero-trust and edge networking org-wide',
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
                            'Understands firewalls, VLANs, and basic network hardening',
                            'Configures firewalls, load balancers, and VPN gateways independently',
                            'Designs secure network architectures (DMZ, micro-segmentation)',
                            'Leads network security posture across environments',
                            'Defines network security standards and threat mitigation strategy org-wide',
                        ],
                    },
                ],
            },
        ],
    },
];

export default function App() {
    const [openDomains, setOpenDomains] = useState(Object.fromEntries(matrix.map((_, i) => [i, i < 3])));
    const [openCats, setOpenCats] = useState({});
    const [activeLevel, setActiveLevel] = useState(null);
    const [highlightSkill, setHighlightSkill] = useState(null);
    const [view, setView] = useState('matrix'); // matrix | prereqs

    const toggleDomain = (i) => setOpenDomains((p) => ({ ...p, [i]: !p[i] }));
    const toggleCat = (k) => setOpenCats((p) => ({ ...p, [k]: p[k] === false ? true : false }));

    // Build prereq index
    const allSkills = {};
    matrix.forEach((d) =>
        d.categories.forEach((c) =>
            c.skills.forEach((s) => {
                allSkills[s.name] = s;
            })
        )
    );

    return (
        <div
            style={{
                fontFamily: 'system-ui,sans-serif',
                maxWidth: 980,
                margin: '0 auto',
                padding: '20px 14px',
                background: 'var(--background, #fff)',
                color: 'var(--text-primary, #111)',
            }}
        >
            {/* Header */}
            <div
                style={{
                    marginBottom: 20,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    flexWrap: 'wrap',
                    gap: 8,
                }}
            >
                <div>
                    <h1 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 2px' }}>IT Skills Leveling Matrix</h1>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                        8 domains · 4 cross-cutting links · 5 levels · Competency + Prerequisite view
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    {['matrix', 'prereqs'].map((v) => (
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
            </div>

            {/* Level filter */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginRight: 2 }}>FILTER:</span>
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
                                activeLevel === i ? LEVEL_BG[i] : activeLevel === null ? LEVEL_BG[i] + '88' : '#f1f5f9',
                            color: activeLevel === i ? LEVEL_TEXT[i] : activeLevel === null ? LEVEL_TEXT[i] : '#94a3b8',
                            borderColor:
                                activeLevel === i
                                    ? LEVEL_BORDER[i]
                                    : activeLevel === null
                                      ? LEVEL_BORDER[i]
                                      : '#e2e8f0',
                            transition: 'all 0.15s',
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

            {view === 'prereqs' ? (
                <PrereqMap allSkills={allSkills} matrix={matrix} />
            ) : (
                matrix.map((dom, di) => {
                    const dc = DOMAIN_COLORS[dom.domain] || DOMAIN_COLORS['Programming'];
                    return (
                        <div
                            key={di}
                            style={{
                                marginBottom: 14,
                                borderRadius: 12,
                                border: '1.5px solid #e2e8f0',
                                overflow: 'hidden',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                            }}
                        >
                            <button
                                onClick={() => toggleDomain(di)}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '11px 16px',
                                    background: dc.bg,
                                    color: '#fff',
                                    fontSize: 14,
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
                                    {dom.note ? (
                                        <span style={{ fontSize: 11, fontWeight: 400, marginLeft: 10, opacity: 0.75 }}>
                                            {dom.note}
                                        </span>
                                    ) : null}
                                </span>
                                <span style={{ fontSize: 11, opacity: 0.6 }}>
                                    {openDomains[di] ? '▲' : '▼'}{' '}
                                    {dom.categories.reduce((a, c) => a + c.skills.length, 0)} skills
                                </span>
                            </button>

                            {openDomains[di] &&
                                dom.categories.map((cat, ci) => {
                                    const ck = `${di}-${ci}`;
                                    const isOpen = openCats[ck] !== false;
                                    return (
                                        <div key={ci} style={{ borderTop: '1px solid #e2e8f0' }}>
                                            <button
                                                onClick={() => toggleCat(ck)}
                                                style={{
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    padding: '8px 16px',
                                                    background: '#f8fafc',
                                                    fontSize: 12,
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
                                                                marginLeft: 8,
                                                                fontSize: 10,
                                                                fontWeight: 600,
                                                                padding: '2px 7px',
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
                                                <span style={{ fontSize: 10, color: '#94a3b8' }}>
                                                    {isOpen ? '▲' : '▼'}
                                                </span>
                                            </button>

                                            {isOpen &&
                                                cat.skills.map((skill, si) => (
                                                    <div key={si} style={{ borderTop: '1px solid #f1f5f9' }}>
                                                        <div
                                                            style={{
                                                                padding: '7px 16px 5px 28px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 8,
                                                                flexWrap: 'wrap',
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    fontSize: 11,
                                                                    fontWeight: 700,
                                                                    color: '#475569',
                                                                    textTransform: 'uppercase',
                                                                    letterSpacing: '0.05em',
                                                                }}
                                                            >
                                                                🔹 {skill.name}
                                                            </span>
                                                            {skill.prereqs.length > 0 && (
                                                                <span style={{ fontSize: 10, color: '#94a3b8' }}>
                                                                    requires:{' '}
                                                                    {skill.prereqs.map((p, pi) => (
                                                                        <span
                                                                            key={pi}
                                                                            onMouseEnter={() =>
                                                                                setHighlightSkill(p.split(' L')[0])
                                                                            }
                                                                            onMouseLeave={() => setHighlightSkill(null)}
                                                                            style={{
                                                                                display: 'inline-block',
                                                                                marginRight: 4,
                                                                                padding: '1px 7px',
                                                                                borderRadius: 10,
                                                                                background: '#f1f5f9',
                                                                                color: '#6366f1',
                                                                                fontWeight: 600,
                                                                                border: '1px solid #e0e7ff',
                                                                                cursor: 'default',
                                                                                fontSize: 10,
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
                                                                            padding: '9px 11px',
                                                                            borderRight:
                                                                                li < 4 ? '1px solid #f1f5f9' : 'none',
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
                                                                                fontSize: 10,
                                                                                fontWeight: 700,
                                                                                marginBottom: 3,
                                                                                color: LEVEL_TEXT[li],
                                                                            }}
                                                                        >
                                                                            {LEVELS[li]}
                                                                        </div>
                                                                        <div
                                                                            style={{
                                                                                fontSize: 11,
                                                                                color: '#374151',
                                                                                lineHeight: 1.45,
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
                })
            )}
        </div>
    );
}

function PrereqMap({ allSkills, matrix }) {
    const [hover, setHover] = useState(null);

    const nodes = [];
    const edges = [];
    const domainList = matrix.map((d) => d.domain);

    // Assign positions by domain column, skill row
    const domainSkills = {};
    matrix.forEach((d, di) => {
        domainSkills[d.domain] = [];
        d.categories.forEach((c) => c.skills.forEach((s) => domainSkills[d.domain].push(s.name)));
    });

    const COL_W = 110,
        ROW_H = 52,
        COLS = 8;
    const domainIdx = {};
    matrix.forEach((d, i) => {
        domainIdx[d.domain] = i;
    });

    const nodeMap = {};
    matrix.forEach((d, di) => {
        const dc = DOMAIN_COLORS[d.domain] || DOMAIN_COLORS['Programming'];
        d.categories.forEach((cat) => {
            cat.skills.forEach((s, si) => {
                const x = 60 + di * COL_W;
                const y = 60 + si * ROW_H + domainSkills[d.domain].indexOf(s.name) * ROW_H;
                nodeMap[s.name] = { x, y, domain: d.domain, icon: d.icon, color: dc };
                nodes.push({ name: s.name, x, y, domain: d.domain, color: dc });
            });
        });
    });

    // Recalculate y per skill across all domains stacked
    const allSkillList = [];
    matrix.forEach((d) =>
        d.categories.forEach((c) =>
            c.skills.forEach((s) =>
                allSkillList.push({
                    ...s,
                    domain: d.domain,
                    icon: d.icon,
                    color: DOMAIN_COLORS[d.domain] || DOMAIN_COLORS['Programming'],
                })
            )
        )
    );

    const GRID_COLS = 4;
    const NW = 200,
        NH = 56,
        GAPX = 20,
        GAPY = 14;
    const positioned = allSkillList.map((s, i) => {
        const col = i % GRID_COLS,
            row = Math.floor(i / GRID_COLS);
        return {
            ...s,
            x: col * (NW + GAPX),
            y: row * (NH + GAPY),
            cx: col * (NW + GAPX) + NW / 2,
            cy: row * (NH + GAPY) + NH / 2,
        };
    });
    const posMap = {};
    positioned.forEach((p) => {
        posMap[p.name] = p;
    });

    positioned.forEach((p) => {
        (p.prereqs || []).forEach((pr) => {
            const pname = pr.split(' L')[0];
            if (posMap[pname]) edges.push({ from: posMap[pname], to: p, label: pr });
        });
    });

    const totalW = GRID_COLS * (NW + GAPX);
    const totalH = Math.ceil(allSkillList.length / GRID_COLS) * (NH + GAPY);

    return (
        <div style={{ overflowX: 'auto' }}>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                Arrows show prerequisites. Hover a node to highlight its links.
            </p>
            <svg width={totalW + 40} height={totalH + 40} style={{ display: 'block' }}>
                <defs>
                    <marker id="arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                        <polygon points="0 0, 7 3.5, 0 7" fill="#6366f1" opacity="0.7" />
                    </marker>
                    <marker id="arrHL" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                        <polygon points="0 0, 7 3.5, 0 7" fill="#f59e0b" />
                    </marker>
                </defs>
                <g transform="translate(10,10)">
                    {edges.map((e, i) => {
                        const isHL = hover && (hover === e.from.name || hover === e.to.name);
                        const x1 = e.from.cx,
                            y1 = e.from.cy + e.from.y - e.from.y + NH / 2,
                            x2 = e.to.cx,
                            y2 = e.to.cy;
                        // simple cubic bezier
                        const mx = (x1 + x2) / 2;
                        return (
                            <g key={i} opacity={hover && !isHL ? 0.12 : 1}>
                                <path
                                    d={`M${x1},${e.from.cy} C${x1},${(e.from.cy + e.to.cy) / 2} ${x2},${(e.from.cy + e.to.cy) / 2} ${x2},${e.to.cy}`}
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
