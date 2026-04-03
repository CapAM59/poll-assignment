import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

import { SurveyAdminComponent } from '../survey-admin/survey-admin.component';
import { SurveyProbeComponent } from '../survey-probe/survey-probe.component';
import { SurveyResultsComponent } from "../survey-results/survey-results.component";

@Component({
  selector: 'app-poll-page',
  imports: [ButtonModule, SurveyAdminComponent, SurveyProbeComponent, SurveyResultsComponent],
  templateUrl: './poll-page.component.html',
  styleUrl: './poll-page.component.scss'
})
export class PollPageComponent {

}
