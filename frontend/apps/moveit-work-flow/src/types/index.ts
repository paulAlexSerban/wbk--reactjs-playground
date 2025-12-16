export interface BoardStatus {
    id: string;
    name: string;
    color: 'slate' | 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'cyan';
    order: number;
}

export interface Board {
    id: string;
    name: string;
    description: string;
    owner: string;
    createdAt: number;
    memberCount: number;
    taskCount: number;
    statuses: BoardStatus[];
}

export interface Task {
    id: string;
    boardId: string;
    title: string;
    description: string;
    assignee: string | null;
    statusId: string;
    dueDate: number | null;
    effortHours: number;
    createdAt: number;
    updatedAt: number;
    createdBy: string;
}

export interface Member {
    address: string;
    role: 'admin' | 'contributor';
    joinedAt: number;
}

export interface WalletState {
    isConnected: boolean;
    address: string | null;
    balance: number;
    network: 'testnet' | 'devnet' | 'mainnet';
}

// Legacy enum for backward compatibility
export enum TaskStatus {
    TODO = 0,
    IN_PROGRESS = 1,
    DONE = 2,
}
