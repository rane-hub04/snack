import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent {
  isDarkTheme = false;

  constructor(private router: Router) {}

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }

  get themeLabel() {
    return this.isDarkTheme ? 'Mode nuit activé' : 'Mode jour activé';
  }

  logout() {
    this.router.navigate(['/']);
  }
}
