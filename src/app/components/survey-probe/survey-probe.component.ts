import { Component, effect, inject, Injector, OnInit, Signal } from '@angular/core';
import { Toast } from "primeng/toast";
import { Card } from "primeng/card";
import { ButtonModule } from 'primeng/button';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CurrentPollContext, PollContextService } from '../../services/poll-context.service';
import { AnswerRepository } from '../../repositories/answer.repository';
import { MessageService } from 'primeng/api';
import { Answer } from '../../models/answer.model';
import { Question } from '../../models/question.model';

const MIN_ANSWERS_REQUIRED = 1;

function minAnswersValidator(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const filledAnswersCount = (control as FormArray).controls.reduce((count, control) => {
      return count + (control.get('vote')?.value ? 1 : 0);
    }, 0);

    return filledAnswersCount >= min ? null : { minAnswers: { required: min, actual: filledAnswersCount } };
  }
}

@Component({
  selector: 'app-survey-probe',
  imports: [ReactiveFormsModule, Toast, Card, ButtonModule],
  templateUrl: './survey-probe.component.html',
  styleUrl: './survey-probe.component.scss'
})
export class SurveyProbeComponent implements OnInit {
  surveyProbeForm: FormGroup = new FormGroup({});
  private readonly injector = inject(Injector);
  private readonly currentUserId: number = 0;
  readonly MIN_ANSWERS_REQUIRED = MIN_ANSWERS_REQUIRED;
  readonly minAnswersValidator = minAnswersValidator(MIN_ANSWERS_REQUIRED);
  readonly currentPollContext: Signal<CurrentPollContext | undefined>;

  get answers(): FormArray {
    return this.surveyProbeForm.get('answers') as FormArray;
  }

  get canSave(): boolean {
    return this.surveyProbeForm.valid;
  }

  get hasActivePoll(): boolean {
    const context = this.currentPollContext();
    return !!context?.poll && this.answers.length > 0;
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly pollContextService: PollContextService,
    private readonly messageService: MessageService,
    private readonly answerRepository: AnswerRepository) {
    this.currentPollContext = this.pollContextService.getCurrentPollContext;
    this.surveyProbeForm = this.formBuilder.group({
      pollId: [null],
      answers: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.loadCurrentPoll();
  }

  private loadCurrentPoll() {
    effect(() => {
      const context = this.currentPollContext();
      const pollId = context?.poll.id ?? undefined;
      const questions = context?.questions ?? [];

      if (context) {
        this.generateAnswersFormGroup(pollId, questions);
      } else {
        this.generateAnswersFormGroup(undefined, []);
      }
    }, { injector: this.injector });
  }

  private generateAnswersFormGroup(pollId: number | undefined, currentQuestions: Question[]) {
    this.surveyProbeForm = this.formBuilder.group({
      pollId: this.patchPollId(pollId),
      answers: this.buildAnswersFormArray(currentQuestions)
    });
  }

  private buildAnswersFormArray(currentQuestions: Question[]): FormArray<FormGroup<any>> {
    return this.formBuilder.array(
      currentQuestions
        .map((question) => this.createAnswerFormGroup(question)) || [],
      {
        validators: [this.minAnswersValidator]
      }
    );
  }

  onVoteChange(selectedIndex: number, event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (!target?.checked) {
      return;
    }

    this.answers.controls.forEach((control, index) => {
      if (index !== selectedIndex) {
        control.get('vote')?.setValue(false, { emitEvent: false });
      }
    });

    this.answers.updateValueAndValidity({ emitEvent: false });
  }

  private createAnswerFormGroup(question: Question): FormGroup {
    return this.formBuilder.group({
      questionId: [question.id],
      questionTitle: [question.title ?? ''],
      vote: [false],
      userId: [this.currentUserId]
    });
  }

  private patchPollId(pollId: number | undefined): number | null {
    return pollId ?? null;
  }

  onSubmit(): void {
    if (this.canSave) {
      this.saveFormAnswers();
    }
  }

  private async saveFormAnswers() {
    await this.createAnswersInRepository();
    this.resetBooleanVotes();
  }

  private async createAnswersInRepository(): Promise<void> {
    const answersFormGroup = this.answers.controls.map(control => control.value);
    const answersToSave = this.mapToAnswer(answersFormGroup);
    try {
      for (const answer of answersToSave) {
        await this.create(answer);
      }
      this.sendMessage('success', 'Answer saved', `Your answer has been saved.`);
    } catch (error) {
      this.sendMessage('error', 'Save failed', `Failed to save your answer. Please try again.`);
      console.log(`Failed to save your answer. Please try again.`, error);
    }
  }

  private resetBooleanVotes(): void {
    this.answers.controls.forEach(control => control.patchValue({ vote: false }, { emitEvent: false }));
  }

  private mapToAnswer(answersFormGroup: any[]): Omit<Answer, 'id'>[] {
    return answersFormGroup.map(control => ({
      questionId: control.questionId,
      vote: control.vote,
      userId: this.currentUserId,
      timestamp: new Date()
    }));
  }

  private async create(answer: Omit<Answer, "id">) {
    await this.answerRepository.create(answer);
  }

  private sendMessage(severity: 'success' | 'error' | 'warn', summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }
}
