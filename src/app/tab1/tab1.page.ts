import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false
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

  // load recipes on view
  ionViewWillEnter() {
    this.loadRecipes();
  }

  // load recipes
  async loadRecipes() 
  {
    const user = await this.supabaseService.user;  // Get the current user
    console.log('User ID:', user ? user.id : 'No user logged in');

    // if user found
    if (user) 
    {
      // get their recipes
      const { data, error } = await this.supabaseService.getRecipesByUser(user.id);

      // if error, show
      if (error) 
      {
        console.error('Error fetching recipes:', error);
      } 
      else 
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

  // filter recipes by search
  get filteredRecipes() 
  {
    // convert everything to lowercase - easier to search
    return this.recipes.filter(recipe =>
      recipe.recipe_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // on init
  async ngOnInit() 
  {
    // get user
    const user = await this.supabaseService.user;

    // if user found, show their recipes
    if (user) 
    {
      this.loadRecipes();
    }
  }

  // show total time of prep and cooking
  getTotalTimeFormatted(recipe: any): string 
  {
    // combine to one time
    const totalMinutes = Number(recipe.prep_time) + Number(recipe.cook_time);
    // get hours if possible
    const hours = Math.floor(totalMinutes / 60);
    // remainder is minutes
    const minutes = totalMinutes % 60;
  
    // if hours and mins available, show
    if (hours > 0 && minutes > 0) 
    {
      return `${hours}h ${minutes}m`;
    } 
    // just hours
    else if (hours > 0) 
    {
      return `${hours}h`;
    } 
    // just mins
    else 
    {
      return `${minutes}m`;
    }
  }

  // view recipe on click
  goToRecipeDetails(recipeId: string) {
    this.router.navigate(['/recipe-details', recipeId]);
  }

}