import { useState } from 'react';

type Tab = 'concepts' | 'exercises' | 'problems' | 'code' | 'practical';
type Language = 'python' | 'typescript';
type View = 'levels' | 'projects' | 'models';

const LEVELS = [
    {
        id: 'l1',
        emoji: '🟢',
        label: 'Level 1',
        title: 'Foundations',
        subtitle: 'What DFS is and how it works',
        color: '#22c55e',
        bg: '#052e16',
        border: '#16a34a',
        concepts: [
            'The call stack as implicit memory',
            'Visited set to prevent infinite loops',
            'Recursive vs iterative DFS',
            'DFS on trees (no visited set needed)',
            'Pre-order, in-order, post-order traversal',
        ],
        exercises: [
            'Print all nodes in a binary tree (pre/in/post-order)',
            'Count total nodes in a tree',
            'Find the maximum value in a tree',
            'Check if a value exists in a graph',
            'DFS on an adjacency list graph',
        ],
        problems: [
            { name: 'Binary Tree Inorder Traversal', lc: '94', diff: 'Easy' },
            { name: 'Maximum Depth of Binary Tree', lc: '104', diff: 'Easy' },
            { name: 'Path Sum', lc: '112', diff: 'Easy' },
            { name: 'Same Tree', lc: '100', diff: 'Easy' },
        ],
        practical: [
            'Traverse a JSON/XML tree and collect all leaf values',
            'Build a file-system directory lister (recursively print all files)',
        ],
        code: {
            python: `# Recursive DFS on a graph
def dfs(graph, node, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    print(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    return visited

# Iterative DFS with explicit stack
def dfs_iter(graph, start):
    visited, stack = set(), [start]
    while stack:
        node = stack.pop()
        if node in visited: continue
        visited.add(node)
        print(node)
        for nb in graph[node]:
            if nb not in visited:
                stack.append(nb)`,
            typescript: `// Iterative DFS
function dfs(graph: Record<string, string[]>, start: string): string[] {
  const visited = new Set<string>();
  const stack = [start];
  const order: string[] = [];
  while (stack.length) {
    const node = stack.pop()!;
    if (visited.has(node)) continue;
    visited.add(node);
    order.push(node);
    for (const nb of graph[node])
      if (!visited.has(nb)) stack.push(nb);
  }
  return order;
}`,
        },
    },
    {
        id: 'l2',
        emoji: '🟡',
        label: 'Level 2',
        title: 'Trees & Grids',
        subtitle: 'Classic DFS patterns on structured data',
        color: '#eab308',
        bg: '#1c1400',
        border: '#ca8a04',
        concepts: [
            'DFS on 2D grids (4-directional and 8-directional)',
            'Path tracking (pass path as argument)',
            'Subtree aggregation (height, size, sum)',
            'Lowest Common Ancestor',
            'Flood fill pattern',
        ],
        exercises: [
            'Find all root-to-leaf paths in a binary tree',
            'Check if a binary tree is symmetric',
            'Count islands in a binary grid',
            'Measure the area of the largest island',
            'Flood fill an image',
        ],
        problems: [
            { name: 'Number of Islands', lc: '200', diff: 'Medium' },
            { name: 'Max Area of Island', lc: '695', diff: 'Medium' },
            { name: 'Flood Fill', lc: '733', diff: 'Easy' },
            { name: 'Lowest Common Ancestor of BST', lc: '235', diff: 'Medium' },
            { name: 'Binary Tree Paths', lc: '257', diff: 'Easy' },
            { name: 'Diameter of Binary Tree', lc: '543', diff: 'Easy' },
        ],
        practical: [
            'Find all connected regions in a pixel image (paint bucket tool)',
            'Detect and label blobs in a binary image',
            'Build a maze solver on a 2D grid',
        ],
        code: {
            python: `# Count islands in a 2D grid
def num_islands(grid: list[list[str]]) -> int:
    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if grid[r][c] != '1': return
        grid[r][c] = '#'   # mark visited in-place
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            dfs(r + dr, c + dc)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c)
                count += 1
    return count`,
            typescript: `// Flood fill
function floodFill(img: number[][], sr: number, sc: number, color: number): number[][] {
  const orig = img[sr][sc];
  if (orig === color) return img;
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  function dfs(r: number, c: number) {
    if (r < 0 || r >= img.length || c < 0 || c >= img[0].length) return;
    if (img[r][c] !== orig) return;
    img[r][c] = color;
    for (const [dr, dc] of dirs) dfs(r+dr, c+dc);
  }
  dfs(sr, sc);
  return img;
}`,
        },
    },
    {
        id: 'l3',
        emoji: '🟠',
        label: 'Level 3',
        title: 'Backtracking',
        subtitle: 'Choose → Explore → Undo',
        color: '#f97316',
        bg: '#1c0a00',
        border: '#ea580c',
        concepts: [
            'The backtracking template: choose / explore / undo',
            'State space trees',
            'Pruning invalid branches early',
            'Constraint satisfaction problems',
            'Generating all valid combinations/permutations',
        ],
        exercises: [
            'Generate all subsets of a list',
            'Generate all permutations of a list',
            'Generate all valid parentheses strings',
            'Find all paths that sum to a target',
            'Solve a Sudoku board',
        ],
        problems: [
            { name: 'Subsets', lc: '78', diff: 'Medium' },
            { name: 'Permutations', lc: '46', diff: 'Medium' },
            { name: 'Combination Sum', lc: '39', diff: 'Medium' },
            { name: 'Generate Parentheses', lc: '22', diff: 'Medium' },
            { name: 'Word Search', lc: '79', diff: 'Medium' },
            { name: 'N-Queens', lc: '51', diff: 'Hard' },
            { name: 'Sudoku Solver', lc: '37', diff: 'Hard' },
        ],
        practical: [
            'Puzzle solver engine (Sudoku, Nonogram, Kakuro)',
            'Anagram / word-unscrambler tool',
            'Scheduler: assign tasks to time slots without conflicts',
            'Regex engine (NFA simulation via backtracking)',
        ],
        code: {
            python: `# Backtracking template
def backtrack(state, choices):
    if is_solution(state):
        record(state)
        return
    for choice in choices:
        if is_valid(state, choice):
            make_choice(state, choice)    # choose
            backtrack(state, next_choices(state))  # explore
            undo_choice(state, choice)    # UN-choose

# Subsets
def subsets(nums):
    result = []
    def dfs(i, curr):
        result.append(list(curr))
        for j in range(i, len(nums)):
            curr.append(nums[j])   # choose
            dfs(j + 1, curr)       # explore
            curr.pop()             # undo
    dfs(0, [])
    return result`,
            typescript: `// N-Queens
function solveNQueens(n: number): string[][] {
  const res: string[][] = [];
  const board = Array.from({length: n}, () => Array(n).fill('.'));
  function valid(row: number, col: number): boolean {
    for (let r = 0; r < row; r++) {
      if (board[r][col] === 'Q') return false;
      if (board[r][col-(row-r)] === 'Q') return false;
      if (board[r][col+(row-r)] === 'Q') return false;
    }
    return true;
  }
  function dfs(row: number) {
    if (row === n) { res.push(board.map(r => r.join(''))); return; }
    for (let col = 0; col < n; col++) {
      if (!valid(row, col)) continue;
      board[row][col] = 'Q';   // choose
      dfs(row + 1);             // explore
      board[row][col] = '.';   // undo
    }
  }
  dfs(0); return res;
}`,
        },
    },
    {
        id: 'l4',
        emoji: '🔴',
        label: 'Level 4',
        title: 'Graph Algorithms',
        subtitle: 'Cycles, ordering, components',
        color: '#ef4444',
        bg: '#1c0000',
        border: '#dc2626',
        concepts: [
            'DFS coloring: WHITE / GRAY / BLACK',
            'Back edges → cycle detection in directed graphs',
            'Topological sort via post-order DFS',
            'Strongly connected components (Kosaraju / Tarjan)',
            'Bipartite graph check',
        ],
        exercises: [
            'Detect a cycle in a directed graph',
            'Detect a cycle in an undirected graph',
            'Topological sort of a DAG',
            'Check if a graph is bipartite',
            'Find all connected components',
        ],
        problems: [
            { name: 'Course Schedule', lc: '207', diff: 'Medium' },
            { name: 'Course Schedule II', lc: '210', diff: 'Medium' },
            { name: 'Number of Connected Components', lc: '323', diff: 'Medium' },
            { name: 'Is Graph Bipartite?', lc: '785', diff: 'Medium' },
            { name: 'Find Eventual Safe States', lc: '802', diff: 'Medium' },
            { name: 'Redundant Connection II', lc: '685', diff: 'Hard' },
        ],
        practical: [
            'Dependency resolver (npm/pip package install order)',
            'Build system task scheduler (Makefile-like)',
            'Circular import detector for a codebase',
            'Social network: find all friend clusters',
        ],
        code: {
            python: `# Cycle detection + topological sort (DFS coloring)
def topo_sort(graph):
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {n: WHITE for n in graph}
    order, has_cycle = [], [False]

    def dfs(node):
        if has_cycle[0]: return
        color[node] = GRAY
        for nb in graph[node]:
            if color[nb] == GRAY:
                has_cycle[0] = True; return
            if color[nb] == WHITE:
                dfs(nb)
        color[node] = BLACK
        order.append(node)   # post-order

    for node in graph:
        if color[node] == WHITE:
            dfs(node)
    if has_cycle[0]:
        return None          # cycle → no valid order
    return order[::-1]       # reverse post-order = topo sort`,
            typescript: `// Bipartite check
function isBipartite(graph: number[][]): boolean {
  const color = new Array(graph.length).fill(-1);
  function dfs(node: number, c: number): boolean {
    color[node] = c;
    for (const nb of graph[node]) {
      if (color[nb] === -1) {
        if (!dfs(nb, 1 - c)) return false;
      } else if (color[nb] === c) return false;
    }
    return true;
  }
  for (let i = 0; i < graph.length; i++)
    if (color[i] === -1 && !dfs(i, 0)) return false;
  return true;
}`,
        },
    },
    {
        id: 'l5',
        emoji: '⚫',
        label: 'Level 5',
        title: 'Expert',
        subtitle: "DFS + memoization, Tarjan's, Euler paths, bitmask",
        color: '#a855f7',
        bg: '#0d0015',
        border: '#9333ea',
        concepts: [
            'DFS + memoization (top-down DP on graphs/grids)',
            "Tarjan's algorithm: articulation points & bridges",
            'Eulerian path / circuit (Hierholzer via DFS)',
            'DFS on implicit graphs (state-space search)',
            'Bitmask DFS for exponential state problems',
        ],
        exercises: [
            'Longest increasing path in a matrix',
            'Find all bridges in a network',
            'Reconstruct a travel itinerary',
            'Solve Traveling Salesman for N≤20 with bitmask DP',
            'Word ladder via DFS on implicit graph',
        ],
        problems: [
            { name: 'Longest Increasing Path in Matrix', lc: '329', diff: 'Hard' },
            { name: 'Critical Connections in Network', lc: '1192', diff: 'Hard' },
            { name: 'Reconstruct Itinerary', lc: '332', diff: 'Hard' },
            { name: 'Pacific Atlantic Water Flow', lc: '417', diff: 'Medium' },
            { name: 'Alien Dictionary', lc: '269', diff: 'Hard' },
            { name: 'Shortest Path Visiting All Nodes', lc: '847', diff: 'Hard' },
        ],
        practical: [
            'Network reliability tool: find single points of failure (bridges/articulation points)',
            'Flight route planner using Eulerian path',
            'Mini compiler: build and walk an AST with DFS',
            'Dependency graph analyzer with cycle reporting for a monorepo',
        ],
        code: {
            python: `# Longest increasing path in matrix (DFS + memo)
def longest_increasing_path(matrix):
    rows, cols = len(matrix), len(matrix[0])
    from functools import lru_cache

    @lru_cache(maxsize=None)
    def dfs(r, c):
        best = 1
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<rows and 0<=nc<cols and matrix[nr][nc]>matrix[r][c]:
                best = max(best, 1 + dfs(nr, nc))
        return best

    return max(dfs(r,c) for r in range(rows) for c in range(cols))

# Tarjan's bridges
def find_bridges(n, edges):
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v); graph[v].append(u)
    disc = [-1]*n; low = [-1]*n
    timer = [0]; bridges = []

    def dfs(u, parent):
        disc[u] = low[u] = timer[0]; timer[0] += 1
        for v in graph[u]:
            if disc[v] == -1:
                dfs(v, u)
                low[u] = min(low[u], low[v])
                if low[v] > disc[u]:   # bridge condition
                    bridges.append((u, v))
            elif v != parent:
                low[u] = min(low[u], disc[v])

    for i in range(n):
        if disc[i] == -1: dfs(i, -1)
    return bridges`,
            typescript: `// Reconstruct Itinerary (Eulerian path via DFS)
function findItinerary(tickets: string[][]): string[] {
  const graph: Record<string, string[]> = {};
  for (const [from, to] of tickets) {
    if (!graph[from]) graph[from] = [];
    graph[from].push(to);
  }
  for (const k of Object.keys(graph)) graph[k].sort();
  const result: string[] = [];
  function dfs(airport: string) {
    while (graph[airport]?.length)
      dfs(graph[airport].shift()!);
    result.unshift(airport);
  }
  dfs("JFK");
  return result;
}`,
        },
    },
];

const PROJECTS = [
    {
        level: 'Beginner',
        color: '#22c55e',
        items: [
            {
                name: 'File System Tree Viewer',
                desc: 'Recursively list directories and files. Display as indented tree. Color-code by type.',
                stack: 'Python',
            },
            {
                name: 'JSON Deep Inspector',
                desc: 'Walk any JSON object with DFS and extract all leaf key-value pairs.',
                stack: 'TypeScript',
            },
        ],
    },
    {
        level: 'Intermediate',
        color: '#eab308',
        items: [
            {
                name: 'Maze Generator & Solver',
                desc: 'Generate a random maze with DFS (randomized DFS). Solve it with DFS + backtracking. Visualize step-by-step.',
                stack: 'Python / TS',
            },
            {
                name: 'Paint Bucket Tool',
                desc: 'Implement flood fill on a canvas grid. Click a cell, spread color to connected same-color cells.',
                stack: 'TypeScript (Canvas)',
            },
            {
                name: 'Dependency Resolver CLI',
                desc: 'Read a package.json-like file. Build a dependency graph. Detect circular deps, output install order via topo sort.',
                stack: 'Python',
            },
        ],
    },
    {
        level: 'Advanced',
        color: '#ef4444',
        items: [
            {
                name: 'Sudoku Solver App',
                desc: 'Input any Sudoku board. Use backtracking DFS to solve. Show solving animation with step count.',
                stack: 'TypeScript (React)',
            },
            {
                name: 'Network Vulnerability Scanner',
                desc: "Input a network graph. Find all bridges and articulation points (Tarjan's). Highlight critical infrastructure.",
                stack: 'Python',
            },
            {
                name: 'Codebase Import Analyzer',
                desc: 'Parse Python/TS files. Build import graph. Detect cycles, find strongly connected components, suggest refactors.',
                stack: 'Python',
            },
        ],
    },
    {
        level: 'Expert',
        color: '#a855f7',
        items: [
            {
                name: 'Mini Compiler / AST Walker',
                desc: 'Parse a simple expression language into an AST. Walk it with DFS for evaluation, type checking, and code generation.',
                stack: 'TypeScript',
            },
            {
                name: 'Flight Itinerary Planner',
                desc: 'Given flights as edges, find a valid itinerary using all flights exactly once (Eulerian path). Handle dead-ends via DFS backtracking.',
                stack: 'Python / TS',
            },
        ],
    },
];

const MENTAL_MODELS = [
    {
        icon: '🌲',
        title: 'Pre-order',
        desc: 'Process node BEFORE children. Use for: copying a tree, printing hierarchy, serialization.',
    },
    {
        icon: '📬',
        title: 'Post-order',
        desc: 'Process node AFTER children. Use for: deleting a tree, computing height/size, dependency resolution.',
    },
    {
        icon: '🎨',
        title: 'Gray node = in stack',
        desc: 'In directed graphs, seeing a GRAY node during DFS means you found a back edge → cycle.',
    },
    {
        icon: '↩️',
        title: 'Backtrack = undo',
        desc: 'After exploring a choice, always undo it. The power is in the symmetry: choose → explore → un-choose.',
    },
    {
        icon: '💾',
        title: 'Memo = avoid re-DFS',
        desc: 'If DFS revisits the same (node, state), cache it. Turns exponential into polynomial.',
    },
    {
        icon: '🌉',
        title: 'low[v] > disc[u]',
        desc: "In Tarjan's: if the subtree rooted at v can't reach back past u, then edge u-v is a bridge.",
    },
];

export default function DFSGuide() {
    const [activeLevel, setActiveLevel] = useState('l1');
    const [tab, setTab] = useState<Tab>('concepts');
    const [lang, setLang] = useState<Language>('python');
    const [view, setView] = useState<View>('levels'); // levels | projects | models

    const level = LEVELS.find((l) => l.id === activeLevel) ?? LEVELS[0];

    const tabStyle = (t: Tab) => ({
        padding: '6px 14px',
        borderRadius: 6,
        border: 'none',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: 13,
        background: tab === t ? level.color : '#1f2937',
        color: tab === t ? '#000' : '#9ca3af',
        transition: 'all 0.15s',
    });

    const navStyle = (v: View) => ({
        padding: '8px 18px',
        borderRadius: 8,
        border: 'none',
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: 13,
        background: view === v ? '#3b82f6' : '#1f2937',
        color: view === v ? '#fff' : '#9ca3af',
    });

    return (
        <div
            style={{
                background: '#0a0f1a',
                color: '#e5e7eb',
                fontFamily: "'Inter', system-ui, sans-serif",
                minHeight: '100vh',
                padding: 0,
            }}
        >
            {/* Header */}
            <div
                style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                    padding: '28px 24px 20px',
                    borderBottom: '1px solid #1e2a3a',
                }}
            >
                <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>
                    <span style={{ color: '#60a5fa' }}>DFS</span> Mastery Guide
                </div>
                <div style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                    Depth-First Search · Easy → Expert · Python & TypeScript
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                    {(['levels', 'projects', 'models'] as const).map((v) => (
                        <button key={v} style={navStyle(v)} onClick={() => setView(v)}>
                            {v === 'levels' ? '📚 Levels' : v === 'projects' ? '🚀 Projects' : '🧠 Mental Models'}
                        </button>
                    ))}
                </div>
            </div>

            {view === 'levels' && (
                <div style={{ display: 'flex', height: 'calc(100vh - 140px)' }}>
                    {/* Sidebar */}
                    <div
                        style={{
                            width: 160,
                            background: '#070d18',
                            borderRight: '1px solid #1e2a3a',
                            padding: '12px 8px',
                            flexShrink: 0,
                            overflowY: 'auto',
                        }}
                    >
                        {LEVELS.map((l) => (
                            <button
                                key={l.id}
                                onClick={() => {
                                    setActiveLevel(l.id);
                                    setTab('concepts');
                                }}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '10px 10px',
                                    marginBottom: 4,
                                    borderRadius: 8,
                                    border: `1px solid ${activeLevel === l.id ? l.border : 'transparent'}`,
                                    background: activeLevel === l.id ? l.bg : 'transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <div style={{ fontSize: 16 }}>{l.emoji}</div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: l.color, marginTop: 2 }}>
                                    {l.label}
                                </div>
                                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 1, lineHeight: 1.3 }}>
                                    {l.title}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Main */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 28 }}>{level.emoji}</span>
                                <div>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: level.color }}>
                                        {level.title}
                                    </div>
                                    <div style={{ color: '#6b7280', fontSize: 13 }}>{level.subtitle}</div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                            {(['concepts', 'exercises', 'problems', 'code', 'practical'] as const).map((t) => (
                                <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div
                            style={{
                                background: '#0f172a',
                                borderRadius: 12,
                                border: `1px solid ${level.border}22`,
                                padding: 20,
                            }}
                        >
                            {tab === 'concepts' && (
                                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                                    {level.concepts.map((c, i) => (
                                        <li
                                            key={i}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 10,
                                                padding: '10px 0',
                                                borderBottom:
                                                    i < level.concepts.length - 1 ? '1px solid #1e2a3a' : 'none',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: level.color,
                                                    fontWeight: 700,
                                                    fontSize: 16,
                                                    marginTop: 1,
                                                }}
                                            >
                                                ◆
                                            </span>
                                            <span style={{ fontSize: 14, lineHeight: 1.6 }}>{c}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {tab === 'exercises' && (
                                <div>
                                    <div style={{ color: '#64748b', fontSize: 12, marginBottom: 14, fontWeight: 600 }}>
                                        IMPLEMENT THESE YOURSELF BEFORE LOOKING UP SOLUTIONS
                                    </div>
                                    {level.exercises.map((e, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                display: 'flex',
                                                gap: 12,
                                                padding: '12px 0',
                                                borderBottom:
                                                    i < level.exercises.length - 1 ? '1px solid #1e2a3a' : 'none',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: '50%',
                                                    background: level.bg,
                                                    border: `2px solid ${level.border}`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 800,
                                                    fontSize: 12,
                                                    color: level.color,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {i + 1}
                                            </div>
                                            <span style={{ fontSize: 14 }}>{e}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {tab === 'problems' && (
                                <div>
                                    <div style={{ color: '#64748b', fontSize: 12, marginBottom: 14, fontWeight: 600 }}>
                                        LEETCODE PROBLEMS
                                    </div>
                                    {level.problems.map((p, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '12px 0',
                                                borderBottom:
                                                    i < level.problems.length - 1 ? '1px solid #1e2a3a' : 'none',
                                            }}
                                        >
                                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                                <span style={{ color: '#64748b', fontSize: 12, width: 24 }}>
                                                    #{p.lc}
                                                </span>
                                                <span style={{ fontSize: 14 }}>{p.name}</span>
                                            </div>
                                            <span
                                                style={{
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    padding: '3px 10px',
                                                    borderRadius: 20,
                                                    background:
                                                        p.diff === 'Easy'
                                                            ? '#052e16'
                                                            : p.diff === 'Medium'
                                                              ? '#1c1400'
                                                              : '#1c0000',
                                                    color:
                                                        p.diff === 'Easy'
                                                            ? '#22c55e'
                                                            : p.diff === 'Medium'
                                                              ? '#eab308'
                                                              : '#ef4444',
                                                    border: `1px solid ${p.diff === 'Easy' ? '#16a34a' : p.diff === 'Medium' ? '#ca8a04' : '#dc2626'}`,
                                                }}
                                            >
                                                {p.diff}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {tab === 'code' && (
                                <div>
                                    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                                        {(['python', 'typescript'] as const).map((l) => (
                                            <button
                                                key={l}
                                                onClick={() => setLang(l)}
                                                style={{
                                                    padding: '5px 14px',
                                                    borderRadius: 6,
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    background: lang === l ? level.color : '#1e2a3a',
                                                    color: lang === l ? '#000' : '#9ca3af',
                                                    fontWeight: 700,
                                                    fontSize: 12,
                                                }}
                                            >
                                                {l === 'python' ? '🐍 Python' : '🔷 TypeScript'}
                                            </button>
                                        ))}
                                    </div>
                                    <pre
                                        style={{
                                            background: '#020712',
                                            borderRadius: 10,
                                            padding: 18,
                                            fontSize: 12.5,
                                            lineHeight: 1.7,
                                            overflowX: 'auto',
                                            color: '#a5f3fc',
                                            margin: 0,
                                            fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                                            border: '1px solid #1e2a3a',
                                        }}
                                    >
                                        <code>{level.code[lang]}</code>
                                    </pre>
                                </div>
                            )}

                            {tab === 'practical' && (
                                <div>
                                    <div style={{ color: '#64748b', fontSize: 12, marginBottom: 14, fontWeight: 600 }}>
                                        REAL-WORLD APPLICATIONS
                                    </div>
                                    {level.practical.map((p, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                display: 'flex',
                                                gap: 12,
                                                padding: '12px 0',
                                                borderBottom:
                                                    i < level.practical.length - 1 ? '1px solid #1e2a3a' : 'none',
                                            }}
                                        >
                                            <span style={{ color: level.color, fontSize: 18 }}>⚡</span>
                                            <span style={{ fontSize: 14, lineHeight: 1.6 }}>{p}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {view === 'projects' && (
                <div style={{ padding: '24px', overflowY: 'auto', maxHeight: 'calc(100vh - 140px)' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>🚀 Project Ideas</div>
                    <div style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>
                        Build these to solidify your DFS intuition end-to-end.
                    </div>
                    {PROJECTS.map((group, gi) => (
                        <div key={gi} style={{ marginBottom: 32 }}>
                            <div
                                style={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: group.color,
                                    marginBottom: 12,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                }}
                            >
                                <span
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        background: group.color,
                                        display: 'inline-block',
                                    }}
                                ></span>
                                {group.level}
                            </div>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                    gap: 14,
                                }}
                            >
                                {group.items.map((p, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            background: '#0f172a',
                                            borderRadius: 12,
                                            border: `1px solid #1e2a3a`,
                                            padding: '16px 18px',
                                        }}
                                    >
                                        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{p.name}</div>
                                        <div
                                            style={{
                                                fontSize: 13,
                                                color: '#9ca3af',
                                                lineHeight: 1.6,
                                                marginBottom: 10,
                                            }}
                                        >
                                            {p.desc}
                                        </div>
                                        <span
                                            style={{
                                                fontSize: 11,
                                                background: '#1e2a3a',
                                                padding: '3px 10px',
                                                borderRadius: 20,
                                                color: '#60a5fa',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {p.stack}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {view === 'models' && (
                <div style={{ padding: '24px', overflowY: 'auto', maxHeight: 'calc(100vh - 140px)' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>🧠 Mental Models</div>
                    <div style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>
                        Internalize these and DFS problems become intuitive.
                    </div>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: 16,
                        }}
                    >
                        {MENTAL_MODELS.map((m, i) => (
                            <div
                                key={i}
                                style={{
                                    background: '#0f172a',
                                    borderRadius: 14,
                                    border: '1px solid #1e2a3a',
                                    padding: '20px',
                                }}
                            >
                                <div style={{ fontSize: 32, marginBottom: 10 }}>{m.icon}</div>
                                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 8, color: '#e2e8f0' }}>
                                    {m.title}
                                </div>
                                <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{m.desc}</div>
                            </div>
                        ))}
                    </div>

                    <div
                        style={{
                            marginTop: 32,
                            background: '#0f172a',
                            borderRadius: 14,
                            border: '1px solid #1e2a3a',
                            padding: 24,
                        }}
                    >
                        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>📅 Study Roadmap</div>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                                gap: 12,
                            }}
                        >
                            {[
                                {
                                    week: 'Week 1',
                                    focus: 'Tree DFS + traversals',
                                    problems: '#94, #104, #112, #257',
                                    color: '#22c55e',
                                },
                                {
                                    week: 'Week 2',
                                    focus: 'Grid DFS + islands',
                                    problems: '#200, #695, #733, #417',
                                    color: '#eab308',
                                },
                                {
                                    week: 'Week 3',
                                    focus: 'Backtracking',
                                    problems: '#46, #78, #79, #22, #51',
                                    color: '#f97316',
                                },
                                {
                                    week: 'Week 4',
                                    focus: 'Graph DFS + topo sort',
                                    problems: '#207, #210, #785, #802',
                                    color: '#ef4444',
                                },
                                {
                                    week: 'Week 5',
                                    focus: 'Expert problems',
                                    problems: '#329, #1192, #332, #685',
                                    color: '#a855f7',
                                },
                            ].map((w, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: '#070d18',
                                        borderRadius: 10,
                                        padding: '14px 16px',
                                        borderLeft: `3px solid ${w.color}`,
                                    }}
                                >
                                    <div style={{ fontSize: 12, fontWeight: 700, color: w.color }}>{w.week}</div>
                                    <div style={{ fontSize: 13, fontWeight: 600, margin: '4px 0 6px' }}>{w.focus}</div>
                                    <div style={{ fontSize: 11, color: '#64748b' }}>{w.problems}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
