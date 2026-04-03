import { Routes } from '@angular/router';
import { PollPageComponent } from './components/poll-page/poll-page.component';

export const routes: Routes = [
    { path: '', redirectTo: 'poll', pathMatch: 'full' },
    { path: 'poll', component: PollPageComponent },
    { path: '**', redirectTo: 'poll', pathMatch: 'full' }
];
