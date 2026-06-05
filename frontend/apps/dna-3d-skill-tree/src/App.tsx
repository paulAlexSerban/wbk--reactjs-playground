import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Sphere, Tube, CatmullRomLine, Stars } from '@react-three/drei';
import * as THREE from 'three';

// ─── Data ────────────────────────────────────────────────────────────────────

const REPOS = [
    {
        id: 'arch',
        label: 'Software Architecture\n& System Design',
        repo: 'wbk--software-architecture-and-system-design',
        strand: 'center',
        desc: 'The root — system thinking, design patterns, and architectural principles.',
        t: 0.0,
    },
    {
        id: 'dsa-py',
        label: 'DSA Python',
        repo: 'wbk--dsa-python',
        strand: 'theory',
        desc: 'Data structures & algorithms through Python. The analytical backbone.',
        t: 0.13,
    },
    {
        id: 'prog-py',
        label: 'Programming w/ Python',
        repo: 'wbk--programming-w-python',
        strand: 'practice',
        desc: 'Applied Python — hands-on exercises and real-world patterns.',
        t: 0.13,
    },
    {
        id: 'dsa-js',
        label: 'DSA JS & TS',
        repo: 'wbk--dsa-js-n-ts',
        strand: 'theory',
        desc: 'Data structures & algorithms in JavaScript and TypeScript.',
        t: 0.26,
    },
    {
        id: 'prog-js',
        label: 'Programming w/ JS & TS',
        repo: 'wbk--programming-w-js-n-ts',
        strand: 'practice',
        desc: 'JavaScript and TypeScript fundamentals through practical exercises.',
        t: 0.26,
    },
    {
        id: 'fcc-dsa',
        label: 'FCC DSA w/ JS',
        repo: 'wbk--fcc-dsa-w-js',
        strand: 'practice',
        desc: 'freeCodeCamp DSA curriculum in JavaScript.',
        t: 0.38,
    },
    {
        id: 'web-eng',
        label: 'Web Engineering',
        repo: 'wbk--web-engineering',
        strand: 'theory',
        desc: 'Core web engineering: HTTP, browsers, APIs, and the full web stack.',
        t: 0.5,
    },
    {
        id: 'fe-forge',
        label: 'Frontend Forge',
        repo: 'wbk--frontend-forge',
        strand: 'practice',
        desc: 'A forge for sharpening frontend skills through real projects.',
        t: 0.5,
    },
    {
        id: 'fcc-rwd',
        label: 'FCC RWD & FE Libs',
        repo: 'wbk--fcc-rwd-n-fe-libs',
        strand: 'practice',
        desc: 'freeCodeCamp Responsive Web Design and frontend libraries.',
        t: 0.62,
    },
    {
        id: 'react-forge',
        label: 'React Forge',
        repo: 'wbk--react-forge',
        strand: 'theory',
        desc: 'Deep dives into React — hooks, state, patterns, and performance.',
        t: 0.62,
    },
    {
        id: 'fso',
        label: 'Full Stack Open 2026',
        repo: 'wbk--full-stack-open-2026',
        strand: 'practice',
        desc: 'University of Helsinki Full Stack Open — modern web dev end-to-end.',
        t: 0.75,
    },
    {
        id: 'scripts',
        label: 'Scripts',
        repo: 'wbk--scripts',
        strand: 'theory',
        desc: 'Utility scripts, automation tools, and small powerful programs.',
        t: 0.87,
    },
    {
        id: 'testing',
        label: 'Software Testing',
        repo: 'wbk--software-testing',
        strand: 'practice',
        desc: 'Testing methodologies: unit, integration, e2e — code that proves itself.',
        t: 0.87,
    },
];

// ─── Helix Math ───────────────────────────────────────────────────────────────

const HELIX_HEIGHT = 22;
const HELIX_RADIUS = 2.2;
const HELIX_TURNS = 3.5;

function helixPoint(t, phase = 0) {
    const angle = t * Math.PI * 2 * HELIX_TURNS + phase;
    const y = (t - 0.5) * HELIX_HEIGHT;
    return new THREE.Vector3(Math.cos(angle) * HELIX_RADIUS, y, Math.sin(angle) * HELIX_RADIUS);
}

function strandPoints(phase: number, n = 120) {
    return Array.from({ length: n }, (_, i) => helixPoint(i / (n - 1), phase));
}

// ─── Colors ───────────────────────────────────────────────────────────────────

const COLORS = {
    theory: '#00d4ff',
    practice: '#00ff9d',
    center: '#ff6b6b',
    rung: 'rgba(255,255,255,0.18)',
    bg: '#050a0f',
};

const EMISSIVE = {
    theory: new THREE.Color('#003a4d'),
    practice: new THREE.Color('#003d26'),
    center: new THREE.Color('#4d1f1f'),
};

// ─── Strand Tube ─────────────────────────────────────────────────────────────

function StrandTube({ phase, color }) {
    const points = useMemo(() => strandPoints(phase), [phase]);
    const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
    return (
        <mesh>
            <tubeGeometry args={[curve, 200, 0.045, 8, false]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={1.2}
                roughness={0.1}
                metalness={0.4}
                transparent
                opacity={0.85}
            />
        </mesh>
    );
}

// ─── Base Pair Rungs ─────────────────────────────────────────────────────────

function Rungs() {
    const rungs = useMemo(() => {
        const out = [];
        const N = 28;
        for (let i = 0; i <= N; i++) {
            const t = i / N;
            const a = helixPoint(t, 0);
            const b = helixPoint(t, Math.PI);
            out.push({ a, b, t });
        }
        return out;
    }, []);

    return (
        <group>
            {rungs.map(({ a, b, t }, i) => {
                const mid = new THREE.Vector3().lerpVectors(a, b, 0.5);
                const dir = new THREE.Vector3().subVectors(b, a);
                const len = dir.length();
                const quat = new THREE.Quaternion();
                quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
                return (
                    <mesh key={i} position={mid} quaternion={quat}>
                        <cylinderGeometry args={[0.025, 0.025, len, 6]} />
                        <meshStandardMaterial color="#ffffff" transparent opacity={0.12} roughness={0.8} />
                    </mesh>
                );
            })}
        </group>
    );
}

// ─── Node ─────────────────────────────────────────────────────────────────────

function Node({ repo, selected, onSelect, username = 'YOUR_USERNAME' }) {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    const isCenter = repo.strand === 'center';
    const color = COLORS[repo.strand];
    const emissive = EMISSIVE[repo.strand];

    const pos = useMemo(() => {
        if (isCenter) {
            const p = helixPoint(repo.t, 0);
            return new THREE.Vector3(0, p.y, 0);
        }
        const phase = repo.strand === 'practice' ? Math.PI : 0;
        return helixPoint(repo.t, phase);
    }, [repo]);

    useFrame((state) => {
        if (!meshRef.current) return;
        const pulse = Math.sin(state.clock.elapsedTime * 2 + repo.t * 10) * 0.08 + 1;
        const scale = (hovered || selected ? 1.5 : 1) * (selected ? pulse : 1);
        meshRef.current.scale.setScalar(scale);
    });

    const radius = isCenter ? 0.28 : 0.18;

    return (
        <group position={pos}>
            {/* Outer glow halo */}
            <mesh>
                <sphereGeometry args={[radius * 2.2, 16, 16]} />
                <meshStandardMaterial
                    color={color}
                    transparent
                    opacity={hovered || selected ? 0.18 : 0.07}
                    roughness={1}
                    depthWrite={false}
                />
            </mesh>

            {/* Main sphere */}
            <mesh
                ref={meshRef}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHovered(true);
                    document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                    setHovered(false);
                    document.body.style.cursor = 'default';
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(repo);
                }}
            >
                <sphereGeometry args={[radius, 24, 24]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={hovered || selected ? 2.5 : 1.4}
                    roughness={0.1}
                    metalness={0.5}
                />
            </mesh>

            {/* Label */}
            <Html center distanceFactor={10} style={{ pointerEvents: 'none', userSelect: 'none' }}>
                <div
                    style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '9px',
                        color: hovered || selected ? '#fff' : color,
                        whiteSpace: 'pre-line',
                        textAlign: repo.strand === 'practice' ? 'left' : repo.strand === 'theory' ? 'right' : 'center',
                        lineHeight: 1.4,
                        textShadow: `0 0 12px ${color}`,
                        transform:
                            repo.strand === 'practice'
                                ? 'translateX(28px)'
                                : repo.strand === 'theory'
                                  ? 'translateX(-28px)'
                                  : 'translateY(-32px)',
                        letterSpacing: '0.04em',
                        fontWeight: selected ? 700 : 400,
                        transition: 'color 0.2s',
                        width: '90px',
                    }}
                >
                    {repo.label}
                </div>
            </Html>
        </group>
    );
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene({ selected, onSelect }) {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current && !selected) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.12;
        }
    });

    return (
        <group ref={groupRef}>
            <StrandTube phase={0} color={COLORS.theory} />
            <StrandTube phase={Math.PI} color={COLORS.practice} />
            <Rungs />
            {REPOS.map((repo) => (
                <Node key={repo.id} repo={repo} selected={selected?.id === repo.id} onSelect={onSelect} />
            ))}
        </group>
    );
}

// ─── Camera Controller ────────────────────────────────────────────────────────

function CameraRig({ selected }) {
    const { camera } = useThree();
    const target = useRef(new THREE.Vector3(0, 0, 14));

    useEffect(() => {
        if (selected) {
            const phase = selected.strand === 'practice' ? Math.PI : 0;
            const pos =
                selected.strand === 'center'
                    ? new THREE.Vector3(0, helixPoint(selected.t, 0).y, 0)
                    : helixPoint(selected.t, phase);
            target.current.set(pos.x * 1.5, pos.y, pos.z * 1.5 + 8);
        } else {
            target.current.set(0, 0, 14);
        }
    }, [selected]);

    useFrame(() => {
        camera.position.lerp(target.current, 0.04);
        camera.lookAt(0, selected ? helixPoint(selected.t, 0).y : 0, 0);
    });

    return null;
}

// ─── Side Panel ───────────────────────────────────────────────────────────────

function Panel({ selected, onClose }) {
    if (!selected) return null;
    const color = COLORS[selected.strand];
    const strandLabel = { theory: 'THEORY STRAND', practice: 'PRACTICE STRAND', center: 'ARCHITECTURE CORE' }[
        selected.strand
    ];

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(5,10,15,0.94)',
                borderTop: `1px solid ${color}44`,
                padding: '20px 28px 24px',
                backdropFilter: 'blur(16px)',
                fontFamily: "'Space Mono', monospace",
                zIndex: 10,
                animation: 'slideUp 0.25s ease',
                boxShadow: `0 -8px 40px ${color}18`,
            }}
        >
            <style>{`@keyframes slideUp { from { transform: translateY(100%); opacity:0 } to { transform: translateY(0); opacity:1 } }`}</style>
            <div style={{ maxWidth: 640, margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 9, letterSpacing: '0.25em', color, marginBottom: 6 }}>
                            {strandLabel}
                        </div>
                        <div style={{ fontSize: 13, color: '#fff', fontWeight: 700, marginBottom: 6, lineHeight: 1.4 }}>
                            {selected.repo}
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(232,244,248,0.55)', lineHeight: 1.6 }}>
                            {selected.desc}
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                        <a
                            href={`https://github.com/YOUR_USERNAME/${selected.repo}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                display: 'block',
                                padding: '8px 16px',
                                background: color,
                                color: '#050a0f',
                                fontSize: 10,
                                fontWeight: 700,
                                letterSpacing: '0.12em',
                                textDecoration: 'none',
                                borderRadius: 3,
                                textTransform: 'uppercase',
                            }}
                        >
                            View Repo →
                        </a>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '8px 16px',
                                background: 'transparent',
                                border: `1px solid rgba(232,244,248,0.2)`,
                                color: 'rgba(232,244,248,0.45)',
                                fontSize: 10,
                                fontFamily: "'Space Mono', monospace",
                                letterSpacing: '0.12em',
                                cursor: 'pointer',
                                borderRadius: 3,
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function Legend() {
    return (
        <div
            style={{
                position: 'fixed',
                top: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                zIndex: 10,
                pointerEvents: 'none',
            }}
        >
            <div
                style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: 'clamp(18px, 3vw, 26px)',
                    letterSpacing: '-0.02em',
                    background: `linear-gradient(135deg, ${COLORS.theory}, #fff 50%, ${COLORS.practice})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}
            >
                Workbook Skill Tree
            </div>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                {[
                    { color: COLORS.theory, label: 'Theory' },
                    { color: COLORS.center, label: 'Architecture' },
                    { color: COLORS.practice, label: 'Practice' },
                ].map(({ color, label }) => (
                    <div
                        key={label}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontFamily: "'Space Mono', monospace",
                            fontSize: 9,
                            letterSpacing: '0.2em',
                            color: 'rgba(232,244,248,0.5)',
                            textTransform: 'uppercase',
                        }}
                    >
                        <div
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: color,
                                boxShadow: `0 0 8px ${color}`,
                            }}
                        />
                        {label}
                    </div>
                ))}
            </div>
            <div
                style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 9,
                    letterSpacing: '0.15em',
                    color: 'rgba(232,244,248,0.25)',
                    textTransform: 'uppercase',
                }}
            >
                Click a node · Drag to orbit · Scroll to zoom
            </div>
        </div>
    );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function DNASkillTree() {
    const [selected, setSelected] = useState(null);

    const handleSelect = (repo) => {
        setSelected((prev) => (prev?.id === repo.id ? null : repo));
    };

    return (
        <div
            style={{ width: '100vw', height: '100vh', background: COLORS.bg, position: 'relative', overflow: 'hidden' }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow: hidden; }
      `}</style>

            <Legend />

            <Canvas
                camera={{ position: [0, 0, 14], fov: 55 }}
                gl={{ antialias: true, alpha: false }}
                style={{ background: COLORS.bg }}
                onClick={() => setSelected(null)}
            >
                {/* Lighting */}
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={1.2} color="#00d4ff" />
                <pointLight position={[-10, -10, -10]} intensity={0.8} color="#00ff9d" />
                <pointLight position={[0, 0, 8]} intensity={0.5} color="#ffffff" />

                {/* Stars */}
                <Stars radius={80} depth={50} count={3000} factor={3} saturation={0} fade speed={0.4} />

                {/* Scene */}
                <Scene selected={selected} onSelect={handleSelect} />

                {/* Camera */}
                <CameraRig selected={selected} />

                {/* Controls (paused when something is selected) */}
                {!selected && (
                    <OrbitControls
                        enablePan={false}
                        minDistance={6}
                        maxDistance={28}
                        autoRotate={false}
                        enableDamping
                        dampingFactor={0.06}
                    />
                )}
            </Canvas>

            <Panel selected={selected} onClose={() => setSelected(null)} />
        </div>
    );
}
