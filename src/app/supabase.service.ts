import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})

export class SupabaseService 
{
  private supabase: SupabaseClient;

  constructor() 
  {
    const supabaseUrl = 'https://mdqsggfygmfryusfsztz.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcXNnZ2Z5Z21mcnl1c2ZzenR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NzM5NTEsImV4cCI6MjA1OTE0OTk1MX0.Vhz9Gwp27zRQgeKN54hzd1nY5NWOTp-nc4DkMDdOjZw';
    this.supabase = createClient(supabaseUrl, supabaseKey);
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
}

