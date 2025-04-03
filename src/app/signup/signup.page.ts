import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../supabase.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(private supabaseService: SupabaseService, private router: Router) {}
  
  // If image has been selected
  onImageSelected(event: any) 
  {
    const file: File = event.target.files[0];

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
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await this.supabaseService.uploadFileToBucket('avatars', fileName, file);

    if (error) 
    {
      console.error('Error uploading image:', error);
      return;
    }

    if (!data?.path) 
    {
      console.error('No file path returned from upload');
      return;
    }

    // Generate URL for image
    const result = this.supabaseService.getFilePublicUrl('avatars', data.path);

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
      if (!this.imageUrl) return;
  
      const fileName = this.imageUrl.split('/').pop();
  
      const { error } = await this.supabaseService.deleteFileFromBucket('avatars', fileName || '');
  
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
          this.imageUrl || '',
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

