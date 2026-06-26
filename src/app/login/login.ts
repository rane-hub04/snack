import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../core/services/toast.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.auth.loginWithEmail(email, password)
      .then(result => {
        this.isLoading = false;
        if (!result.error) {
          const redirectUrl = this.auth.getDefaultRoute();
          this.router.navigate([redirectUrl]);
          this.toastService.success('Connexion réussie', 'Bienvenue dans BarOS POS');
        } else {
          this.toastService.error('Erreur de connexion', result.error || 'Identifiants invalides');
        }
      })
      .catch(error => {
        this.isLoading = false;
        console.error('Login error:', error);
        this.toastService.error('Erreur de connexion', 'Une erreur est survenue lors de la connexion');
      });
  }
}