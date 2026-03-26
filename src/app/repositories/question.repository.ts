import { Injectable } from "@angular/core";
import { Question } from "../models/question.model";
import { dbPromise } from "../db/app.db";

@Injectable({ providedIn: 'root' })
export class QuestionRepository {

    async create(input: Omit<Question, 'id'>): Promise<number> {
        const db = await dbPromise;
        // Store has autoIncrement, so we add without explicit id.
        const key = await db.add('question', input as Question);
        return key;
    }

    async getAll(): Promise<Question[]> {
        const db = await dbPromise;
        return db.getAll('question');
    }

    async getById(id: number): Promise<Question | undefined> {
        const db = await dbPromise;
        return db.get('question', id);
    }

    async getAllByPollId(pollId: number): Promise<Question[]> {
        const db = await dbPromise;
        return db.getAllFromIndex('question', 'pollId', pollId);
    }

    async update(question: Question): Promise<number> {
        const db = await dbPromise;
        const key = await db.put('question', question);
        return key;
    }

    async delete(id: number): Promise<void> {
        const db = await dbPromise;
        await db.delete('question', id);
    }
}