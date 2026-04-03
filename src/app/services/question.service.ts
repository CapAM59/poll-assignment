import { Injectable } from '@angular/core';
import { Question } from '../models/question.model';
import { QuestionRepository } from '../repositories/question.repository';

@Injectable({ providedIn: 'root' })
export class QuestionService {

  constructor(private readonly questionRepository: QuestionRepository) { }

  async create(input: Omit<Question, 'id'>): Promise<number> {
    return this.questionRepository.create(input);
  }

  async getAll(): Promise<Question[]> {
    return this.questionRepository.getAll();
  }

  async getById(id: number): Promise<Question | undefined> {
    return this.questionRepository.getById(id);
  }

  async getAllByPollId(pollId: number): Promise<Question[]> {
    return this.questionRepository.getAllByPollId(pollId);
  }

  async update(question: Question): Promise<number> {
    return this.questionRepository.update(question);
  }

  async delete(id: number): Promise<void> {
    return this.questionRepository.delete(id);
  }
}
