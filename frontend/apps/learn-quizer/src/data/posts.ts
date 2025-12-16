import type { BlogPost } from '@/types/quiz';

export const posts: BlogPost[] = [
    {
        slug: 'javascript-event-loop',
        title: 'Understanding the JavaScript Event Loop',
        subject: 'JavaScript',
        tags: ['async', 'runtime', 'performance', 'fundamentals'],
        publishedAt: '2024-01-15',
        excerpt: 'A deep dive into how JavaScript handles asynchronous operations through the event loop mechanism.',
        questions: [
            {
                id: 'event-loop-1',
                prompt: 'What problem does the JavaScript event loop solve?',
                answers: [
                    'Single-threaded async execution',
                    'Parallel CPU execution',
                    'Memory management',
                    'Type checking at runtime',
                ],
                correctAnswer: 0,
            },
            {
                id: 'event-loop-2',
                prompt: 'Which queue has higher priority in the event loop?',
                answers: [
                    'Task queue (macrotask)',
                    'Microtask queue',
                    'Both have equal priority',
                    'It depends on the browser',
                ],
                correctAnswer: 1,
            },
            {
                id: 'event-loop-3',
                prompt: 'What is the purpose of the call stack?',
                answers: [
                    'To store global variables',
                    'To track function execution context',
                    'To manage memory allocation',
                    'To schedule timers',
                ],
                correctAnswer: 1,
            },
        ],
        content: `
# Understanding the JavaScript Event Loop

JavaScript is a single-threaded language, yet it handles concurrent operations elegantly through the event loop mechanism. Understanding this is crucial for writing performant, non-blocking code.

## The Problem

Traditional synchronous execution would freeze the UI during long operations. Consider:

\`\`\`javascript
const data = fetchDataSync(); // Blocks for 2 seconds
console.log(data); // Only runs after fetch completes
\`\`\`

## The Solution: Event Loop

The event loop enables asynchronous execution by:

1. **Call Stack**: Executes synchronous code
2. **Web APIs**: Handles async operations (timers, fetch, DOM events)
3. **Task Queue**: Stores callbacks from setTimeout, setInterval
4. **Microtask Queue**: Stores Promise callbacks, queueMicrotask

## Execution Order

\`\`\`javascript
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');

// Output: 1, 4, 3, 2
\`\`\`

The microtask queue (Promises) is processed before the task queue (setTimeout), even with a 0ms delay.

## Practical Implications

- **Never block the main thread**: Use async operations for I/O
- **Understand microtask timing**: Promises resolve before the next event loop tick
- **Use requestAnimationFrame**: For smooth visual updates synced with refresh rate

## Performance Considerations

Long-running synchronous code blocks both the call stack and renders. Split heavy computation using techniques like:

\`\`\`javascript
function processChunk(items, index = 0) {
  const chunk = items.slice(index, index + 100);
  // Process chunk...
  
  if (index + 100 < items.length) {
    setTimeout(() => processChunk(items, index + 100), 0);
  }
}
\`\`\`

This yields control back to the event loop, allowing UI updates between chunks.
    `.trim(),
    },
    {
        slug: 'typescript-generics-patterns',
        title: 'Advanced TypeScript Generic Patterns',
        subject: 'TypeScript',
        tags: ['types', 'generics', 'patterns', 'advanced'],
        publishedAt: '2024-01-22',
        excerpt: 'Master advanced generic patterns to write more reusable and type-safe TypeScript code.',
        questions: [
            {
                id: 'generics-1',
                prompt: 'What is the purpose of the "extends" keyword in a generic constraint?',
                answers: [
                    'To inherit from a class',
                    'To restrict the types that can be passed as a type parameter',
                    'To create a union type',
                    'To make a type optional',
                ],
                correctAnswer: 1,
            },
            {
                id: 'generics-2',
                prompt: 'What does "infer" do in conditional types?',
                answers: [
                    'Automatically generates types from runtime values',
                    'Extracts and introduces a type variable within a conditional type',
                    'Infers the return type of a function',
                    'Validates type compatibility at compile time',
                ],
                correctAnswer: 1,
            },
            {
                id: 'generics-3',
                prompt: 'When would you use a mapped type?',
                answers: [
                    'To convert a union to an intersection',
                    'To create a new type by transforming properties of an existing type',
                    'To map over arrays at runtime',
                    'To create conditional logic in types',
                ],
                correctAnswer: 1,
            },
        ],
        content: `
# Advanced TypeScript Generic Patterns

Generics are TypeScript's mechanism for creating reusable, type-safe components. Beyond basic usage, advanced patterns unlock powerful abstractions.

## Constrained Generics

Use \`extends\` to limit acceptable types:

\`\`\`typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'Alice', age: 30 };
getProperty(user, 'name'); // string
getProperty(user, 'invalid'); // Error!
\`\`\`

## Conditional Types with Infer

Extract types dynamically:

\`\`\`typescript
type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;

type Result = ReturnTypeOf<() => string>; // string
\`\`\`

## Mapped Types

Transform existing types:

\`\`\`typescript
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type Optional<T> = {
  [K in keyof T]?: T[K];
};
\`\`\`

## Template Literal Types

Create types from string patterns:

\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`;
type ClickHandler = EventName<'click'>; // 'onClick'
\`\`\`

## Recursive Types

Handle nested structures:

\`\`\`typescript
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
\`\`\`

## Practical Applications

Use these patterns to build type-safe APIs, form validators, and state management systems that catch errors at compile time.
    `.trim(),
    },
    {
        slug: 'react-rendering-optimization',
        title: 'React Rendering Optimization Strategies',
        subject: 'React',
        tags: ['performance', 'rendering', 'hooks', 'optimization'],
        publishedAt: '2024-02-01',
        excerpt: 'Learn when and how to optimize React rendering for production applications.',
        questions: [
            {
                id: 'react-render-1',
                prompt: 'When does React re-render a component?',
                answers: [
                    'Only when props change',
                    'Only when state changes',
                    'When state, props, or context changes, or parent re-renders',
                    'Only when useEffect dependencies change',
                ],
                correctAnswer: 2,
            },
            {
                id: 'react-render-2',
                prompt: 'What is the primary use case for React.memo?',
                answers: [
                    'Memoizing expensive calculations',
                    "Preventing re-renders when props haven't changed",
                    'Caching API responses',
                    'Optimizing context consumers',
                ],
                correctAnswer: 1,
            },
            {
                id: 'react-render-3',
                prompt: 'When should you use useMemo?',
                answers: [
                    'For all computations in a component',
                    'Only for expensive computations or referential equality',
                    'To prevent all re-renders',
                    'For storing component state',
                ],
                correctAnswer: 1,
            },
        ],
        content: `
# React Rendering Optimization Strategies

Understanding React's rendering behavior is essential for building performant applications. Optimize only when needed, and measure before optimizing.

## When React Re-renders

A component re-renders when:

1. Its state changes
2. Its props change
3. Its parent re-renders
4. A consumed context value changes

## The Render Cycle

\`\`\`
Trigger → Render → Commit → Browser Paint
\`\`\`

React's reconciliation is fast. The bottleneck is usually:
- Expensive render functions
- Many components re-rendering unnecessarily
- Layout thrashing from DOM reads/writes

## Optimization Strategies

### 1. React.memo for Pure Components

\`\`\`jsx
const ExpensiveList = React.memo(({ items }) => {
  return items.map(item => <Item key={item.id} {...item} />);
});
\`\`\`

Only use when:
- Component renders often with same props
- Render is expensive
- Props are primitives or stable references

### 2. useMemo for Expensive Computations

\`\`\`jsx
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.date - b.date);
}, [items]);
\`\`\`

### 3. useCallback for Stable Function References

\`\`\`jsx
const handleClick = useCallback((id) => {
  setSelected(id);
}, []);
\`\`\`

### 4. State Colocation

Move state closer to where it's used:

\`\`\`jsx
// Before: Parent re-renders everything
function Parent() {
  const [filter, setFilter] = useState('');
  return (
    <>
      <SearchInput value={filter} onChange={setFilter} />
      <ExpensiveList />
    </>
  );
}

// After: Only SearchInput re-renders
function Parent() {
  return (
    <>
      <SearchWithState />
      <ExpensiveList />
    </>
  );
}
\`\`\`

## Measuring Performance

Use React DevTools Profiler to identify:
- Components that render frequently
- Long render times
- Unnecessary re-renders

Optimize based on measurements, not assumptions.
    `.trim(),
    },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
    return posts.find((p) => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
    return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
