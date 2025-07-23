import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(true);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private supabaseService: SupabaseService) {
    this.initializeAuthState();
  }

  private async initializeAuthState() {
    try {
      // Check for existing session on app startup
      const session = await this.supabaseService.getSession();
      if (session?.user) {
        this.currentUserSubject.next(session.user);
      }

      // Listen for auth state changes
      this.supabaseService.supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          this.currentUserSubject.next(session.user);
        } else if (event === 'SIGNED_OUT') {
          this.currentUserSubject.next(null);
        }
      });
    } finally {
      // Mark loading as complete
      this.loadingSubject.next(false);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isLoading(): boolean {
    return this.loadingSubject.value;
  }
} 