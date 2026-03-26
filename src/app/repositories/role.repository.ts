import { Injectable } from '@angular/core';
import { dbPromise } from '../db/app.db';
import { Role } from '../models/role.model';

@Injectable({ providedIn: 'root' })
export class RoleRepository {
  async getAll(): Promise<Role[]> {
    const db = await dbPromise;
    return db.getAll('role');
  }

  async getById(id: number): Promise<Role | undefined> {
    const db = await dbPromise;
    return db.get('role', id);
  }

  async create(label: string): Promise<number> {
    const db = await dbPromise;

    // Le store est en autoIncrement, donc on ajoute sans id explicite.
    const key = await db.add('role', { label } as Role);
    return key as number;
  }

  async update(role: Role): Promise<number> {
    const db = await dbPromise;
    const key = await db.put('role', role);
    return key as number;
  }

  async delete(id: number): Promise<void> {
    const db = await dbPromise;
    await db.delete('role', id);
  }
}
