import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { Question } from '../../models/question.model';
import { Poll } from '../../models/poll.model';
import { PollService } from '../../services/poll.service';
import { QuestionRepository } from '../../repositories/question.repository';

@Component({
  selector: 'app-survey-admin',
  imports: [CardModule, ReactiveFormsModule, CommonModule, InputTextModule],
  templateUrl: './survey-admin.component.html',
  styleUrls: ['./survey-admin.component.scss']
})
export class SurveyAdminComponent {
  surveyForm: FormGroup;
  private initialPollId?: number;
  private initialQuestions: Question[] = [];

  constructor(private readonly formBuilder: FormBuilder,
    private readonly pollService: PollService,
    private readonly questionRepository: QuestionRepository) {
    this.surveyForm = this.formBuilder.group({
      title: ['', Validators.required],
      questions: this.formBuilder.array([])
    });
  }

  // ngOnInit()



  addEmptyQuestionInPoll(): void {
    const questions = this.getQuestionsInPoll();
    questions.push(this.createQuestion());
  }

  removeQuestionFromPoll(index: number): void {
    const questions = this.getQuestionsInPoll();
    questions.removeAt(index);
  }

  private getQuestionsInPoll(): FormArray {
    return this.surveyForm.get('questions') as FormArray;
  }

  private createQuestion(question?: Partial<Question>): FormGroup {
    return this.formBuilder.group({
      id: [question?.id],
      title: [question?.title || '', Validators.required],
      pollId: [question?.pollId]
    });
  }

  async onSubmit(): Promise<void> {
    const pollId = this.initialPollId
      ? await this.updatePoll()
      : await this.createPoll();

    await this.saveFormQuestions(pollId);

    const updatedPoll = await this.pollService.getById(pollId);
    const updatedQuestions = await this.questionRepository.getAllByPollId(pollId);

    if (updatedPoll && updatedQuestions) {
      this.loadPoll(updatedPoll, updatedQuestions);
    }
  }

  private async createPoll(): Promise<number> {
    const formValue = this.surveyForm.value;
    const poll: Omit<Poll, 'id'> = {
      title: formValue.title,
      userId: 0 // TODO Replace userId with actual user ID from authentication context
    };
    const pollId = await this.pollService.create(poll);
    console.log('Poll created');
    return pollId;
  }

  private async updatePoll(): Promise<number> {
    const formValue = this.surveyForm.value;
    const pollToUpdate: Poll = {
      id: this.initialPollId!,
      title: formValue.title,
      userId: formValue.userId
    };
    await this.pollService.update(pollToUpdate);
    console.log('Poll updated');
    return this.initialPollId!;
  }

  loadPoll(poll: Poll, questions: Question[]): void {
    this.setInitialVariables(poll, questions);
    this.surveyForm.patchValue({ title: poll.title });
    this.loadQuestions(questions);
  }

  private setInitialVariables(poll: Poll, questions: Question[]) {
    this.initialPollId = poll.id;
    this.initialQuestions = questions;
  }

  private loadQuestions(questions: Question[]) {
    const questionsArray = this.getQuestionsInPoll();
    questionsArray.clear();
    questions.forEach(question => {
      questionsArray.push(this.createQuestion(question));
    });
  }

  private async saveFormQuestions(pollId: number): Promise<void> {
    await this.deleteUnusedQuestionsFromRepository();
    await this.updatedEditedQuestionsInRepository();
    await this.createQuestionsInRepository(pollId);
  }

  private async deleteUnusedQuestionsFromRepository() {
    const questionsToDelete = this.getQuestionsToDelete();
    for (const questionId of questionsToDelete) {
      await this.questionRepository.delete(questionId);
    }
  }

  private getQuestionsToDelete(): number[] {
    const formQuestionsIds = this.getQuestionsInPoll().controls
      .map(control => control.get('id')?.value)
      .filter((id: number | undefined): id is number => id !== undefined);
    return this.initialQuestions
      .map(question => question.id)
      .filter(id => !formQuestionsIds.includes(id));
  }

  private async updatedEditedQuestionsInRepository() {
    const questionsToUpdate = this.getQuestionsToUpdate();
    for (const questionToUpdate of questionsToUpdate) {
      await this.questionRepository.update(questionToUpdate);
    }
  }

  private getQuestionsToUpdate(): Question[] {
    const formQuestions = this.getQuestionsInPoll().controls
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

  private async createQuestionsInRepository(pollId: number) {
    const questionsToCreate = this.getQuestionsToCreate();
    for (const questionToCreate of questionsToCreate) {
      await this.questionRepository.create({
        title: questionToCreate.title,
        pollId: pollId
      });
    }
  }

  private getQuestionsToCreate(): { title: string }[] {
    const formQuestions = this.getQuestionsInPoll().controls
      .map(control => ({
        id: control.get('id')?.value,
        title: control.get('title')?.value,
      }))
      .filter((formQuestion): formQuestion is { id: undefined, title: string } =>
        formQuestion.id === undefined &&
        formQuestion.title !== undefined);
    return formQuestions.map(formQuestion => ({
      title: formQuestion.title
    }));
  }

  resetForm(): void {
    this.initialPollId = undefined;
    this.initialQuestions = [];
    this.surveyForm.reset();
    (this.surveyForm.get('questions') as FormArray).clear();
  }
}
