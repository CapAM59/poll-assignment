import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private readonly userRepository: UserRepository) { }

  async create(input: Omit<User, 'id'>): Promise<number> {
    return this.userRepository.create(input);
  }

  async getAll(): Promise<User[]> {
    return this.userRepository.getAll();
  }

  async getById(id: number): Promise<User | undefined> {
    return this.userRepository.getById(id);
  }

  async update(user: User): Promise<number> {
    return this.userRepository.update(user);
  }

  async delete(id: number): Promise<void> {
    return this.userRepository.delete(id);
  }
}
