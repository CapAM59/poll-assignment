import { Injectable } from "@angular/core";
import { Answer } from "../models/answer.model";
import { dbPromise } from "../db/app.db";

@Injectable({ providedIn: 'root' })
export class AnswerRepository {
    async create(input: Omit<Answer, 'id'>): Promise<number> {
        const db = await dbPromise;
        // Store has autoIncrement, so we add without explicit id.
        const key = await db.add('answer', input as Answer);
        return key;
    }

    async getAll(): Promise<Answer[]> {
        const db = await dbPromise;
        return db.getAll('answer');
    }

    async getById(id: number): Promise<Answer | undefined> {
        const db = await dbPromise;
        return db.get('answer', id);
    }

    async getAllByQuestionId(questionId: number): Promise<Answer[]> {
        const db = await dbPromise;
        return db.getAllFromIndex('answer', 'questionId', questionId);
    }
    async getAllByUserId(userId: number): Promise<Answer[]> {
        const db = await dbPromise;
        return db.getAllFromIndex('answer', 'userId', userId);
    }
    
    async update(answer: Answer): Promise<number> {
        const db = await dbPromise;
        const key = await db.put('answer', answer);
        return key;
    }

    async delete(id: number): Promise<void> {
        const db = await dbPromise;
        await db.delete('answer', id);
    }
}