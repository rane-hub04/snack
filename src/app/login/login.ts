
﻿import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../core/services/toast.service';

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
  loginActive = false;
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoading = false;
  isRegisterLoading = false;

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

    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['serveur', Validators.required]
    });
  }

  showLogin(): void {
    this.loginActive = true;
  }

  showRegister(): void {
    this.loginActive = false;
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  get registerNom() { return this.registerForm.get('nom'); }
  get registerPrenom() { return this.registerForm.get('prenom'); }
  get registerEmail() { return this.registerForm.get('email'); }
  get registerPassword() { return this.registerForm.get('password'); }
  get registerRole() { return this.registerForm.get('role'); }

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
