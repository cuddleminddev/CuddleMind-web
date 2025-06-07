import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './modules/login/login/login.component';
import { authGuard } from './core/guard/auth.guard';

const dashboardModule = () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
const plansModule = () => import('./modules/plans/plans.module').then(m => m.PlansModule)
const chatModule = () => import('./modules/chat/chat.module').then(m => m.ChatModule)
const allListModule = () => import('./modules/all-list/all-list.module').then(m => m.AllListModule)
const bookingModule = () => import('./modules/bookings/bookings.module').then(m => m.BookingsModule)

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: '', component: LayoutComponent, canActivate: [authGuard],
        children: [
            { path: 'dashboard', loadChildren: dashboardModule },
            { path: 'plans', loadChildren: plansModule },
            { path: 'chat', loadChildren: chatModule },
            { path: 'alllist', loadChildren: allListModule },
            { path: 'bookings', loadChildren: bookingModule }
        ]
    },
    { path: '**', redirectTo: 'login' }
];
