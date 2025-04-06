import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {

  recipes: any[] = [];
  searchTerm: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router) {}

  goToCreateRecipe() {
    this.router.navigate(['/create-recipe']);
  }

  goToAccountPage() {
    this.router.navigate(['/account']);
  }

  ionViewWillEnter() {
    this.loadRecipes();
  }

  async loadRecipes() {
    const user = await this.supabaseService.user;  // Get the current user
    console.log('User ID:', user ? user.id : 'No user logged in');

    if (user) 
      {
      const { data, error } = await this.supabaseService.getRecipesByUser(user.id);

      if (error) 
      {
        console.error('Error fetching recipes:', error);
      } else 
      {
        console.log('Fetched recipes:', data);
        this.recipes = data;
      }
    }
    else 
    {
      console.log('No user found');
    }
  }

  get filteredRecipes() 
  {
    return this.recipes.filter(recipe =>
      recipe.recipe_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  async ngOnInit() {
    const user = await this.supabaseService.user;
    if (user) {
      this.loadRecipes();
    }
  }

  getTotalTimeFormatted(recipe: any): string {
    const totalMinutes = Number(recipe.prep_time) + Number(recipe.cook_time);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  }

  goToRecipeDetails(recipeId: string) {
    this.router.navigate(['/recipe-details', recipeId]);
  }

}