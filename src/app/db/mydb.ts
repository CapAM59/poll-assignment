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
        value: { id: number; name: string; roleid: number };
        indexes: { roleid: number };
    };
    
    // Poll table
    poll: {
        key: number;
        value: { id: number; title: string; userid: number };
        indexes: { userid: number };
    };

    // Question table
    question: {
        key: number;
        value: { id: number; title: string; pollid: number };
        indexes: { pollid: number };
    };

    // Answer table
    answer: {
        key: number;
        value: { id: number; vote: boolean; timestamp: Date; questionid: number; userid: number };
        indexes: { questionid: number; userid: number };
    };
}