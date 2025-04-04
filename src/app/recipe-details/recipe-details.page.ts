import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../supabase.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.page.html',
  styleUrls: ['./recipe-details.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class RecipeDetailsPage implements OnInit 
{

  recipe: any = null;

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private navCtrl: NavController,
    private router: Router
  ) { }

  // on initialisation
  async ngOnInit() 
  {
    // get id of recipe
    const id = this.route.snapshot.paramMap.get('id');

    // if id exists
    if (id) 
      {
        // get id
      const { data, error } = await this.supabaseService.getRecipeById(id);

      // if error
      if (error) 
      {
        console.error('Error fetching recipe:', error);
      } 
      else // otherwise, pull data down
      {
        this.recipe = data;
      }
    }
  }


  // edit a recipe
  editRecipe() 
  {
    // if id found
    if (this.recipe?.id) 
    {
      // navigate to page and fill with recipe details
      this.router.navigate(['/edit-recipe', this.recipe.id]);
    }
  }

// go back to home
  goBack() 
  {
    this.navCtrl.back();
  }

  // delete the recipe :(
  async deleteRecipe() 
  {
    // if id found
    if (!this.recipe?.id) return;
  
    // double check
    const confirmed = confirm('Are you sure you want to delete this recipe?');
  
    // if they confirm
    if (confirmed) 
      {
      try 
      {
        // try delete
        const { error } = await this.supabaseService.deleteRecipeById(this.recipe.id);
  
        // if error
        if (error) 
        {
          console.error('Error deleting recipe:', error.message);
          return;
        }
        // otherwise, let them know
        alert('Recipe deleted successfully.');

        // go back to home after deletion
        this.navCtrl.navigateBack('/tabs/tab1');
      } 
      // if cannot delete, throw error
      catch (err) 
      {
        console.error('Unexpected error deleting recipe:', err);
      }
    }
  }

  
}
