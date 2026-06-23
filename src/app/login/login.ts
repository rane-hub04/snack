import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  username = '';
  password = '';
  rememberMe = false;
  error = '';
  success = '';

  constructor(private router: Router) {}

  login() {
    this.error = '';
    this.success = '';

    if (!this.username.trim() || !this.password) {
      this.error = 'Enter a username and password to continue.';
      return;
    }

    if (this.username.toLowerCase() !== 'barista' || this.password !== 'snack123') {
      this.error = 'Sorry, that username or password is not recognized.';
      return;
    }

    this.success = `Welcome back, ${this.username}! Your snack bar dashboard is ready.`;
    this.router.navigate(['/dashboard'], { state: { username: this.username } });
  }
}
