import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { HackathonDetail } from './pages/hackathon-detail/hackathon-detail';
import { HackathonCreate } from './pages/hackathon-create/hackathon-create';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Account } from './pages/account/account';

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
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'account',
        component: Account
    }
];
