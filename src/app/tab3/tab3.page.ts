import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';
import { ModalController } from '@ionic/angular';
import { RecipeSelectionModalPage } from '../recipe-selection-modal/recipe-selection-modal.page';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false
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

  // load meal planner on view
  async ngOnInit() {
    await this.loadUserRecipes();
  }

  // Get recipes of user
  async loadUserRecipes() 
  {
    const user = await this.supabaseService.getUser();

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
        this.userRecipes = data;
      }
    }
  }

  // Open new temporary page on click
  async openRecipeModal(day: string, meal: string) 
  {
    // create popup to choose meal for that time and day
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

        // let selected recipe = that day and that meal
        this.selectedRecipes[day] = this.selectedRecipes[day] || {};
        this.selectedRecipes[day][meal] = selectedRecipe;

        // return image and name of recipe if possible to display
        this.selectedRecipeImage[info] = selectedRecipe.image_url || 'https://ionicframework.com/docs/img/demos/card-media.png';
        this.selectedRecipeName[info] = selectedRecipe.recipe_name || 'Unknown Recipe';
      }
    });

    // show modal
    return await modal.present();
  }

  // Remove recipe from display
  remove(day: string, meal: string) 
  {
    const info = `${day}-${meal}`;

    // remove image and name
    this.selectedRecipeImage[info] = '';
    this.selectedRecipeName[info] = '';
  }

}
