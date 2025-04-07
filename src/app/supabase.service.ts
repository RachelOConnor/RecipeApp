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

export interface ShoppingItem {
  id?: string;
  user_id?: string;
  name: string;
  quantity: number;
  category: string;
  checked: boolean;
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

  // get user
  get user() {
    return this.supabase.auth.getUser().then(({ data }) => data?.user)
  }

  // get profile 
  async getProfile(): Promise<Profile | null> 
  {
    try 
    {
      // get user
      const user = await this.user;

      // if no user id found
      if (!user?.id) 
      {
        console.error('User ID not found');
        return null;
      }
  
      // get info from table
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
        .single();
  
        // if error, showw
      if (error) 
      {
        console.error('Error fetching profile:', error.message);
        return null;
      }
  
      // if no data, show error
      if (!data) 
      {
        console.warn('No profile data found');
        return null;
      }
  
      return data as Profile;

    }
    catch (error: any) 
    {
      console.error('Unexpected error fetching profile:', error.message);
      return null;
    }
  }

  // update profile
  async updateProfile(profile: Profile) 
  {
    const user = await this.user

    // update profile table with new info, update time
    const update = 
    {
      ...profile,
      id: user?.id,
      updated_at: new Date(),
    }
    return this.supabase.from('profiles').upsert(update)
  }

  createLoader() 
  {
    return this.loadingCtrl.create()
  }

  async createNotice(message: string) 
  {
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

  // delete files from bucket in supabase
  async deleteFileFromBucket(bucket: string, fileName: string) 
  {
    const { error } = await this.supabase.storage.from(bucket).remove([fileName]);
    return { error };
  }

  // create new profile
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

      // if error, show
      if (error) 
      {
        console.error('Error getting user:', error.message);
        return null;
      }

      return data?.user || null;
    }

  // Get session for current user
  async getSession() 
  {
    const { data, error } = await this.supabase.auth.getSession();

    // if error, show
    if (error) 
      {
      console.error('Error getting session:', error.message);
      return null;
    }

    return data?.session;
  }

  // upload image
  async uploadImage(filePath: string, file: File): Promise<string | null> {
    try 
    {
      console.log('Uploading file to path:', filePath);

      // upload to recipes bucket
      const { data, error } = await this.supabase.storage
        .from('recipes')
        .upload(filePath, file, { upsert: true });

      // if error, show
      if (error) 
      {
        console.error('Upload error:', error.message);
        return null;
      }

      // uplpad url
      const { data: publicUrlData } = this.supabase.storage
      .from('recipes')
      .getPublicUrl(filePath);
  
      return publicUrlData.publicUrl;
    } 
    catch (error) 
    {
      console.error('Unexpected upload error:', error);
      return null;
    }
  }

    ////////! CREATE RECIPE FUNCTIONS /////////

  // create recipe
  async createRecipe(recipe: any) 
  {
    // upload to recipes table
    const { data, error } = await this.supabase
      .from('recipes')
      .insert([recipe]);
    
      // if error, show error w data
      if (error) 
      {
        return { data: null, error };
      }
      return { data, error: null };
    }

  // get user
  async getUser() 
  {
    const { data, error } = await this.supabase.auth.getUser();
    return data?.user || null;
  }

  // get existing recipes
  async getUserRecipes(userId: string) 
  {
    // get data from recipes table based on id
    const { data, error } = await this.supabase
      .from('recipes')
      .select('*')
      .eq('user_id', userId);

    // if error, show
    if (error) 
    {
      throw new Error('Failed to load recipes: ' + error.message);
    }
    return data;
  }

  // get recipes based on user
  getRecipesByUser(userId: string) 
  {
    return this.supabase.from('recipes').select('*').eq('user_id', userId);
  }

  // get recipe by id
  async getRecipeById(id: string) 
  {
    // return id based on matching id from table - one result only
    return this.supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();
  }

  // delete recipe
  async deleteRecipeById(recipeId: string) 
  {
    // delete based on matching id from table
    const { error } = await this.supabase
      .from('recipes')
      .delete()
      .eq('id', recipeId);
  
    return { error };
  }

// update existing recipe
  async updateRecipe(recipeId: string, updatedRecipe: any) 
  {
    // show id and data of recipe
    console.log('Updating recipe with ID:', recipeId);
    console.log('Updated recipe data:', updatedRecipe);

    // update recipe based on matching id from table 
    const { data, error } = await this.supabase
      .from('recipes')
      .update(updatedRecipe)
      .eq('id', recipeId);
  
    // if error, show error
    if (error) {
      console.error('Error updating recipe:', error);
      return { data: null, error };
    }

    console.log('Updated recipe data returned:', data);
  
    return { data, error: null };
  }

  ////////! SHOPPING LIST FUNCTIONS /////////

  // get all of user's items
async getShoppingItems(): Promise<ShoppingItem[] | null> 
{
  // get user first
  const user = await this.getUser();
  // if no user, nothing
  if (!user) return null;

  // get items from table based on user id
  const { data, error } = await this.supabase
    .from('shopping_items')
    .select('*')
    .eq('user_id', user.id);

  // if error, show
  if (error) 
  {
    console.error('Error fetching shopping items:', error.message);
    return null;
  }
  // return items / null
  return data;
}

// add to shopping list
async addShoppingItem(item: ShoppingItem) 
{
  // get user
  const user = await this.getUser();
  // if none, say so
  if (!user) return { data: null, error: 'User not logged in' };

  // insert to row of matching id
  const { data, error } = await this.supabase
    .from('shopping_items')
    .insert([{ ...item, user_id: user.id }])
    .select()
    .single();

  // if error, show
  if (error) 
  {
    console.error('Error adding item:', error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

// delete item
async deleteShoppingItem(itemId: string) 
{
  // get items by id and delete
  const { error } = await this.supabase
    .from('shopping_items')
    .delete()
    .eq('id', itemId);

  // if error, show
  if (error) 
  {
    console.error('Error deleting item:', error.message);
  }

  return { error };
}

// update item - check it off
async updateShoppingItem(item: ShoppingItem) 
{
  // if no item, show error
  if (!item.id) return { error: 'No ID provided', data: null };

  // get items based on id and check off
  const { data, error } = await this.supabase
    .from('shopping_items')
    .update({ checked: item.checked })
    .eq('id', item.id);

  // if error, show
  if (error) 
  {
    console.error('Error updating item:', error.message);
  }

  return { data, error };
}
}

