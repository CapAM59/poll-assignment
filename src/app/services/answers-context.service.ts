import { Injectable, signal } from '@angular/core';
import { Answer } from '../models/answer.model';

export interface CurrentAnswersContext {
    answers: Answer[];
}

@Injectable({ providedIn: 'root' })
export class AnswersContextService {
    private readonly answersUpdatedSignal = signal<number>(0);

    getAnswersUpdated = this.answersUpdatedSignal.asReadonly();

    notifyWhenAnswerAdded(): void {
        this.answersUpdatedSignal.update((current: number) => current + 1);
    }
}
