import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Question } from '../../models/question.model';
import { Poll } from '../../models/poll.model';
import { PollService } from '../../services/poll.service';
import { QuestionRepository } from '../../repositories/question.repository';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PollContextService } from '../../services/poll-context.service';

const MIN_QUESTIONS = 2;
const MAX_QUESTIONS = 10;

function minQuestionsValidator(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formArray = control as FormArray;
    return formArray.length < min
      ? { minQuestions: { required: min, actual: formArray.length } }
      : null;
  };
}

@Component({
  selector: 'app-survey-admin',
  imports: [ButtonModule, CardModule, ReactiveFormsModule, CommonModule, InputTextModule, ToastModule],
  templateUrl: './survey-admin.component.html',
  styleUrl: './survey-admin.component.scss'
})
export class SurveyAdminComponent {
  surveyAdminForm: FormGroup;
  private initialPollId?: number;
  private initialUserId: number = 0;
  private initialQuestions: Question[] = [];
  readonly MAX_FIELD_LENGTH = 80;
  readonly MIN_QUESTIONS = MIN_QUESTIONS;
  readonly MAX_QUESTIONS = MAX_QUESTIONS;
  readonly TEXT_VALIDATORS = [Validators.required, Validators.maxLength(this.MAX_FIELD_LENGTH)];
  readonly QUESTIONS_ARRAY_VALIDATORS = [
    minQuestionsValidator(this.MIN_QUESTIONS),
    Validators.maxLength(this.MAX_QUESTIONS)
  ];

  constructor(private readonly formBuilder: FormBuilder,
    private readonly pollService: PollService,
    private readonly messageService: MessageService,
    private readonly pollContextService: PollContextService,
    private readonly questionRepository: QuestionRepository) {
    this.surveyAdminForm = this.createEmptyForm();
  }

  private createEmptyForm(): FormGroup {
    return this.formBuilder.group({
      title: ['', this.TEXT_VALIDATORS],
      questions: this.formBuilder.array(
        this.createQuestionFormGroup(),
        this.QUESTIONS_ARRAY_VALIDATORS)
    });
  }

  private createQuestionFormGroup(): FormGroup<any>[] {
    return Array.from({ length: this.MIN_QUESTIONS }, () => this.createQuestion());
  }

  get questions(): FormArray {
    return this.surveyAdminForm.get('questions') as FormArray;
  }

  get canSave(): boolean {
    const filled = this.questions.controls
      .filter(control => {
        const title = control.get('title')?.value;
        return title && title.trim() !== '';
      }).length;
    return filled >= this.MIN_QUESTIONS && this.surveyAdminForm.get('title')?.valid === true;
  }

  addEmptyQuestionInPoll(): void {
    if (this.questions.length === this.MAX_QUESTIONS) {
      this.sendMessage(
        'warn',
        'Maximum number of questions reached',
        'You cannot add more than ' + this.MAX_QUESTIONS + ' questions to a poll.',
        3000
      );
      return;
    }
    this.questions.push(this.createQuestion());
  }

  removeQuestionFromPoll(index: number): void {
    if (this.questions.length === this.MIN_QUESTIONS) {
      this.sendMessage(
        'warn',
        'Minimum number of questions required',
        'A poll must have at least ' + this.MIN_QUESTIONS + ' questions.',
        3000
      );
      return;
    }
    this.questions.removeAt(index);
    this.refreshPollContextAfterQuestionRemoval();
  }

  private refreshPollContextAfterQuestionRemoval(): void {
    if (!this.initialPollId) {
      return;
    }

    const pollId = this.initialPollId;

    const pollTitle = this.surveyAdminForm.get('title')?.value ?? '';
    const poll: Poll = {
      id: pollId,
      title: pollTitle,
      userId: this.initialUserId
    };

    const questions: Question[] = this.questions.controls.map((control) => ({
      id: control.get('id')?.value,
      title: control.get('title')?.value ?? '',
      pollId
    }));

    this.pollContextService.setCurrentPoll({ poll, questions });
  }

  private createQuestion(question?: Partial<Question>): FormGroup {
    return this.formBuilder.group({
      id: [question?.id],
      title: [question?.title || '', this.TEXT_VALIDATORS],
      pollId: [question?.pollId]
    });
  }

  resetForm(): void {
    this.resetInitialVariables();
    this.pollContextService.clearCurrentPoll();
    this.surveyAdminForm = this.createEmptyForm();
    this.surveyAdminForm.markAsPristine();
    this.surveyAdminForm.markAsUntouched();
    this.surveyAdminForm.updateValueAndValidity();

    this.sendMessage('info', 'Form reset', 'The survey form has been reset.', 2500);
  }

  private stripEmptyQuestions(): void {
    const emptyIndices = this.questions.controls
      .map((control, index) => ({ index, title: control.get('title')?.value }))
      .filter(({ title }) => !title || title.trim() === '')
      .map(({ index }) => index)
      .reverse();
    emptyIndices.forEach(index => this.questions.removeAt(index));
  }

  private resetInitialVariables(): void {
    this.initialPollId = undefined;
    this.initialUserId = 0;
    this.initialQuestions = [];
  }

  private sendMessage(
    severity: 'success' | 'info' | 'warn' | 'error',
    summary: string,
    detail: string,
    life: number
  ): void {
    this.messageService.add({ severity, summary, detail, life });
  }

  async onSubmit(): Promise<void> {
    this.stripEmptyQuestions();
    this.surveyAdminForm.markAllAsTouched();

    this.alertOnQuestionSize();

    if (this.surveyAdminForm.invalid) {
      return;
    }

    const pollId = this.initialPollId
      ? await this.updatePoll()
      : await this.createPoll();

    await this.saveFormQuestions(pollId);

    this.sendMessage(
      'success', 
      'Saved successfully', 
      'The poll and its questions have been saved.',
       4000);

    const updatedPoll = await this.pollService.getById(pollId);
    const updatedQuestions = await this.questionRepository.getAllByPollId(pollId);

    if (updatedPoll && updatedQuestions) {
      this.loadPoll(updatedPoll, updatedQuestions);
    }
  }

  private alertOnQuestionSize(): void {
    if (this.questions.length < this.MIN_QUESTIONS) {
      this.sendMessage(
        'error',
        'Not enough questions',
        `Please fill in at least ${this.MIN_QUESTIONS} questions before saving.`,
        4000
      );
    }
  }

  private async createPoll(): Promise<number> {
    const formValue = this.surveyAdminForm.value;
    const poll: Omit<Poll, 'id'> = {
      title: formValue.title,
      userId: this.initialUserId
    };
    const pollId = await this.pollService.create(poll);
    console.log('Poll created');
    return pollId;
  }

  private async updatePoll(): Promise<number> {
    const formValue = this.surveyAdminForm.value;
    const pollToUpdate: Poll = {
      id: this.initialPollId!,
      title: formValue.title,
      userId: this.initialUserId
    };
    await this.pollService.update(pollToUpdate);
    console.log('Poll updated');
    return this.initialPollId!;
  }

  loadPoll(poll: Poll, questions: Question[]): void {
    this.setInitialVariables(poll, questions);
    this.pollContextService.setCurrentPoll({ poll, questions });
    this.surveyAdminForm.patchValue({ title: poll.title });
    this.loadQuestions(questions);
  }

  private setInitialVariables(poll: Poll, questions: Question[]): void {
    this.initialPollId = poll.id;
    this.initialUserId = poll.userId;
    this.initialQuestions = questions;
  }

  private loadQuestions(questions: Question[]): void {
    this.questions.clear();
    questions.forEach(question => {
      this.questions.push(this.createQuestion(question));
    });
  }

  private async saveFormQuestions(pollId: number): Promise<void> {
    await this.deleteUnusedQuestionsFromRepository();
    await this.updateModifiedQuestionsInRepository();
    await this.createQuestionsInRepository(pollId);
  }

  private async deleteUnusedQuestionsFromRepository() {
    const questionsToDelete = this.getQuestionsToDelete();
    for (const questionId of questionsToDelete) {
      await this.questionRepository.delete(questionId);
    }
  }

  private getQuestionsToDelete(): number[] {
    const formQuestionsIds = new Set(this.questions.controls
      .map(control => control.get('id')?.value)
      .filter((id: number | undefined): id is number => id != null));
    return this.initialQuestions
      .map(question => question.id)
      .filter(id => !formQuestionsIds.has(id));
  }

  private async updateModifiedQuestionsInRepository() {
    const questionsToUpdate = this.getQuestionsToUpdate();
    for (const questionToUpdate of questionsToUpdate) {
      await this.questionRepository.update(questionToUpdate);
    }
  }

  private getQuestionsToUpdate(): Question[] {
    const formQuestions = this.questions.controls
      .map(control => ({
        id: control.get('id')?.value,
        title: control.get('title')?.value,
        pollId: control.get('pollId')?.value
      }))
      .filter((formQuestion): formQuestion is { id: number, title: string, pollId: number } => formQuestion.id !== undefined);

    return this.initialQuestions
      .filter(initialQuestion => {
        const formQuestion = formQuestions.find(formQuestion => formQuestion.id === initialQuestion.id);
        return formQuestion && formQuestion.title !== initialQuestion.title;
      })
      .map(initialQuestion => {
        const formQuestion = formQuestions.find(formQuestion => formQuestion.id === initialQuestion.id)!;
        return {
          id: initialQuestion.id,
          title: formQuestion.title,
          pollId: formQuestion.pollId
        };
      });
  }

  private async createQuestionsInRepository(pollId: number): Promise<void> {
    const questionsToCreate = this.getQuestionsToCreate();
    for (const questionToCreate of questionsToCreate) {
      await this.questionRepository.create({
        title: questionToCreate.title,
        pollId: pollId
      });
    }
  }

  private getQuestionsToCreate(): { title: string }[] {
    const formQuestions = this.questions.controls
      .map(control => ({
        id: control.get('id')?.value,
        title: control.get('title')?.value,
      }))
      .filter((formQuestion): formQuestion is { id: undefined, title: string } =>
        formQuestion.id == null &&
        formQuestion.title != null);
    return formQuestions.map(formQuestion => ({
      title: formQuestion.title
    }));
  }
}
