import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authStateService: AuthStateService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Check if the user is logged in using the auth state service
    if (!this.authStateService.isAuthenticated()) {
      // If no user is logged in, redirect to the login page
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
