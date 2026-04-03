import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { dbPromise } from "../db/app.db";

@Injectable({ providedIn: 'root' })
export class UserRepository {

    async create(input: Omit<User, 'id'>): Promise<number> {
        const db = await dbPromise;
        // Store has autoIncrement, so we add without explicit id.
        const key = await db.add('user', input as User);
        return key;
    }

    async getAll(): Promise<User[]> {
        const db = await dbPromise;
        return db.getAll('user');
    }

    async getById(id: number): Promise<User | undefined> {
        const db = await dbPromise;
        return db.get('user', id);
    }

    async update(user: User): Promise<number> {
        const db = await dbPromise;
        const key = await db.put('user', user);
        return key;
    }

    async delete(id: number): Promise<void> {
        const db = await dbPromise;
        await db.delete('user', id);
    }
}