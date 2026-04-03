import { Injectable } from "@angular/core";
import { Poll } from "../models/poll.model";
import { dbPromise } from "../db/app.db";

@Injectable({ providedIn: 'root' })
export class PollRepository {

    async create(input: Omit<Poll, 'id'>): Promise<number> {
        const db = await dbPromise;
        // Store has autoIncrement, so we add without explicit id.
        const key = await db.add('poll', input as Poll);
        return key;
    }

    async getAll(): Promise<Poll[]> {
        const db = await dbPromise;
        return db.getAll('poll');
    }

    async getById(id: number): Promise<Poll | undefined> {
        const db = await dbPromise;
        return db.get('poll', id);
    }

    async getAllByUserId(userId: number): Promise<Poll[]> {
        const db = await dbPromise;
        return db.getAllFromIndex('poll', 'userId', userId);
    }

    async update(poll: Poll): Promise<number> {
        const db = await dbPromise;
        const key = await db.put('poll', poll);
        return key;
    }

    async delete(id: number): Promise<void> {
        const db = await dbPromise;
        await db.delete('poll', id);
    }
}