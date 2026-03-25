import { Component } from '@angular/core';

import { SurveyAdminComponent } from '../survey-admin/survey-admin.component';
import { SurveyProbeComponent } from '../survey-probe/survey-probe.component';
import { SurveyResultsComponent } from "../survey-results/survey-results.component";

@Component({
  selector: 'app-poll-page',
  imports: [SurveyAdminComponent, SurveyProbeComponent, SurveyResultsComponent],
  templateUrl: './poll-page.component.html',
  styleUrl: './poll-page.component.scss'
})
export class PollPageComponent {

}
