import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { HackathonDetail } from './pages/hackathon-detail/hackathon-detail';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'hackathon/:id',
        component: HackathonDetail
    }
];
