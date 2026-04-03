import { Injectable } from '@angular/core';
import { Role } from '../models/role.model';
import { dbPromise } from '../db/app.db';

@Injectable({ providedIn: 'root' })
export class RoleRepository {

  async create(input: Omit<Role, 'id'>): Promise<number> {
    const db = await dbPromise;
    // Store has autoIncrement enabled, so we add without explicit id.
    const key = await db.add('role', input as Role);
    return key;
  }

  async getAll(): Promise<Role[]> {
    const db = await dbPromise;
    return db.getAll('role');
  }

  async getById(id: number): Promise<Role | undefined> {
    const db = await dbPromise;
    return db.get('role', id);
  }

  async update(role: Role): Promise<number> {
    const db = await dbPromise;
    const key = await db.put('role', role);
    return key;
  }

  async delete(id: number): Promise<void> {
    const db = await dbPromise;
    await db.delete('role', id);
  }
}
