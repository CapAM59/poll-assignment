import { Component, effect, inject, Injector, Signal, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { AnswersContextService } from '../../services/answers-context.service';
import { CurrentPollContext, PollContextService } from '../../services/poll-context.service';
import { Answer } from '../../models/answer.model';
import { Question } from '../../models/question.model';
import { AnswerRepository } from '../../repositories/answer.repository';
import { Card } from "primeng/card";


@Component({
  selector: 'app-survey-results',
  imports: [
    ChartModule,
    Card
],
  templateUrl: './survey-results.component.html',
  styleUrl: './survey-results.component.scss'
})
export class SurveyResultsComponent implements OnInit {
  private readonly injector = inject(Injector);
  chartData: any;
  chartOptions: any; // STEP 7 : configurer les options Chart.js (responsive, axes, titre)
  readonly currentPollContext: Signal<CurrentPollContext | undefined>
  readonly currentAnswersContext: Signal<number>
  
  get hasData(): boolean {
    return this.chartData?.datasets?.length > 0 && this.chartData?.labels;
  }

  constructor(
    private readonly pollContextService: PollContextService,
    private readonly answersContextService: AnswersContextService,
    private readonly answerRepository: AnswerRepository
  ) {
    this.currentPollContext = this.pollContextService.getCurrentPollContext;
    this.currentAnswersContext = this.answersContextService.getAnswersUpdated;
  }

  ngOnInit(): void {
    this.loadAnswers();
  }

  private loadAnswers() {
    effect(() => {
      const context = this.currentPollContext();
      const questions = context?.questions ?? [];
      const answersVersion = this.currentAnswersContext();

      if (context && answersVersion >= 0) {
        const answerPromises: Promise<Answer[]>[] = this.getAnswerPromises(questions);
        this.sendAnswerPromisesToChart(answerPromises, questions);
      } else {
        this.chartData = null;
      }
    }, { injector: this.injector });
  }

  private getAnswerPromises(questions: Question[]) {
    const answerPromises: Promise<Answer[]>[] = [];
    for (const question of questions) {
      answerPromises.push(this.answerRepository.getAllByQuestionId(question.id));
    }
    return answerPromises;
  }

  private sendAnswerPromisesToChart(answerPromises: Promise<Answer[]>[], questions: Question[]) {
    Promise.all(answerPromises).then((allAnswers) => {
      const answers = allAnswers.flat();
      this.buildChartData(questions, answers);
    });
  }

  private buildChartData(_questions: Question[], _answers: Answer[]) {
    let labels: string[] = [];
    let votes: number[] = [];
    for (const question of _questions) {
      labels.push(question.title ?? '');
      this.sumVotes(_answers, question, votes);
    }

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Votes',
          data: votes
        }
      ]
    };
  }

  private sumVotes(_answers: Answer[], question: Question, votes: number[]) {
    let count = 0;
    for (const answer of _answers) {
      if (question.id === answer.questionId
        && answer.vote === true) {
        count++;
      }
    }
    votes.push(count);
  }
}