import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard {
  username = 'User';

  constructor(private router: Router) {
    const state = history.state as { username?: string };
    this.username = state.username || this.username;
  }

  logout() {
    this.router.navigate(['/']);
  }
}
