import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { observableToBeFn } from "rxjs/internal/testing/TestScheduler";
import { Observable, of, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { AppStateService } from "./app-state.service";
import { SecureStorageService } from "./secure-storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private role: string = '';
  constructor(
    private http: HttpClient,
    private router: Router,
    private appStateService: AppStateService,
    private secureStorage: SecureStorageService
  ) {
    // Initialize role from secure storage if available
    this.role = this.secureStorage.getUserRole() || '';
  }
  login(username: string, password: string): Observable<any> {
    if (username && password) {
      return this.http.post<any>(environment.authUrl + 'login', { username, password }).pipe(
        tap((response) => {
          if (response.success) {

            switch (response.data.user.role_name) {
              case 'Super Admin':
                this.setRole('super-admin');
                break;
              case 'Customer Admin':
                this.setRole('customer-admin');
                break;
              case 'Customer User':
                this.setRole('customer');
                break;
              default:
                console.error('Invalid user');
                return;
            }
            // Store authentication data securely
            if (response.data.token) {
              this.secureStorage.setAuthToken(response.data.token);
            }
            
            // Store user data in app state
            this.appStateService.setUser({
              token: response.data.token,
              role: response.data.user.role_name,
              user: response.data.user,
              permissions: response.data.permissions || []
            });
            
            // Redirect to appropriate dashboard based on role
            this.redirectAfterLogin();
          }
        })
      );
    }

    return of(null);
  }

  setRole(role: string) {
    this.role = role;
    this.secureStorage.setUserRole(role);
  }

  getRole(): string {
    return this.role || this.secureStorage.getUserRole() || '';
  }

  isSuperAdmin(): boolean {
    return this.getRole() === 'super-admin';
  }

  isCustomerAdmin(): boolean {
    return this.getRole() === 'customer-admin';
  }

  isCustomer(): boolean {
    return this.getRole() === 'customer';
  }

  logout(): void {
    // Clear authentication data
    this.secureStorage.clearAuthData();
    this.appStateService.logout();
    this.role = '';
  }

  isAuthenticated(): boolean {
    return !!this.secureStorage.getAuthToken() || this.appStateService.isAuthenticated();
  }

  private redirectAfterLogin(): void {
    // Check if there's a stored redirect URL
    const redirectUrl = this.appStateService.getRedirectUrl();
    
    if (redirectUrl) {
      this.appStateService.clearRedirectUrl();
      this.router.navigateByUrl(redirectUrl);
    } else {
      // Redirect to appropriate dashboard based on role
      const role = this.getRole();
      switch (role) {
        case 'super-admin':
          this.router.navigate(['/super-admin']);
          break;
        case 'customer-admin':
          this.router.navigate(['/customer-admin']);
          break;
        case 'customer':
          this.router.navigate(['/customer']);
          break;
        default:
          this.router.navigate(['/login']);
      }
    }
  }
}
