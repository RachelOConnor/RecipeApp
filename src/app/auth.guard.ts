import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SupabaseService } from './supabase.service';

@Injectable
({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private supabaseService: SupabaseService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Check if the user is logged in
    const user = this.supabaseService.getCurrentUser(); // Assuming you have a method to check if the user is logged in

    if (!user) {
      // If no user is logged in, redirect to the login page
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
