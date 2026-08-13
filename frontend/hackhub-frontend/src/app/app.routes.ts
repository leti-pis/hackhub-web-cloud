import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { HackathonDetail } from './pages/hackathon-detail/hackathon-detail';
import { HackathonCreate } from './pages/hackathon-create/hackathon-create';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'hackathons/:id',
        component: HackathonDetail
    },
    {
        path: 'hackathon/create',
        component: HackathonCreate
    }
];
