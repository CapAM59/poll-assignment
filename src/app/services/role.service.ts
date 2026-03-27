import { Injectable } from '@angular/core';
import { Role } from '../models/role.model';
import { RoleRepository } from '../repositories/role.repository';

@Injectable({ providedIn: 'root' })
export class RoleService {

  constructor(private readonly roleRepository: RoleRepository) { }

  async create(input: Omit<Role, 'id'>): Promise<number> {
    return this.roleRepository.create(input);
  }

  async getAll(): Promise<Role[]> {
    return this.roleRepository.getAll();
  }

  async getById(id: number): Promise<Role | undefined> {
    return this.roleRepository.getById(id);
  }

  async update(role: Role): Promise<number> {
    return this.roleRepository.update(role);
  }

  async delete(id: number): Promise<void> {
    return this.roleRepository.delete(id);
  }
}
