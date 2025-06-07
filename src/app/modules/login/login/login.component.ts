import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/components/alert/service/alert.service';
import { AuthService } from '../../../core/interceptor/auth-service.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.alertService.showAlert({
        message: 'Please fill in all required fields correctly.',
        type: 'error',
        autoDismiss: true,
        duration: 4000
      });
      return;
    }

    this.isLoading = true;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status) {
          this.alertService.showAlert({
            message: 'Login successful!',
            type: 'success',
            autoDismiss: true,
            duration: 4000
          });
          this.router.navigate(['/dashboard']);
        } else {
          this.alertService.showAlert({
            message: response.message || 'Login failed.',
            type: 'error',
            autoDismiss: true,
            duration: 4000
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.alertService.showAlert({
          message: 'Login failed. Please try again.',
          type: 'error',
          autoDismiss: true,
          duration: 4000
        });
        console.error('Login error:', err);
      }
    });
  }
}
