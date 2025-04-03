import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';
import { ModalController } from '@ionic/angular'; 

import { RecipeSelectionModalPage } from '../recipe-selection-modal/recipe-selection-modal.page';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {

  userRecipes: any[] = [];
  selectedRecipes: { [key: string]: { [meal: string ]: any } } = {};
  selectedRecipeImage: { [key: string]: string } = {};
  selectedRecipeName: { [key: string]: string } = {};

  constructor(
    private router: Router, 
    private supabaseService: SupabaseService,
    private modalController: ModalController) {}

  ngOnInit() {
    this.loadUserRecipes();
  }

  goToAccountPage() {
    this.router.navigate(['/account']);
  }

  // Get recipes of user
  async loadUserRecipes() 
  {
    const user = await this.supabaseService.getUser();
    if (user) 
      {
      const { data, error } = await this.supabaseService.getRecipesByUser(user.id);

      if (error) 
      {
        console.error('Error fetching recipes:', error);
      } 
      else 
      {
        this.userRecipes = data;
      }
    }
  }

  // Open new temporary page on click
  async openRecipeModal(day: string, meal: string) {
    const modal = await this.modalController.create({
      component: RecipeSelectionModalPage,
      componentProps: {
        recipes: this.userRecipes,
        day: day,
        meal: meal
      }
    });

    // If recipe has been selected, save it to that particular day and mealtime
    modal.onDidDismiss().then((result) => 
    {
      if (result.data && result.data.selectedRecipe) 
        {
        const selectedRecipe = result.data.selectedRecipe;
        const info = `${day}-${meal}`; // shortcut kinda

        this.selectedRecipes[day] = this.selectedRecipes[day] || {};
        this.selectedRecipes[day][meal] = selectedRecipe;

        this.selectedRecipeImage[info] = selectedRecipe.image_url || '/assets/img/placeholderImg.png';
        this.selectedRecipeName[info] = selectedRecipe.recipe_name || 'Unknown Recipe';
      }
    });

    return await modal.present();
  }

  // Remove recipe from display
  remove(day: string, meal: string) 
  {
    const info = `${day}-${meal}`;

    this.selectedRecipeImage[info] = '';
    this.selectedRecipeName[info] = '';
  }

}
