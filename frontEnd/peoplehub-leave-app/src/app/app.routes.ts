import { Routes } from '@angular/router';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { ApplyLeaveComponent } from './components/apply-leave/apply-leave';
import { LeaveManagementComponent } from './components/leave-management/leave-management';

export const routes: Routes = [
    { path: 'apply', component: ApplyLeaveComponent },
    { path: '',  component: LeaveManagementComponent },
    { path: '**', component: EmptyRouteComponent }
];
