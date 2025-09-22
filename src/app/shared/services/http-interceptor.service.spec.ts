import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { HttpInterceptorService } from './http-interceptor.service';

describe('HttpInterceptorService', () => {
  let service: HttpInterceptorService;
  let router: jasmine.SpyObj<Router>;
  let toastService: jasmine.SpyObj<ToastService>;
  let httpHandler: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['showError']);
    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [
        HttpInterceptorService,
        { provide: Router, useValue: routerSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    });

    service = TestBed.inject(HttpInterceptorService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    httpHandler = httpHandlerSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add authorization header when token exists', () => {
    // Arrange
    const token = 'test-token';
    spyOn(localStorage, 'getItem').and.returnValue(token);
    const request = new HttpRequest('GET', '/api/test');
    const response = new HttpResponse({ status: 200 });
    httpHandler.handle.and.returnValue(of(response));

    // Act
    service.intercept(request, httpHandler).subscribe();

    // Assert
    expect(httpHandler.handle).toHaveBeenCalled();
    const modifiedRequest = httpHandler.handle.calls.mostRecent().args[0];
    expect(modifiedRequest.headers.get('Authorization')).toBe(`Bearer ${token}`);
  });

  it('should handle 401 error and redirect to login', () => {
    // Arrange
    const request = new HttpRequest('GET', '/api/test');
    const error = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized'
    });
    httpHandler.handle.and.returnValue(throwError(() => error));
    spyOn(localStorage, 'removeItem');

    // Act
    service.intercept(request, httpHandler).subscribe({
      error: () => {}
    });

    // Assert
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('role');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(toastService.showError).toHaveBeenCalled();
  });

  it('should handle 500 error and show appropriate message', () => {
    // Arrange
    const request = new HttpRequest('GET', '/api/test');
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error'
    });
    httpHandler.handle.and.returnValue(throwError(() => error));

    // Act
    service.intercept(request, httpHandler).subscribe({
      error: () => {}
    });

    // Assert
    expect(toastService.showError).toHaveBeenCalledWith('Internal Server Error - Please try again later');
  });
}); 