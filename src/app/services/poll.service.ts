import { Injectable } from '@angular/core';
import { Poll } from '../models/poll.model';
import { PollRepository } from '../repositories/poll.repository';

@Injectable({ providedIn: 'root' })
export class PollService {

  constructor(private readonly pollRepository: PollRepository) { }

  async create(input: Omit<Poll, 'id'>): Promise<number> {
    return this.pollRepository.create(input);
  }

  async getAll(): Promise<Poll[]> {
    return this.pollRepository.getAll();
  }

  async getById(id: number): Promise<Poll | undefined> {
    return this.pollRepository.getById(id);
  }

  async getAllByUserId(userId: number): Promise<Poll[]> {
    return this.pollRepository.getAllByUserId(userId);
  }

  async update(poll: Poll): Promise<number> {
    return this.pollRepository.update(poll);
  }

  async delete(id: number): Promise<void> {
    return this.pollRepository.delete(id);
  }
}
