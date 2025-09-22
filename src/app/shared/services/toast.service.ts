import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: number;
  title: string;
  message: string;
  type: string;
  autohide: boolean;
  delay: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  constructor() { }

  showSuccess(message: string, title: string = 'Success') {
    this.showToast(message, title, 'success');
  }

  showError(message: string, title: string = 'Error') {
    this.showToast(message, title, 'danger');
  }

  showWarning(message: string, title: string = 'Warning') {
    this.showToast(message, title, 'warning');
  }

  showInfo(message: string, title: string = 'Info') {
    this.showToast(message, title, 'info');
  }

  private showToast(message: string, title: string, type: string) {
    console.log(`Showing ${type} toast:`, { title, message });
    
    const toast: Toast = {
      id: Date.now(),
      title: title,
      message: message,
      type: type,
      autohide: true,
      delay: 3000
    };
    
    const currentToasts = this.toastsSubject.value;
    console.log('Current toasts:', currentToasts);
    console.log('Adding new toast:', toast);
    
    this.toastsSubject.next([...currentToasts, toast]);
    
    // Auto remove toast after delay
    setTimeout(() => {
      this.removeToast(toast.id);
    }, toast.delay);
  }

  getToasts(): Observable<Toast[]> {
    return this.toasts$;
  }

  removeToast(id: number) {
    const currentToasts = this.toastsSubject.value;
    const filteredToasts = currentToasts.filter(toast => toast.id !== id);
    this.toastsSubject.next(filteredToasts);
  }

  clearAll() {
    this.toastsSubject.next([]);
  }

  // Debug method to test toast functionality
  testToast() {
    console.log('Testing toast service...');
    this.showSuccess('This is a test success message!', 'Test Success');
    setTimeout(() => {
      this.showError('This is a test error message!', 'Test Error');
    }, 1000);
    setTimeout(() => {
      this.showWarning('This is a test warning message!', 'Test Warning');
    }, 2000);
    setTimeout(() => {
      this.showInfo('This is a test info message!', 'Test Info');
    }, 3000);
  }
} 