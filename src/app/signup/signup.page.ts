import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class SignupPage {
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  username: string = '';
  profilePicture: string = '';
  cookingSkillLevel: string = ''; 
  errorMessage: string = '';

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async signup() 
  {
    try 
    {
      const { user, error } = await this.supabaseService.signUp(this.email, this.password);

      if (error) 
      {
        console.error('Error signing up:', error);
      }

      if (user) {
        // Save details in profiles table
        const profile = await this.supabaseService.createProfile(
          user.id,
          this.firstName,
          this.lastName,
          this.username,
          this.profilePicture,
          this.cookingSkillLevel
        );
        this.router.navigate(['/tabs']);

        if (profile) 
        {
          // Redirect to homr
          this.router.navigate(['/tabs']);
        } else {
          console.error('Error creating profile');
          this.errorMessage = 'Profile creation failed. Please try again.';
        }
      }
    } catch (error) {
      console.error('Error signing up', error);
      this.errorMessage = 'Sign-up failed. Please try again.';
    }
  }
}

