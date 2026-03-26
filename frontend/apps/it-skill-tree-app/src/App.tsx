import { useState, useRef, useCallback } from 'react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const TOTAL_POINTS = 50;

const DOMAINS = {
    core: { label: 'Core', color: '#e8c97a', glow: '#c9a84c', icon: '⚡' },
    prog: { label: 'Programming', color: '#4fc3f7', glow: '#0288d1', icon: '⌨️' },
    web: { label: 'Web', color: '#81c784', glow: '#388e3c', icon: '🌐' },
    eng: { label: 'Engineering', color: '#ce93d8', glow: '#7b1fa2', icon: '⚙️' },
    cross: { label: 'Cross-Cutting', color: '#ffb74d', glow: '#e65100', icon: '🔗' },
    cloud: { label: 'Cloud & Infra', color: '#80cbc4', glow: '#00695c', icon: '☁️' },
    sec: { label: 'Security', color: '#ef9a9a', glow: '#b71c1c', icon: '🔒' },
    data: { label: 'Data', color: '#ffcc80', glow: '#f57c00', icon: '🗄️' },
    net: { label: 'Networking', color: '#a5d6a7', glow: '#2e7d32', icon: '🌍' },
};

// Tree layout: root at top, branches downward
// prereqs = skill IDs that must be ≥1 to unlock
// angle = rough angular hint (not used for layout but for grouping)
const SKILLS = [
    // ── ROOT ──
    { id: 'root', label: 'IT Fundamentals', domain: 'core', prereqs: [], row: 0, col: 7 },

    // ── TIER 1 — 4 main branches ──
    { id: 'coding', label: 'Coding', domain: 'prog', prereqs: ['root'], row: 1, col: 2 },
    { id: 'docs', label: 'Tech Docs', domain: 'cross', prereqs: ['root'], row: 1, col: 5 },
    { id: 'netbasics', label: 'Networking', domain: 'net', prereqs: ['root'], row: 1, col: 9 },
    { id: 'sql', label: 'SQL & Rel. DBs', domain: 'data', prereqs: ['root'], row: 1, col: 12 },

    // ── TIER 2 ──
    { id: 'scripting', label: 'Scripting', domain: 'prog', prereqs: ['coding'], row: 2, col: 0 },
    { id: 'vcs', label: 'Version Control', domain: 'prog', prereqs: ['coding'], row: 2, col: 2 },
    { id: 'paradigms', label: 'Prog. Paradigms', domain: 'prog', prereqs: ['coding'], row: 2, col: 4 },
    { id: 'testing', label: 'Testing & QA', domain: 'cross', prereqs: ['coding', 'docs'], row: 2, col: 6 },
    { id: 'netsec', label: 'Network Security', domain: 'net', prereqs: ['netbasics'], row: 2, col: 9 },
    { id: 'nosql', label: 'NoSQL', domain: 'data', prereqs: ['sql'], row: 2, col: 11 },
    { id: 'pipelines', label: 'Data Pipelines', domain: 'data', prereqs: ['sql'], row: 2, col: 13 },

    // ── TIER 3 ──
    { id: 'devops', label: 'DevOps & CI/CD', domain: 'web', prereqs: ['scripting', 'vcs'], row: 3, col: 0 },
    { id: 'frontend', label: 'Frontend Dev', domain: 'web', prereqs: ['coding', 'vcs'], row: 3, col: 3 },
    { id: 'backend', label: 'Backend Dev', domain: 'web', prereqs: ['coding', 'vcs'], row: 3, col: 5 },
    { id: 'engpractice', label: 'Eng. Practices', domain: 'eng', prereqs: ['vcs', 'testing'], row: 3, col: 7 },
    { id: 'cloud', label: 'Cloud Services', domain: 'cloud', prereqs: ['devops', 'netbasics'], row: 3, col: 9 },
    { id: 'infrasec', label: 'Infra Security', domain: 'sec', prereqs: ['netsec', 'cloud'], row: 3, col: 11 },

    // ── TIER 4 ──
    { id: 'containers', label: 'Containers', domain: 'cloud', prereqs: ['devops', 'cloud'], row: 4, col: 0 },
    { id: 'apidesign', label: 'API Design', domain: 'cross', prereqs: ['frontend', 'backend'], row: 4, col: 3 },
    { id: 'fullstack', label: 'Full Stack', domain: 'web', prereqs: ['frontend', 'backend'], row: 4, col: 5 },
    { id: 'sysdesign', label: 'System Design', domain: 'eng', prereqs: ['backend', 'engpractice'], row: 4, col: 7 },
    { id: 'iac', label: 'IaC', domain: 'cloud', prereqs: ['cloud', 'scripting'], row: 4, col: 9 },
    { id: 'securecode', label: 'Secure Coding', domain: 'sec', prereqs: ['coding', 'infrasec'], row: 4, col: 11 },
    { id: 'secops', label: 'SecOps', domain: 'sec', prereqs: ['infrasec'], row: 4, col: 13 },

    // ── TIER 5 ──
    { id: 'observ', label: 'Observability', domain: 'cross', prereqs: ['devops', 'sysdesign'], row: 5, col: 3 },
    { id: 'techarch', label: 'Tech Architecture', domain: 'eng', prereqs: ['sysdesign', 'iac'], row: 5, col: 7 },
];

const LEVEL_DESCS = {
    root: [
        'Understands what IT is; navigates basic tools',
        'Comfortable across IT domains; knows key concepts',
        'Connects ideas across domains; advises others',
        'Guides teams across IT disciplines',
        'Defines IT vision and strategy org-wide',
    ],
    coding: [
        'Basic code w/ guidance',
        'Implement features w/ minor help',
        'Clean, tested code independently',
        'Lead code quality & mentoring',
        'Set coding standards org-wide',
    ],
    scripting: [
        'Write simple scripts w/ guidance',
        'Automate tasks independently',
        'Modular scripts w/ error handling',
        'Design script libraries',
        'Define scripting strategy org-wide',
    ],
    vcs: [
        'Basic Git commands',
        'Branch, merge, resolve conflicts',
        'Design branching strategies',
        'Define VCS standards org-wide',
        'Drive source control strategy',
    ],
    paradigms: [
        'One paradigm (procedural)',
        'Apply OOP or functional patterns',
        'Use multiple paradigms fluidly',
        'Teach paradigm selection',
        'Shape org-wide software design',
    ],
    frontend: [
        'Static HTML/CSS pages',
        'Interactive UI w/ framework',
        'Responsive, accessible UIs',
        'Lead frontend architecture',
        'Define frontend strategy org-wide',
    ],
    backend: [
        'Simple CRUD endpoints',
        'Build & maintain APIs',
        'Design scalable services',
        'Lead backend architecture',
        'Define backend platform strategy',
    ],
    fullstack: [
        'Small changes across stack',
        'Full features w/ guidance',
        'Production-quality full-stack',
        'Own full-stack systems',
        'Drive full-stack engineering vision',
    ],
    devops: [
        'Understand CI/CD; run pipelines',
        'Configure pipelines independently',
        'Design CI/CD & IaC systems',
        'Lead DevOps transformation',
        'Define DevOps strategy org-wide',
    ],
    engpractice: [
        'Follow VCS, review, test processes',
        'Apply best practices consistently',
        'Elevate team processes',
        'Define eng. practices org-wide',
        'Set eng. excellence standards',
    ],
    sysdesign: [
        'Understand client/server/DB',
        'Design simple systems w/ guidance',
        'Design scalable systems',
        'Lead cross-system architecture',
        'Define architectural vision org-wide',
    ],
    techarch: [
        'Read architecture diagrams',
        'Contribute to arch. decisions',
        'Own service architecture',
        'Drive architecture standards',
        "Shape org's technical strategy",
    ],
    testing: [
        'Basic unit tests w/ guidance',
        'Unit & integration tests independently',
        'Design test strategies & TDD',
        'Own quality engineering',
        'Define org-wide QA culture',
    ],
    apidesign: [
        'Consume APIs; understand REST',
        'Design simple REST endpoints',
        'Clean, versioned API design',
        'Lead API standards & GraphQL',
        'Define API strategy org-wide',
    ],
    observ: [
        'Read dashboards & alerts',
        'Add instrumentation to services',
        'Design observability strategy',
        'Lead observability platform',
        'Define org-wide SLO/SLA standards',
    ],
    docs: [
        'Basic READMEs & comments',
        'Document features & runbooks',
        'Establish team doc standards',
        'Drive documentation culture',
        'Define knowledge management strategy',
    ],
    cloud: [
        'Use managed cloud services',
        'Deploy cloud resources independently',
        'Design cloud architectures',
        'Lead multi-cloud strategy',
        'Define cloud & FinOps strategy',
    ],
    iac: [
        'Read existing IaC templates',
        'Write & apply simple IaC',
        'Design IaC-driven environments',
        'Lead IaC strategy across teams',
        'Define infra automation standards',
    ],
    containers: [
        'Run & inspect Docker containers',
        'Build & manage images',
        'Design containerized architectures',
        'Lead Kubernetes strategy',
        'Define container standards org-wide',
    ],
    securecode: [
        'Know OWASP Top 10',
        'Apply secure coding practices',
        'Threat modeling & shift-left',
        'Lead AppSec program',
        'Define app security policy org-wide',
    ],
    infrasec: [
        'Know least privilege & firewalls',
        'Configure IAM & hardening',
        'Design secure cloud architecture',
        'Lead infra security posture',
        'Define zero-trust strategy',
    ],
    secops: [
        'Monitor alerts; escalate incidents',
        'Triage incidents independently',
        'Build detection & playbooks',
        'Lead SOC & threat intelligence',
        'Define SecOps maturity model',
    ],
    sql: [
        'Basic SELECT & joins',
        'Complex queries & simple schemas',
        'Optimize queries & schemas',
        'Lead DB architecture',
        'Define data governance org-wide',
    ],
    nosql: [
        'Understand SQL vs NoSQL',
        'Use NoSQL independently',
        'Select right data store',
        'Lead multi-model architecture',
        'Define data platform strategy',
    ],
    pipelines: [
        'Understand ETL; run pipelines',
        'Build simple ETL/ELT',
        'Design reliable data pipelines',
        'Lead data platform architecture',
        'Define org-wide data strategy',
    ],
    netbasics: [
        'Know IP, DNS, HTTP basics',
        'Configure & troubleshoot networks',
        'Design subnets, VPNs, routing',
        'Lead network architecture',
        'Define zero-trust networking',
    ],
    netsec: [
        'Know firewalls & VLANs',
        'Configure firewalls & VPNs',
        'Design secure network architecture',
        'Lead network security posture',
        'Define network security strategy',
    ],
};

// ─── LAYOUT ──────────────────────────────────────────────────────────────────

const CX = 80,
    CY = 110,
    PAD_X = 50,
    PAD_Y = 60;
const NR = 30; // node radius

function nodePos(skill: { row: number; col: number }) {
    return {
        x: PAD_X + skill.col * CX,
        y: PAD_Y + skill.row * CY,
    };
}

const ROWS = Math.max(...SKILLS.map((s) => s.row)) + 1;
const COLS = Math.max(...SKILLS.map((s) => s.col)) + 1;
const SVG_W = PAD_X * 2 + (COLS - 1) * CX;
const SVG_H = PAD_Y * 2 + (ROWS - 1) * CY;

function canUnlock(skillId: string, levels: Record<string, number>) {
    const skill = SKILLS.find((s) => s.id === skillId);
    if (!skill) return false;
    return skill.prereqs.every((pid) => (levels[pid] || 0) >= 1);
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function App() {
    const [levels, setLevels] = useState<Record<string, number>>({});
    const [selected, setSelected] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const totalSpent = Object.values(levels).reduce((a, b) => a + b, 0);
    const remaining = TOTAL_POINTS - totalSpent;

    const addPoint = useCallback(
        (id: string) => {
            if (remaining <= 0) return;
            if (!canUnlock(id, levels)) return;
            const cur = levels[id] || 0;
            if (cur >= 5) return;
            setLevels((p) => ({ ...p, [id]: cur + 1 }));
        },
        [levels, remaining]
    );

    const removePoint = useCallback(
        (id: string) => {
            const cur = levels[id] || 0;
            if (cur <= 0) return;
            const wouldBreak = SKILLS.some((s) => s.prereqs.includes(id) && (levels[s.id] || 0) >= 1 && cur - 1 < 1);
            if (wouldBreak) return;
            setLevels((p) => ({ ...p, [id]: cur - 1 }));
        },
        [levels]
    );

    const reset = () => {
        setLevels({});
        setSelected(null);
    };

    const selSkill = selected ? SKILLS.find((s) => s.id === selected) : null;
    const selLevel = selected ? levels[selected] || 0 : 0;
    const selDom = selSkill ? DOMAINS[selSkill.domain as keyof typeof DOMAINS] : DOMAINS.core;

    // edges
    const edges: { from: (typeof SKILLS)[number]; to: (typeof SKILLS)[number] }[] = [];
    SKILLS.forEach((s) =>
        s.prereqs.forEach((pid) => {
            const from = SKILLS.find((sk) => sk.id === pid);
            if (from) edges.push({ from, to: s });
        })
    );

    return (
        <div
            style={{
                background: '#080407',
                minHeight: '100vh',
                fontFamily: 'Georgia,serif',
                color: '#c9a84c',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* ── HEADER ── */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 20px',
                    background: 'linear-gradient(180deg,#1a0a00,#0d0508)',
                    borderBottom: '2px solid #3a1a08',
                    flexShrink: 0,
                }}
            >
                <div
                    style={{
                        fontSize: 16,
                        fontWeight: 700,
                        letterSpacing: 3,
                        color: '#e8c97a',
                        textShadow: '0 0 14px #c9a84c88',
                    }}
                >
                    ⚔ IT SKILL TREE
                </div>
                <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                    {Object.entries(DOMAINS)
                        .filter(([k]) => k !== 'core')
                        .map(([k, d]) => (
                            <div
                                key={k}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    fontSize: 10,
                                    color: d.color,
                                    opacity: 0.7,
                                }}
                            >
                                <span>{d.icon}</span>
                                <span style={{ letterSpacing: 1 }}>{d.label.toUpperCase()}</span>
                            </div>
                        ))}
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 9, color: '#5a3a1a', letterSpacing: 1 }}>POINTS LEFT</div>
                        <div
                            style={{
                                fontSize: 20,
                                fontWeight: 700,
                                color: remaining > 0 ? '#e8c97a' : '#444',
                                textShadow: '0 0 8px #c9a84c55',
                            }}
                        >
                            {remaining}
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 9, color: '#5a3a1a', letterSpacing: 1 }}>INVESTED</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#81c784' }}>{totalSpent}</div>
                    </div>
                    <button
                        onClick={reset}
                        style={{
                            padding: '5px 12px',
                            background: '#150808',
                            border: '1px solid #5a1a1a',
                            color: '#ef9a9a',
                            fontSize: 10,
                            cursor: 'pointer',
                            borderRadius: 3,
                            letterSpacing: 1,
                        }}
                    >
                        RESET
                    </button>
                </div>
            </div>

            {/* ── BODY ── */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* ── TREE CANVAS ── */}
                <div ref={containerRef} style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
                    <svg width={SVG_W} height={SVG_H}>
                        <defs>
                            {Object.entries(DOMAINS).map(([k, d]) => (
                                <radialGradient key={k} id={`rg_${k}`} cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor={d.color} stopOpacity="0.4" />
                                    <stop offset="100%" stopColor={d.color} stopOpacity="0" />
                                </radialGradient>
                            ))}
                            <filter id="f_glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            <filter id="f_glow_sm" x="-30%" y="-30%" width="160%" height="160%">
                                <feGaussianBlur stdDeviation="2" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* ── EDGES ── */}
                        {edges.map((e, i) => {
                            const p1 = nodePos(e.from),
                                p2 = nodePos(e.to);
                            const lv = levels[e.from.id] || 0;
                            const active = lv >= 1;
                            const dom = DOMAINS[e.from.domain as keyof typeof DOMAINS];
                            const isSel = selected && (selected === e.from.id || selected === e.to.id);
                            const mx = (p1.x + p2.x) / 2,
                                my = (p1.y + p2.y) / 2;
                            return (
                                <g key={i}>
                                    {/* glow copy */}
                                    {active && (
                                        <path
                                            d={`M${p1.x},${p1.y} Q${mx},${my} ${p2.x},${p2.y}`}
                                            fill="none"
                                            stroke={dom.color}
                                            strokeWidth={4}
                                            opacity={0.08}
                                        />
                                    )}
                                    <path
                                        d={`M${p1.x},${p1.y} Q${mx},${my} ${p2.x},${p2.y}`}
                                        fill="none"
                                        stroke={isSel ? '#e8c97a' : active ? dom.color : '#2a1204'}
                                        strokeWidth={isSel ? 2.5 : active ? 1.5 : 1}
                                        strokeDasharray={active ? 'none' : '5 4'}
                                        opacity={isSel ? 1 : active ? 0.6 : 0.3}
                                    />
                                    {/* arrowhead */}
                                    {active &&
                                        (() => {
                                            const dx = p2.x - mx,
                                                dy = p2.y - my;
                                            const len = Math.sqrt(dx * dx + dy * dy) || 1;
                                            const ax = p2.x - (dx / len) * (NR + 4),
                                                ay = p2.y - (dy / len) * (NR + 4);
                                            const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
                                            return (
                                                <polygon
                                                    points="-5,-3 0,0 -5,3"
                                                    transform={`translate(${ax},${ay}) rotate(${angle})`}
                                                    fill={isSel ? '#e8c97a' : dom.color}
                                                    opacity={0.7}
                                                />
                                            );
                                        })()}
                                </g>
                            );
                        })}

                        {/* ── NODES ── */}
                        {SKILLS.map((skill) => {
                            const { x, y } = nodePos(skill);
                            const lv = levels[skill.id] || 0;
                            const dom = DOMAINS[skill.domain as keyof typeof DOMAINS];
                            const unlockable = canUnlock(skill.id, levels) && lv < 5 && remaining > 0;
                            const locked = !canUnlock(skill.id, levels) && lv === 0;
                            const isSel = selected === skill.id;
                            const isRoot = skill.id === 'root';

                            return (
                                <g
                                    key={skill.id}
                                    style={{ cursor: unlockable || lv > 0 ? 'pointer' : 'default' }}
                                    onClick={() => {
                                        setSelected(isSel ? null : (skill.id as string));
                                        if (unlockable) addPoint(skill.id);
                                    }}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        removePoint(skill.id);
                                    }}
                                >
                                    {/* outer glow halo */}
                                    {lv > 0 && <circle cx={x} cy={y} r={NR + 18} fill={`url(#rg_${skill.domain})`} />}

                                    {/* selection ring */}
                                    {isSel && (
                                        <circle
                                            cx={x}
                                            cy={y}
                                            r={NR + 9}
                                            fill="none"
                                            stroke="#e8c97a"
                                            strokeWidth={1.5}
                                            strokeDasharray="4 3"
                                            opacity={0.7}
                                        />
                                    )}

                                    {/* unlockable pulse ring */}
                                    {unlockable && lv === 0 && (
                                        <circle
                                            cx={x}
                                            cy={y}
                                            r={NR + 6}
                                            fill="none"
                                            stroke={dom.color}
                                            strokeWidth={1}
                                            strokeDasharray="3 3"
                                            opacity={0.5}
                                        />
                                    )}

                                    {/* outer decorative ring */}
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r={NR + 3}
                                        fill="none"
                                        stroke={lv > 0 ? dom.color : locked ? '#1a0800' : '#3a1a06'}
                                        strokeWidth={isRoot ? 2.5 : 1.5}
                                        opacity={lv > 0 ? 0.85 : 0.4}
                                    />

                                    {/* node body */}
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r={NR}
                                        fill={lv > 0 ? '#180c04' : '#0e0604'}
                                        stroke={isSel ? '#e8c97a' : lv > 0 ? dom.glow : '#1a0800'}
                                        strokeWidth={isSel ? 2 : 1}
                                        filter={lv > 0 ? 'url(#f_glow_sm)' : 'none'}
                                    />

                                    {/* level fill overlay */}
                                    {lv > 0 && (
                                        <circle cx={x} cy={y} r={NR} fill={dom.color} opacity={0.06 + lv * 0.07} />
                                    )}

                                    {/* icon */}
                                    <text
                                        x={x}
                                        y={y - 5}
                                        textAnchor="middle"
                                        fontSize={isRoot ? 18 : 14}
                                        opacity={locked ? 0.2 : 1}
                                    >
                                        {dom.icon}
                                    </text>

                                    {/* label */}
                                    <text
                                        x={x}
                                        y={y + 10}
                                        textAnchor="middle"
                                        fontSize={7}
                                        fontWeight={700}
                                        fill={lv > 0 ? dom.color : locked ? '#2a1004' : '#5a3010'}
                                        letterSpacing={0.5}
                                    >
                                        {skill.label
                                            .toUpperCase()
                                            .split(' ')
                                            .map((w, wi) => (
                                                <tspan key={wi} x={x} dy={wi === 0 ? 0 : 8}>
                                                    {w}
                                                </tspan>
                                            ))}
                                    </text>

                                    {/* level pips */}
                                    {[0, 1, 2, 3, 4].map((pi) => (
                                        <circle
                                            key={pi}
                                            cx={x - 10 + pi * 5}
                                            cy={y + NR + 8}
                                            r={2}
                                            fill={pi < lv ? dom.color : '#180c04'}
                                            stroke={pi < lv ? dom.glow : '#2a1004'}
                                            strokeWidth={0.7}
                                            opacity={pi < lv ? 1 : 0.4}
                                        />
                                    ))}
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* ── SIDE PANEL ── */}
                <div
                    style={{
                        width: 230,
                        background: 'linear-gradient(180deg,#100808,#08040a)',
                        borderLeft: '2px solid #2a1008',
                        padding: '14px 12px',
                        overflowY: 'auto',
                        flexShrink: 0,
                    }}
                >
                    {selSkill ? (
                        <>
                            {/* header */}
                            <div
                                style={{
                                    textAlign: 'center',
                                    marginBottom: 14,
                                    paddingBottom: 10,
                                    borderBottom: '1px solid #2a1008',
                                }}
                            >
                                <div style={{ fontSize: 26, marginBottom: 4 }}>{selDom.icon}</div>
                                <div
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color: selDom.color,
                                        letterSpacing: 1.5,
                                        textShadow: `0 0 10px ${selDom.glow}`,
                                    }}
                                >
                                    {selSkill.label.toUpperCase()}
                                </div>
                                <div style={{ fontSize: 9, color: '#5a3a1a', marginTop: 2, letterSpacing: 1 }}>
                                    {selDom.label}
                                </div>
                            </div>

                            {/* level bar */}
                            <div style={{ marginBottom: 12 }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: 9,
                                        color: '#5a3a1a',
                                        marginBottom: 4,
                                        letterSpacing: 1,
                                    }}
                                >
                                    <span>LEVEL</span>
                                    <span style={{ color: selDom.color }}>{selLevel} / 5</span>
                                </div>
                                <div style={{ display: 'flex', gap: 2 }}>
                                    {[1, 2, 3, 4, 5].map((l) => (
                                        <div
                                            key={l}
                                            style={{
                                                flex: 1,
                                                height: 5,
                                                borderRadius: 2,
                                                background: l <= selLevel ? selDom.color : '#180c04',
                                                boxShadow: l <= selLevel ? `0 0 6px ${selDom.glow}` : 'none',
                                                transition: 'all 0.2s',
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* current */}
                            {selLevel > 0 && (
                                <div
                                    style={{
                                        background: '#0d0508',
                                        border: `1px solid ${selDom.glow}33`,
                                        borderRadius: 4,
                                        padding: '8px 9px',
                                        marginBottom: 8,
                                    }}
                                >
                                    <div style={{ fontSize: 8, color: '#5a3a1a', letterSpacing: 1, marginBottom: 3 }}>
                                        CURRENT — L{selLevel}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#c9a84c', lineHeight: 1.55 }}>
                                        {(LEVEL_DESCS as Record<string, string[]>)[selSkill.id]?.[selLevel - 1]}
                                    </div>
                                </div>
                            )}

                            {/* next */}
                            {selLevel < 5 && (
                                <div
                                    style={{
                                        background: '#0d0508',
                                        border: '1px solid #2a1008',
                                        borderRadius: 4,
                                        padding: '8px 9px',
                                        marginBottom: 8,
                                    }}
                                >
                                    <div style={{ fontSize: 8, color: '#3a1a08', letterSpacing: 1, marginBottom: 3 }}>
                                        NEXT — L{selLevel + 1}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#5a3a1a', lineHeight: 1.55 }}>
                                        {(LEVEL_DESCS as Record<string, string[]>)[selSkill.id]?.[selLevel]}
                                    </div>
                                </div>
                            )}

                            {/* prereqs */}
                            {selSkill.prereqs.length > 0 && (
                                <div style={{ marginBottom: 10 }}>
                                    <div style={{ fontSize: 8, color: '#4a2a10', letterSpacing: 1, marginBottom: 5 }}>
                                        REQUIRES
                                    </div>
                                    {selSkill.prereqs.map((pid) => {
                                        const ps = SKILLS.find((s) => s.id === pid);
                                        const pl = levels[pid] || 0;
                                        const pd = DOMAINS[ps!.domain as keyof typeof DOMAINS];
                                        return (
                                            <div
                                                key={pid}
                                                onClick={() => setSelected(pid as string)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    marginBottom: 4,
                                                    cursor: 'pointer',
                                                    padding: '3px 0',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: 6,
                                                        height: 6,
                                                        borderRadius: '50%',
                                                        background: pl >= 1 ? pd.color : '#2a1008',
                                                        flexShrink: 0,
                                                        boxShadow: pl >= 1 ? `0 0 4px ${pd.glow}` : 'none',
                                                    }}
                                                />
                                                <span style={{ fontSize: 10, color: pl >= 1 ? pd.color : '#3a1a08' }}>
                                                    {ps!.label}
                                                </span>
                                                <span style={{ fontSize: 9, color: '#3a1a08', marginLeft: 'auto' }}>
                                                    {pl}/5
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* unlocks */}
                            {(() => {
                                const unlocks = SKILLS.filter((s) => s.prereqs.includes(selSkill.id));
                                return unlocks.length > 0 ? (
                                    <div style={{ marginBottom: 10 }}>
                                        <div
                                            style={{ fontSize: 8, color: '#4a2a10', letterSpacing: 1, marginBottom: 5 }}
                                        >
                                            UNLOCKS
                                        </div>
                                        {unlocks.map((us) => {
                                            const ud = DOMAINS[us.domain as keyof typeof DOMAINS];
                                            const ul = levels[us.id] || 0;
                                            return (
                                                <div
                                                    key={us.id}
                                                    onClick={() => setSelected(us.id as string)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 6,
                                                        marginBottom: 4,
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: 6,
                                                            height: 6,
                                                            borderRadius: '50%',
                                                            background: ul > 0 ? ud.color : '#2a1008',
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                    <span
                                                        style={{ fontSize: 10, color: ul > 0 ? ud.color : '#3a1a08' }}
                                                    >
                                                        {us.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : null;
                            })()}

                            {/* actions */}
                            <div style={{ display: 'flex', gap: 5, marginTop: 12 }}>
                                {canUnlock(selSkill.id, levels) && selLevel < 5 && remaining > 0 && (
                                    <button
                                        onClick={() => addPoint(selSkill.id)}
                                        style={{
                                            flex: 1,
                                            padding: '7px 0',
                                            background: `linear-gradient(180deg,${selDom.glow}33,${selDom.glow}11)`,
                                            border: `1px solid ${selDom.color}88`,
                                            color: selDom.color,
                                            fontSize: 10,
                                            cursor: 'pointer',
                                            borderRadius: 3,
                                            letterSpacing: 1,
                                            fontWeight: 700,
                                        }}
                                    >
                                        + INVEST
                                    </button>
                                )}
                                {selLevel > 0 && (
                                    <button
                                        onClick={() => removePoint(selSkill.id)}
                                        style={{
                                            flex: 1,
                                            padding: '7px 0',
                                            background: '#150808',
                                            border: '1px solid #4a1010',
                                            color: '#ef9a9a',
                                            fontSize: 10,
                                            cursor: 'pointer',
                                            borderRadius: 3,
                                            letterSpacing: 1,
                                        }}
                                    >
                                        − REFUND
                                    </button>
                                )}
                            </div>

                            {selSkill.prereqs.length > 0 && !canUnlock(selSkill.id, levels) && selLevel === 0 && (
                                <div
                                    style={{
                                        marginTop: 10,
                                        fontSize: 10,
                                        color: '#5a1a1a',
                                        textAlign: 'center',
                                        lineHeight: 1.5,
                                    }}
                                >
                                    🔒 Unlock prerequisites first
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', marginTop: 50, opacity: 0.4 }}>
                            <div style={{ fontSize: 30, marginBottom: 12 }}>⚔️</div>
                            <div style={{ fontSize: 10, color: '#5a3a1a', lineHeight: 1.8 }}>
                                Click a node to inspect.
                                <br />
                                Left-click to invest.
                                <br />
                                Right-click to refund.
                            </div>
                            <div style={{ marginTop: 20, fontSize: 11, color: '#3a1808' }}>
                                — {remaining} points remaining —
                            </div>

                            {/* domain legend */}
                            <div style={{ marginTop: 24, textAlign: 'left' }}>
                                <div style={{ fontSize: 8, color: '#3a1808', letterSpacing: 1, marginBottom: 8 }}>
                                    DOMAINS
                                </div>
                                {Object.entries(DOMAINS).map(([k, d]) => (
                                    <div
                                        key={k}
                                        style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}
                                    >
                                        <div
                                            style={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                background: d.color,
                                                boxShadow: `0 0 4px ${d.glow}`,
                                                flexShrink: 0,
                                            }}
                                        />
                                        <span style={{ fontSize: 10, color: d.color, opacity: 0.7 }}>
                                            {d.icon} {d.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
