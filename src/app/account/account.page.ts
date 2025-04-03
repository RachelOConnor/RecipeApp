import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Router } from '@angular/router';
import { Profile, SupabaseService } from '../supabase.service';

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
    private router: Router
  ) { }

  ngOnInit() 
  {
    this.getEmail()
    this.getProfile()
  }

  async getEmail() 
  {
    this.email = await this.supabase.user.then((user) => user?.email || '')
  }

  async getProfile() 
  {
    try {
      const profileResponse  = await this.supabase.getProfile();

      console.log('Profile response:', profileResponse);

      if (!profileResponse) 
      {
        console.warn('No profile data received');
        return;
      }


      this.profile = {
        id: profileResponse.id ?? '',
        first_name: profileResponse.first_name ?? '',
        last_name: profileResponse.last_name ?? '',
        username: profileResponse.username ?? '',
        profile_picture: profileResponse.profile_picture ?? '',
        cooking_skill_level: profileResponse.cooking_skill_level ?? '',
      };

      // If the pfp exists, put it in
      this.imagePreview = this.profile.profile_picture || null;

    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
      alert(error.message);
    }
  }

  // Handle the image file input
  onImageSelected(event: any) 
  {
    const file: File = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Upload image
      this.uploadImage(file);
    }
  }

      // Upload the image to Supabase and get the URL
  async uploadImage(file: File) {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await this.supabase.uploadFileToBucket('avatars', fileName, file);

    if (error) {
      console.error('Error uploading image:', error);
      return;
    }

    if (!data?.path) {
      console.error('No file path returned from upload');
      return;
    }

    const result = this.supabase.getFilePublicUrl('avatars', data.path);

    if (result.error) {
      console.error('Error generating public URL:', result.error);
      return;
    }

    this.profile.profile_picture = result.publicUrl || "";
  }

  // Remove the image
  async deleteImage() {
    if (!this.profile.profile_picture) return;

    const fileName = this.profile.profile_picture.split('/').pop();
    const { error } = await this.supabase.deleteFileFromBucket('avatars', fileName || '');

    if (error) {
      console.error('Error deleting image:', error);
      return;
    }

    this.profile.profile_picture = '';
    this.imagePreview = null;
  }

  async updateProfile() {
    const loader = await this.supabase.createLoader()
    await loader.present()

    try {
      const { error } = await this.supabase.updateProfile({ ...this.profile});

      if (error) {
        throw error
      }

      await loader.dismiss()
      await this.supabase.createNotice('Profile updated!')
    } catch (error: any) {
      await loader.dismiss()
      await this.supabase.createNotice(error.message)
    }
  }

  async signOut() {
    console.log('signed out')
    await this.supabase.signOut()
    this.router.navigate(['/'], { replaceUrl: true })
  }

  goToTab1() {
    this.router.navigate(['/tabs/tab1']);
  }
}
