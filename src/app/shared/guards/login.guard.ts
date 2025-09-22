import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // If user is already authenticated, redirect to appropriate dashboard
    if (this.authService.isAuthenticated()) {
      const role = this.authService.getRole();
      
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
      
      return false;
    }

    return true;
  }
} 