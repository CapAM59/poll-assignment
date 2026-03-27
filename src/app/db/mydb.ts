import { DBSchema } from 'idb';

export interface MyDB extends DBSchema {
    // Role table
    role: {
        key: number;
        value: { id: number; label: string; };
    };

    // User table
    user: {
        key: number;
        value: { id: number; name: string; roleId: number };
        indexes: { roleId: number };
    };

    // Poll table
    poll: {
        key: number;
        value: { id: number; title: string; userId: number };
        indexes: { userId: number };
    };

    // Question table
    question: {
        key: number;
        value: { id: number; title: string; pollId: number };
        indexes: { pollId: number };
    };

    // Answer table
    answer: {
        key: number;
        value: { id: number; vote: boolean; timestamp: Date; questionId: number; userId: number };
        indexes: { questionId: number; userId: number };
    };
}