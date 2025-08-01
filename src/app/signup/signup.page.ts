import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../supabase.service';
import { AuthStateService } from '../auth-state.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class SignupPage
{
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  username: string = '';
  profilePicture: string = '';
  cookingSkillLevel: string = ''; 
  errorMessage: string = '';
  imageUrl: string | null = null;
  imageFile: File | null = null; 
  imagePreview: string | null = null;

  constructor(
    private supabaseService: SupabaseService, 
    private authStateService: AuthStateService,
    private router: Router,
    private navCtrl: NavController,
  ) {}
  
  goBack() {
    this.navCtrl.back();
  }

  // If image has been selected
  onImageSelected(event: any) 
  {
    const file: File = event.target.files[0];

    // if file selected
    if (file) 
    {
      this.imageFile = file;

      // Preview image
      const reader = new FileReader();
      reader.onload = () => {
      
      this.imagePreview = reader.result as string;
      };

      reader.readAsDataURL(file);

      // Upload image
      this.uploadImage(file);
    }
  }

  // Upload image to Supabase
  async uploadImage(file: File) 
  {
    // upload pfp to avatars bucket
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await this.supabaseService.uploadFileToBucket('avatars', fileName, file);

    // if error, show
    if (error) 
    {
      console.error('Error uploading image:', error);
      return;
    }

    // if no data found, show error
    if (!data?.path) 
    {
      console.error('No file path returned from upload');
      return;
    }

    // Generate URL for image
    const result = this.supabaseService.getFilePublicUrl('avatars', data.path);

    // if error, show
    if (result.error) 
    {
      console.error('Error generating public URL:', result.error);
      return;
    }

    this.imageUrl = result.publicUrl || null;
  }

  // Delete the image from Supabase
  async deleteImage() 
  {
    // if no image found, leave
    if (!this.imageUrl) return;

    // get url without full file address - just actual file name
    const fileName = this.imageUrl.split('/').pop();

    // delete from avatar bucket
    const { error } = await this.supabaseService.deleteFileFromBucket('avatars', fileName || '');

    // if error, show
    if (error) 
    {
      console.error('Error deleting image:', error);
      return;
    }

    // Clear all image related stuff
    this.imageUrl = null;
    this.imagePreview = null;
    this.imageFile = null;
  }

// Sign up
  async signup() {
    try {
      const { user, error } = await this.supabaseService.signUp(this.email, this.password);

      if (error) {
        console.error('Error signing up:', error);
        this.errorMessage = error;
        return;
      }

      if (user) {
        // Save details in profiles table
        const profile = await this.supabaseService.createProfile(
          user.id,
          this.firstName,
          this.lastName,
          this.username,
          this.imageUrl || '',
          this.cookingSkillLevel
        );

        if (profile) {
          // The AuthStateService will automatically update the auth state
          // Redirect to main app
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

