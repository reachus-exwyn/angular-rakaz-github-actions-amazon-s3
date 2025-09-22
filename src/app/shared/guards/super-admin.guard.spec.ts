import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { SuperAdminGuard } from './super-admin.guard';

describe('SuperAdminGuard', () => {
  let guard: SuperAdminGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'isSuperAdmin']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['showError']);

    TestBed.configureTestingModule({
      providers: [
        SuperAdminGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    });

    guard = TestBed.inject(SuperAdminGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is authenticated and is super admin', () => {
    // Arrange
    authService.isAuthenticated.and.returnValue(true);
    authService.isSuperAdmin.and.returnValue(true);

    // Act
    const result = guard.canActivate(null!, null!);

    // Assert
    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(toastService.showError).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is not authenticated', () => {
    // Arrange
    authService.isAuthenticated.and.returnValue(false);
    spyOn(localStorage, 'setItem');

    // Act
    const result = guard.canActivate(null!, { url: '/super-admin' } as any);

    // Assert
    expect(result).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalledWith('redirectUrl', '/super-admin');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(authService.isSuperAdmin).not.toHaveBeenCalled();
  });

  it('should show error and redirect when user is authenticated but not super admin', () => {
    // Arrange
    authService.isAuthenticated.and.returnValue(true);
    authService.isSuperAdmin.and.returnValue(false);

    // Act
    const result = guard.canActivate(null!, null!);

    // Assert
    expect(result).toBe(false);
    expect(toastService.showError).toHaveBeenCalledWith('Access denied. Super Admin privileges required.');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
}); 