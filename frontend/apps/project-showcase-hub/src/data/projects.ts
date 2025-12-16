import { Project, ProjectCategory } from '@/types/project';

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

function generateProject(index: number): Project {
    const name = projectNames[index % projectNames.length];
    const categoryIndex = index % categories.length;
    const techStackIndex = index % techStacks.length;
    const descIndex = index % descriptions.length;

    const slug = name.toLowerCase().replace(/\s+/g, '-') + (index > 59 ? `-${index}` : '');

    return {
        id: `proj-${index.toString().padStart(3, '0')}`,
        name: index > 59 ? `${name} ${Math.floor(index / 60) + 1}` : name,
        slug,
        description: descriptions[descIndex],
        shortDescription: descriptions[descIndex].substring(0, 100) + '...',
        category: categories[categoryIndex],
        techStack: techStacks[techStackIndex],
        images: [
            `https://picsum.photos/seed/${slug}-1/800/600`,
            `https://picsum.photos/seed/${slug}-2/800/600`,
            `https://picsum.photos/seed/${slug}-3/800/600`,
        ],
        sourceUrl: Math.random() > 0.2 ? `https://github.com/example/${slug}` : undefined,
        demoUrl: Math.random() > 0.3 ? `https://${slug}.example.com` : undefined,
        docsUrl: Math.random() > 0.4 ? `https://docs.example.com/${slug}` : undefined,
        featured: index < 6,
        createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        tags: techStacks[techStackIndex].slice(0, 2).concat(categories[categoryIndex]),
    };
}

export const projects: Project[] = Array.from({ length: 60 }, (_, i) => generateProject(i));

export const allTechStacks = [...new Set(projects.flatMap((p) => p.techStack))].sort();
export const allCategories = categories;
export const featuredProjects = projects.filter((p) => p.featured);
