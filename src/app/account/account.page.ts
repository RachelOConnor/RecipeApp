import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Router } from '@angular/router';
import { Profile, SupabaseService } from '../supabase.service';
import { AuthStateService } from '../auth-state.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AccountPage implements OnInit {
  
  profile: Profile = {
    id: '',
    first_name: '',
    last_name: '',
    username: '',
    profile_picture: '',
    cooking_skill_level: ''
  }

  email: string = '';
  imagePreview: string | null = null;

  constructor(
    private readonly supabase: SupabaseService,
    private authStateService: AuthStateService,
    private router: Router
  ) { }

  // on initialisation
  ngOnInit() 
  {
    this.getEmail()
    this.getProfile()
  }

  // get users email
  async getEmail() 
  {
    this.email = await this.supabase.user.then((user) => user?.email || '')
  }

  // get users profile info
  async getProfile() 
  {
    try 
    {
      // get profile
      const profileResponse  = await this.supabase.getProfile();

      // show profile data
      console.log('Profile response:', profileResponse);

      // if no profile found, show error
      if (!profileResponse) 
      {
        console.warn('No profile data received');
        return;
      }

      // otherwise, assign existing data to variables
      this.profile = 
      {
        id: profileResponse.id ?? '',
        first_name: profileResponse.first_name ?? '',
        last_name: profileResponse.last_name ?? '',
        username: profileResponse.username ?? '',
        profile_picture: profileResponse.profile_picture ?? '',
        cooking_skill_level: profileResponse.cooking_skill_level ?? '',
      };

      // if the pfp exists, put it in
      this.imagePreview = this.profile.profile_picture || null;

    } 
    catch (error: any) 
    {
      console.error('Error fetching profile:', error.message);
      alert(error.message);
    }
  }

  // handle image file input
  onImageSelected(event: any) 
  {
    const file: File = event.target.files[0];

    // if file found
    if (file) 
      {
        // preview it
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Upload image
      this.uploadImage(file);
    }
  }

  // upload the image to Supabase and get the URL
  async uploadImage(file: File) 
  {
    // get pfp from avatar bucket
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await this.supabase.uploadFileToBucket('avatars', fileName, file);

    // if error, show
    if (error) 
    {
      console.error('Error uploading image:', error);
      return;
    }

    // if no data, show error
    if (!data?.path) 
    {
      console.error('No file path returned from upload');
      return;
    }

    // otherwise, let pfp url = result
    const result = this.supabase.getFilePublicUrl('avatars', data.path);

    // if error getting url, show error
    if (result.error) 
    {
      console.error('Error generating public URL:', result.error);
      return;
    }

    this.profile.profile_picture = result.publicUrl || "";
    // Update the global profile picture
    this.authStateService.updateProfilePicture(this.profile.profile_picture);
  }

  // Remove the image
  async deleteImage() 
  {
    // if no image, leave
    if (!this.profile.profile_picture) return;

    // splits string - only info after /, removes last element
    const fileName = this.profile.profile_picture.split('/').pop();
    const { error } = await this.supabase.deleteFileFromBucket('avatars', fileName || '');

    // if error deleting image, show error
    if (error) 
    {
      console.error('Error deleting image:', error);
      return;
    }

    // return to null
    this.profile.profile_picture = '';
    this.imagePreview = null;
    // Update the global profile picture
    this.authStateService.updateProfilePicture(null);
  }

  // update profile
  async updateProfile() 
  {
    // open editing page
    const loader = await this.supabase.createLoader()
    await loader.present()

    try 
    {
      const { error } = await this.supabase.updateProfile({ ...this.profile});

      // if error updating, show
      if (error) 
      {
        throw error;
      }

      // Update the global profile picture
      this.authStateService.updateProfilePicture(this.profile.profile_picture);

      // close editing page, show success
      await loader.dismiss();
      await this.supabase.createNotice('Profile updated!');
    } 
    catch (error: any) 
    {
      await loader.dismiss()
      await this.supabase.createNotice(error.message)
    }
  }

  // sign out
  async signOut() 
  {
    console.log('signed out')
    await this.supabase.signOut()
    // The AuthStateService will automatically update the auth state
    this.router.navigate(['/login'], { replaceUrl: true })
  }

  goToTab1() 
  {
    this.router.navigate(['/tabs/tab1']);
  }
}
