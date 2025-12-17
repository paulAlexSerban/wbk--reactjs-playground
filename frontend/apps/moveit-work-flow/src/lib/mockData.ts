import { Board, Task, Member, BoardStatus } from '@/types';

const defaultStatuses: BoardStatus[] = [
  { id: 'backlog', name: 'Backlog', color: 'slate', order: 0 },
  { id: 'todo', name: 'To Do', color: 'amber', order: 1 },
  { id: 'in_progress', name: 'In Progress', color: 'blue', order: 2 },
  { id: 'review', name: 'Review', color: 'purple', order: 3 },
  { id: 'done', name: 'Done', color: 'green', order: 4 },
];

export const mockBoards: Board[] = [
  {
    id: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    name: 'Protocol Development',
    description: 'Core smart contract development and auditing for the MoveIt protocol on Sui blockchain.',
    owner: '0x7890abcdef1234567890abcdef1234567890abcd',
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    memberCount: 5,
    taskCount: 12,
    statuses: defaultStatuses,
  },
  {
    id: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234',
    name: 'Frontend MVP',
    description: 'Building the decentralized frontend for task management with wallet integration.',
    owner: '0x7890abcdef1234567890abcdef1234567890abcd',
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    memberCount: 3,
    taskCount: 8,
    statuses: [
      { id: 'todo', name: 'To Do', color: 'slate', order: 0 },
      { id: 'doing', name: 'Doing', color: 'cyan', order: 1 },
      { id: 'done', name: 'Done', color: 'green', order: 2 },
    ],
  },
  {
    id: '0x3c4d5e6f7890abcdef1234567890abcdef123456',
    name: 'Documentation',
    description: 'Technical documentation, API references, and user guides for the platform.',
    owner: '0x7890abcdef1234567890abcdef1234567890abcd',
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    memberCount: 2,
    taskCount: 5,
    statuses: defaultStatuses,
  },
];

export const mockTasks: Task[] = [
  {
    id: '0xtask001',
    boardId: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    title: 'Implement Board creation smart contract',
    description: 'Write Move code for creating boards with ownership and member management.',
    assignee: '0x7890abcdef1234567890abcdef1234567890abcd',
    statusId: 'done',
    dueDate: Date.now() - 2 * 24 * 60 * 60 * 1000,
    effortHours: 8,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    createdBy: '0x7890abcdef1234567890abcdef1234567890abcd',
  },
  {
    id: '0xtask002',
    boardId: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    title: 'Add capability-based access control',
    description: 'Implement AdminCap and ContributorCap for permission management.',
    assignee: '0xabcdef1234567890abcdef1234567890abcdef12',
    statusId: 'in_progress',
    dueDate: Date.now() + 1 * 24 * 60 * 60 * 1000,
    effortHours: 12,
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 60 * 60 * 1000,
    createdBy: '0x7890abcdef1234567890abcdef1234567890abcd',
  },
  {
    id: '0xtask003',
    boardId: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    title: 'Write unit tests for task module',
    description: 'Comprehensive test coverage for all task operations.',
    assignee: null,
    statusId: 'todo',
    dueDate: Date.now() + 3 * 24 * 60 * 60 * 1000,
    effortHours: 6,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    createdBy: '0x7890abcdef1234567890abcdef1234567890abcd',
  },
  {
    id: '0xtask004',
    boardId: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    title: 'Security audit preparation',
    description: 'Prepare documentation and codebase for external security audit.',
    assignee: '0x7890abcdef1234567890abcdef1234567890abcd',
    statusId: 'backlog',
    dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
    effortHours: 16,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    createdBy: '0x7890abcdef1234567890abcdef1234567890abcd',
  },
  {
    id: '0xtask005',
    boardId: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    title: 'Code review for authentication module',
    description: 'Review the wallet authentication and session management code.',
    assignee: '0xabcdef1234567890abcdef1234567890abcdef12',
    statusId: 'review',
    dueDate: Date.now() + 2 * 24 * 60 * 60 * 1000,
    effortHours: 4,
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    createdBy: '0x7890abcdef1234567890abcdef1234567890abcd',
  },
];

export const mockMembers: Member[] = [
  {
    address: '0x7890abcdef1234567890abcdef1234567890abcd',
    role: 'admin',
    joinedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    role: 'contributor',
    joinedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    role: 'contributor',
    joinedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
];

export const truncateAddress = (address: string, chars = 6): string => {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

export const formatDate = (timestamp: number | null): string => {
  if (!timestamp) return 'No due date';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const isOverdue = (timestamp: number | null): boolean => {
  if (!timestamp) return false;
  return timestamp < Date.now();
};

export const statusColorMap: Record<string, string> = {
  slate: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  green: 'bg-green-500/20 text-green-300 border-green-500/30',
  amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  red: 'bg-red-500/20 text-red-300 border-red-500/30',
  purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
};

export const statusHeaderColorMap: Record<string, string> = {
  slate: 'border-slate-500/50',
  blue: 'border-blue-500/50',
  green: 'border-green-500/50',
  amber: 'border-amber-500/50',
  red: 'border-red-500/50',
  purple: 'border-purple-500/50',
  cyan: 'border-cyan-500/50',
};
