import { Injectable, signal } from '@angular/core';
import { Poll } from '../models/poll.model';
import { Question } from '../models/question.model';

export interface CurrentPollContext {
  poll: Poll;
  questions: Question[];
}

@Injectable({ providedIn: 'root' })
export class PollContextService {
  private readonly currentPollSignal = signal<CurrentPollContext | undefined>(undefined);

  getCurrentPoll = this.currentPollSignal.asReadonly();

  setCurrentPoll(context: CurrentPollContext): void {
    this.currentPollSignal.set(context);
  }

  clearCurrentPoll(): void {
    this.currentPollSignal.set(undefined);
  }
}



