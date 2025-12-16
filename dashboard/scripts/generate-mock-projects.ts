import { writeFileSync } from 'fs';
import { join } from 'path';

type ProjectCategory =
    | 'Web App'
    | 'API'
    | 'Mobile'
    | 'CLI Tool'
    | 'Library'
    | 'DevOps'
    | 'AI/ML'
    | 'Blockchain'
    | 'Game'
    | 'Other';

interface Project {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    category: ProjectCategory;
    techStack: string[];
    images: string[];
    sourceUrl?: string;
    demoUrl?: string;
    docsUrl?: string;
    featured: boolean;
    createdAt: string;
    tags: string[];
}

const categories: ProjectCategory[] = [
    'Web App',
    'API',
    'Mobile',
    'CLI Tool',
    'Library',
    'DevOps',
    'AI/ML',
    'Blockchain',
    'Game',
    'Other',
];

const techStacks = [
    ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
    ['Python', 'FastAPI', 'SQLAlchemy', 'Docker'],
    ['Go', 'Gin', 'MongoDB', 'Kubernetes'],
    ['Rust', 'Actix', 'SQLite', 'WebAssembly'],
    ['Vue.js', 'Nuxt', 'Prisma', 'GraphQL'],
    ['Next.js', 'tRPC', 'Supabase', 'Vercel'],
    ['Django', 'Celery', 'RabbitMQ', 'AWS'],
    ['Spring Boot', 'Kafka', 'Elasticsearch', 'Jenkins'],
    ['Flutter', 'Dart', 'Firebase', 'Riverpod'],
];

const projectNames = [
    'CloudSync Pro',
    'DevMetrics',
    'CodeVault',
    'DataPipeline',
    'APIForge',
    'LogStream',
    'TaskFlow',
    'GitInsights',
    'DeployHub',
    'MonitorX',
    'SecureAuth',
    'CacheLayer',
    'QueueMaster',
    'SearchIndex',
    'FileProcessor',
    'WebCrawler',
    'ChatEngine',
    'NotifyService',
    'PaymentGateway',
    'AnalyticsDash',
    'MLPipeline',
    'DataLake',
    'EventBroker',
    'ConfigManager',
    'ServiceMesh',
    'LoadBalancer',
    'CDNManager',
    'SSLCert',
    'DNSResolver',
    'ProxyServer',
    'ContainerOrch',
    'SecretVault',
    'AuditLog',
    'RateLimiter',
    'CircuitBreaker',
    'FeatureFlags',
    'ABTesting',
    'UserSegment',
    'RecommendEngine',
    'FraudDetect',
    'SentimentAnalyzer',
    'ImageProcessor',
    'VideoTranscoder',
    'AudioStreamer',
    'DocConverter',
    'PDFGenerator',
    'EmailTemplates',
    'SMSGateway',
    'PushNotify',
    'WebhookHandler',
    'GraphQLServer',
    'RESTBuilder',
    'SocketManager',
    'RPCFramework',
    'MessageQueue',
    'BatchProcessor',
    'CronScheduler',
    'WorkflowEngine',
    'RuleEngine',
    'DecisionTree',
];

const descriptions = [
    'A comprehensive solution for managing cloud infrastructure with real-time monitoring, automated scaling, and cost optimization features.',
    'Enterprise-grade analytics platform that provides deep insights into application performance, user behavior, and system health.',
    'Secure version control system with advanced branching strategies, code review workflows, and CI/CD integration.',
    'High-performance data processing pipeline supporting batch and stream processing with fault tolerance.',
    'API development toolkit with automatic documentation, testing, and monitoring capabilities.',
    'Centralized logging solution with powerful search, filtering, and alerting mechanisms.',
    'Project management tool with kanban boards, sprint planning, and team collaboration features.',
    'Git repository analytics providing insights into code quality, contributor statistics, and merge patterns.',
    'Automated deployment platform supporting multiple environments, rollback capabilities, and deployment strategies.',
    'Infrastructure monitoring system with customizable dashboards, anomaly detection, and incident management.',
];

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateProject(index: number): Project {
    const name = getRandomElement(projectNames);
    const category = getRandomElement(categories);
    const techStack = getRandomElement(techStacks);
    const description = getRandomElement(descriptions);

    const slug = name.toLowerCase().replace(/\s+/g, '-') + `-${index}`;

    return {
        id: `proj-${index.toString().padStart(3, '0')}`,
        name: `${name} ${index}`,
        slug,
        description,
        shortDescription: description.substring(0, 100) + '...',
        category,
        techStack,
        images: [
            `https://picsum.photos/seed/${slug}-1/800/600`,
            `https://picsum.photos/seed/${slug}-2/800/600`,
            `https://picsum.photos/seed/${slug}-3/800/600`,
        ],
        sourceUrl: Math.random() > 0.2 ? `https://github.com/example/${slug}` : undefined,
        demoUrl: Math.random() > 0.3 ? `https://${slug}.example.com` : undefined,
        docsUrl: Math.random() > 0.4 ? `https://docs.example.com/${slug}` : undefined,
        featured: Math.random() > 0.9,
        createdAt: new Date(
            2023 + Math.floor(Math.random() * 2),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
        ).toISOString(),
        tags: techStack.slice(0, 2).concat(category),
    };
}

// Generate projects
const numberOfProjects = parseInt(process.argv[2]) || 100;
const projects: Project[] = Array.from({ length: numberOfProjects }, (_, i) => generateProject(i));

// Write to JSON file
const outputPath = join(process.cwd(), 'src', 'data', 'projects.json');
writeFileSync(outputPath, JSON.stringify(projects, null, 2), 'utf-8');

console.log(`✅ Successfully generated ${numberOfProjects} projects!`);
console.log(`📁 Output file: ${outputPath}`);
console.log(`\nProject statistics:`);
console.log(`- Total projects: ${projects.length}`);
console.log(`- Featured projects: ${projects.filter((p) => p.featured).length}`);
console.log(`- Projects with source: ${projects.filter((p) => p.sourceUrl).length}`);
console.log(`- Projects with demo: ${projects.filter((p) => p.demoUrl).length}`);
console.log(`- Projects with docs: ${projects.filter((p) => p.docsUrl).length}`);

// Category breakdown
const categoryBreakdown: Record<string, number> = {};
projects.forEach((p) => {
    categoryBreakdown[p.category] = (categoryBreakdown[p.category] || 0) + 1;
});
console.log(`\nCategory breakdown:`);
Object.entries(categoryBreakdown).forEach(([category, count]) => {
    console.log(`- ${category}: ${count}`);
});
