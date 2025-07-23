import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from './auth-state.service';
import { Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription | null = null;

  constructor(
    private authStateService: AuthStateService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to both auth state and loading state changes
    this.authSubscription = combineLatest([
      this.authStateService.currentUser$,
      this.authStateService.loading$
    ]).subscribe(([user, loading]) => {
      // Only navigate after loading is complete
      if (!loading) {
        if (user) {
          // User is logged in, navigate to main app
          this.router.navigate(['/tabs']);
        } else {
          // User is not logged in, navigate to login page
          this.router.navigate(['/login']);
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
