import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from './loader.service';

@Injectable()
export class LoadingInterceptorService implements HttpInterceptor {

  constructor(private loaderService: LoaderService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Show loader for HTTP requests
    this.loaderService.showForRequest({
      type: 'spinner',
      size: 'medium',
      color: 'primary',
      text: 'Loading...',
      overlay: true,
      fullScreen: false
    });

    return next.handle(request).pipe(
      finalize(() => {
        // Hide loader when request completes
        this.loaderService.hideForRequest();
      })
    );
  }
} 