import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from './services/auth.guard';
import { User } from './user/user';

export const routes: Routes = [
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard]
    },
    
    {
        path: 'user',
        component: User
    },
    {
        path: '',
        component: Login
    },

];
