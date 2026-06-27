import { Routes } from '@angular/router';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { EmployeeList } from './components/employee-list/employee-list';
import { EmployeeForm } from './components/employee-form/employee-form';
import { EmployeeProfile } from './components/employee-profile/employee-profile';

export const routes: Routes = [
    {path: '', component: EmployeeList },
    {path: 'add', component: EmployeeForm},
    {path: 'edit/:id', component: EmployeeForm },
    {path: 'profile/:id', component: EmployeeProfile},
    { path: '**', component: EmptyRouteComponent}
];
