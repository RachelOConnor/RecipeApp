import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { LoadingController, ToastController } from '@ionic/angular'


export interface Profile {
  id: string,
  first_name: string,
  last_name: string,
  username: string,
  profile_picture: string,
  cooking_skill_level: string
}


@Injectable({
  providedIn: 'root'
})

export class SupabaseService 
{
  private supabase: SupabaseClient;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) 
  {
    const supabaseUrl = 'https://mdqsggfygmfryusfsztz.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcXNnZ2Z5Z21mcnl1c2ZzenR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NzM5NTEsImV4cCI6MjA1OTE0OTk1MX0.Vhz9Gwp27zRQgeKN54hzd1nY5NWOTp-nc4DkMDdOjZw';
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  get user() {
    return this.supabase.auth.getUser().then(({ data }) => data?.user)
  }

  async getProfile(): Promise<Profile | null> {
    try {
      const user = await this.user;
      if (!user?.id) {
        console.error('User ID not found');
        return null;
      }
  
      const { data, error } = await this.supabase
        .from('profiles')
        .select(`
        id,
        first_name,
        last_name,
        username,
        profile_picture,
        cooking_skill_level
        `)
        .eq('id', user.id)
        .single();  // Ensure we get only one profile
  
      if (error) {
        console.error('Error fetching profile:', error.message);
        return null;
      }
  
      if (!data) {
        console.warn('No profile data found');
        return null;
      }
  
      return data as Profile; // Ensure TypeScript treats it correctly
    } catch (error: any) {
      console.error('Unexpected error fetching profile:', error.message);
      return null;
    }
  }

  async updateProfile(profile: Profile) {
    const user = await this.user
    const update = {
      ...profile,
      id: user?.id,
      updated_at: new Date(),
    }
    return this.supabase.from('profiles').upsert(update)
  }

  createLoader() {
    return this.loadingCtrl.create()
  }

  async createNotice(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 5000 })
    await toast.present()
  }

  // Sign up
  async signUp(email: string, password: string) 
  {
    try 
    {
      const { data, error } = await this.supabase.auth.signUp({ email, password });

      // If error, show it
      if (error) 
      {
        throw new Error(error.message);
      }

      // Return user from data
      return { user: data?.user, error: null };
    } 
    catch (error) 
    {
      console.error('Error signing up:', error);
      return { user: null, error: (error as Error).message };
    }
  }

  // Upload pfp to Supabase
  async uploadFileToBucket(bucket: string, fileName: string, file: File) 
  {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(fileName, file, 
      {
        cacheControl: '3600',
        upsert: false,
      });

    return { data, error };
  }

  // Get URL of pfp
  getFilePublicUrl(bucket: string, filePath: string) 
  {
    try 
    {
      const { data } = this.supabase.storage.from(bucket).getPublicUrl(filePath);

      if (!data) 
      {
        console.error('No data returned from getPublicUrl');
        return { publicUrl: '', error: 'No data returned' };
      }
    
      return { publicUrl: data.publicUrl, error: null };
    }
    catch (error) 
    {
      console.error('Error getting public URL:', error);
      return { publicUrl: '', error: (error as Error).message };
    }
  }

  async deleteFileFromBucket(bucket: string, fileName: string) 
  {
    const { error } = await this.supabase.storage.from(bucket).remove([fileName]);
    return { error };
  }

  async createProfile(
    userId: string,
    firstName: string,
    lastName: string,
    username: string,
    profilePicture: string,
    cookingSkillLevel: string
  ) {
    try 
    {
      // Insert / update profile in profiles table
      const { data, error } = await this.supabase
        .from('profiles')
        .upsert({
          id: userId,
          first_name: firstName,
          last_name: lastName,
          username: username,
          profile_picture: profilePicture,
          cooking_skill_level: cookingSkillLevel,
        });

      // If error, show it
      if (error) {
        console.error('Error creating profile:', error);
        throw new Error(error.message);
      }

      // Return data if successful
      return data;
    } 
    catch (error) 
    {
      console.error('Error creating profile:', error);
      throw error;
    }
  }


  // Sign in
  async signIn(email: string, password: string) 
  {
    try 
    {
      const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });

      // If error, show it
      if (error) 
      {
        throw new Error(error.message);
      }

      // Return user from data
      return data?.user;
    }
    catch (error) 
    {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  // Sign out method
  async signOut() 
  {
    const { error } = await this.supabase.auth.signOut();

    // If error, show it
    if (error) throw error;
  }

    // Get current user
    async getCurrentUser():  Promise<User | null> 
    {
      // Get current user if logged in
      const { data, error } = await this.supabase.auth.getUser();

      if (error) {
        console.error('Error getting user:', error.message);
        return null;
      }

      return data?.user || null;
    }

  // Get session for current user
  async getSession() 
  {
    const { data, error } = await this.supabase.auth.getSession();

    if (error) 
      {
      console.error('Error getting session:', error.message);
      return null;
    }

    return data?.session;  // Returns session or null
  }




  async uploadImage(filePath: string, file: File): Promise<string | null> {
    try {
      console.log('Uploading file to path:', filePath);

      const { data, error } = await this.supabase.storage
        .from('recipes')
        .upload(filePath, file, { upsert: true });

  
      if (error) {
        console.error('Upload error:', error.message);
        return null;
      }

      const { data: publicUrlData } = this.supabase.storage
      .from('recipes')
      .getPublicUrl(filePath);
  
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Unexpected upload error:', error);
      return null;
    }
  }

  async createRecipe(recipe: any) {
    const { data, error } = await this.supabase
      .from('recipes')
      .insert([recipe]);  // Insert a new recipe
    
      if (error) {
        return { data: null, error };  // Return error if it occurs
      }
      return { data, error: null };  // Return data if successful
    }

    async getUser() {
      const { data, error } = await this.supabase.auth.getUser();
      return data?.user || null;
    }

  async getUserRecipes(userId: string) {
    const { data, error } = await this.supabase
      .from('recipes')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error('Failed to load recipes: ' + error.message);
    }
    return data;
  }

  getRecipesByUser(userId: string) {
    return this.supabase.from('recipes').select('*').eq('user_id', userId);
  }

  async getRecipeById(id: string) 
  {
    return this.supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();
  }


}

