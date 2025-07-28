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
  private profilePictureSubject = new BehaviorSubject<string | null>(null);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public profilePicture$ = this.profilePictureSubject.asObservable();

  constructor(private supabaseService: SupabaseService) {
    this.initializeAuthState();
  }

  private async initializeAuthState() {
    try {
      // Check for existing session on app startup
      const session = await this.supabaseService.getSession();
      if (session?.user) {
        this.currentUserSubject.next(session.user);
        await this.loadProfilePicture(session.user.id);
      }

      // Listen for auth state changes
      this.supabaseService.supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          this.currentUserSubject.next(session.user);
          await this.loadProfilePicture(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          this.currentUserSubject.next(null);
          this.profilePictureSubject.next(null);
        }
      });
    } finally {
      // Mark loading as complete
      this.loadingSubject.next(false);
    }
  }

  private async loadProfilePicture(userId: string) {
    try {
      const profile = await this.supabaseService.getProfile();
      if (profile?.profile_picture) {
        this.profilePictureSubject.next(profile.profile_picture);
      } else {
        this.profilePictureSubject.next(null);
      }
    } catch (error) {
      console.error('Error loading profile picture:', error);
      this.profilePictureSubject.next(null);
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

  getProfilePicture(): string | null {
    return this.profilePictureSubject.value;
  }

  // Update profile picture when it changes
  updateProfilePicture(profilePicture: string | null) {
    this.profilePictureSubject.next(profilePicture);
  }
} 