import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { AppStateService } from './app-state.service';
import { SecureStorageService } from './secure-storage.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  private activeRequests = 0;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private appStateService: AppStateService,
    private secureStorage: SecureStorageService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.activeRequests++;
    
    // Add authentication token if available
    const token = this.secureStorage.getAuthToken() || this.appStateService.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Add common headers
    request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Log the request (in development mode)
    if (!environment.production) {
      console.log('HTTP Request:', {
        url: request.url,
        method: request.method,
        headers: request.headers,
        body: request.body
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      }),
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
          // All requests completed
        }
      })
    );
  }

  private handleError(error: HttpErrorResponse): void {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Bad Request - Please check your input';
          break;
        case 401:
          errorMessage = 'Unauthorized - Please login again';
          this.handleUnauthorized();
          break;
        case 403:
          errorMessage = 'Forbidden - You don\'t have permission to access this resource';
          break;
        case 404:
          errorMessage = 'Not Found - The requested resource was not found';
          break;
        case 409:
          errorMessage = 'Conflict - The request conflicts with the current state';
          break;
        case 422:
          errorMessage = 'Validation Error - Please check your input';
          break;
        case 500:
          errorMessage = error.error.error || 'Internal Server Error - Please try again later';
          break;
        case 502:
          errorMessage = 'Bad Gateway - Server is temporarily unavailable';
          break;
        case 503:
          errorMessage = 'Service Unavailable - Server is temporarily unavailable';
          break;
        default:
          errorMessage = `Server Error: ${error.status} - ${error.statusText}`;
      }
    }

    // Show error toast
    this.toastService.showError(errorMessage);

    // Log error details (in development mode)
    if (!environment.production) {
      console.error('HTTP Error:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        message: errorMessage,
        error: error.error
      });
    }
  }

  private handleUnauthorized(): void {
    // Clear authentication data
    this.secureStorage.clearAuthData();
    this.appStateService.logout();
    
    // Redirect to login page
    this.router.navigate(['/login']);
  }
} 