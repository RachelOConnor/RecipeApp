import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../supabase.service';
import { AuthStateService } from '../auth-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private supabaseService: SupabaseService, 
    private authStateService: AuthStateService,
    private router: Router
  ) {}

  async login() {
    try {
      // Call the Supabase service to log in
      const user = await this.supabaseService.signIn(this.email, this.password);

      if (user) {
        // The AuthStateService will automatically update the auth state
        // Navigate to a home/dashboard page after successful login
        this.router.navigate(['/tabs']); // Update this to your desired route
      }

    } catch (error) {
      // Handle error (e.g., show an alert)
      console.error('Error logging in', error);
      alert('Login failed. Please check your credentials.');
    }
  }

  goToSignup() {
    // Navigate to the sign-up page if the user doesn't have an account
    this.router.navigate(['/signup']);
  }
}
