import { Component } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-test',
  template: `
    <div class="toast-test-container">
      <h3>Toast Test Component</h3>
      <div class="btn-group" role="group">
        <button class="btn btn-success me-2" (click)="testSuccess()">Test Success</button>
        <button class="btn btn-danger me-2" (click)="testError()">Test Error</button>
        <button class="btn btn-warning me-2" (click)="testWarning()">Test Warning</button>
        <button class="btn btn-info me-2" (click)="testInfo()">Test Info</button>
        <button class="btn btn-primary me-2" (click)="testAll()">Test All</button>
        <button class="btn btn-secondary" (click)="clearAll()">Clear All</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-test-container {
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      margin: 20px;
    }
    .btn-group {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
  `]
})
export class ToastTestComponent {

  constructor(private toastService: ToastService) {}

  testSuccess() {
    console.log('Testing success toast...');
    this.toastService.showSuccess('This is a success message!', 'Success');
  }

  testError() {
    console.log('Testing error toast...');
    this.toastService.showError('This is an error message!', 'Error');
  }

  testWarning() {
    console.log('Testing warning toast...');
    this.toastService.showWarning('This is a warning message!', 'Warning');
  }

  testInfo() {
    console.log('Testing info toast...');
    this.toastService.showInfo('This is an info message!', 'Info');
  }

  testAll() {
    console.log('Testing all toasts...');
    this.toastService.testToast();
  }

  clearAll() {
    console.log('Clearing all toasts...');
    this.toastService.clearAll();
  }
} 