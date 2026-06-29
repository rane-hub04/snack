import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';


export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: '**', redirectTo: '' },
];
export const loginRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login' }
];