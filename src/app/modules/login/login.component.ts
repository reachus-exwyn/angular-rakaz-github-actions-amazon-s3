import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import {
  NgbCarouselConfig,
  NgbCarouselModule,
} from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [NgbCarouselConfig],
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  showNavigationArrows = false;
  showNavigationIndicators = true;
  submitted: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
    config: NgbCarouselConfig
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    config.showNavigationArrows = false;
    config.showNavigationIndicators = true;
  }
  get form() {
    return this.loginForm.controls;
  }
  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.toastService.showError('Please fill in all required fields.');
      return;
    }

    this.submitted = false;
    const { username, password } = this.loginForm.value;

    this.authService
      .login(username, password)
      .pipe(
        take(1) // Auto-unsubscribe after first emit
      )
      .subscribe({
        next: (response: any) => {
          if (response?.success) {
            const role = response?.data?.user?.role_name;
            this.toastService.showSuccess('Login successful!');
            // this.router.navigate(['/']); // Uncomment to redirect
             switch (role) {
                case 'Super Admin':
                  this.router.navigate(['/super-admin']);
                  break;
                case 'Customer Admin':
                  this.router.navigate(['/customer-admin']);
                  break;
                case 'Customer User':
                  this.router.navigate(['/customer']);
                  break;
                default:
                  console.error('Invalid user');
                  return;
              }
          } else {
            this.toastService.showError(
              'Login failed. Please check your credentials.'
            );
          }
        },
        error: (err) => {
          this.toastService.showError(
            'Login failed. Please check your credentials and try again.'
          );
        },
      });
  }
}
