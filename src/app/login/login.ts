import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginActive = false;

  showLogin(): void {
    this.loginActive = true;
  }

  showRegister(): void {
    this.loginActive = false;
  }
}
