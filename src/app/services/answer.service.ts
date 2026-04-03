import { Injectable } from '@angular/core';
import { Answer } from '../models/answer.model';
import { AnswerRepository } from '../repositories/answer.repository';

@Injectable({ providedIn: 'root' })
export class AnswerService {

  constructor(private readonly answerRepository: AnswerRepository) { }

  async create(input: Omit<Answer, 'id'>): Promise<number> {
    return this.answerRepository.create(input);
  }

  async getAll(): Promise<Answer[]> {
    return this.answerRepository.getAll();
  }

  async getById(id: number): Promise<Answer | undefined> {
    return this.answerRepository.getById(id);
  }

  async getAllByQuestionId(questionId: number): Promise<Answer[]> {
    return this.answerRepository.getAllByQuestionId(questionId);
  }

  async getAllByUserId(userId: number): Promise<Answer[]> {
    return this.answerRepository.getAllByUserId(userId);
  }

  async update(answer: Answer): Promise<number> {
    return this.answerRepository.update(answer);
  }

  async delete(id: number): Promise<void> {
    return this.answerRepository.delete(id);
  }
}
