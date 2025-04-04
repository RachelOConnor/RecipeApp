import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.page.html',
  styleUrls: ['./create-recipe.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class CreateRecipePage implements OnInit {

  recipeName: string = '';
  author: string = '';
  prepTime: number | null = null;
  cookTime: number | null = null;
  serves: number | null = null;
  ingredients: string = '';
  method: string = '';
  utensils: string = '';
  notes: string = '';
  imageFile: File | null = null;
  imagePreview: string | null = null;

  editMode = false;
  recipeId: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private supabaseService: SupabaseService,
    private router: Router
  ) { }

  // on initialisation
  async ngOnInit() 
  {
    // get id of recipe
    this.recipeId = this.route.snapshot.paramMap.get('id');
    this.editMode = !!this.recipeId;

    // if in edit mode and id found
    if (this.editMode && this.recipeId) 
    {
      // get id
      const { data, error } = await this.supabaseService.getRecipeById(this.recipeId);

      // if error, show
      if (error) 
      {
        console.error('Error fetching recipe:', error);
        return;
      }

      // prefill form with existing recipe
      this.recipeName = data.recipe_name;
      this.author = data.author;
      this.prepTime = data.prep_time;
      this.cookTime = data.cook_time;
      this.serves = data.serves;
      this.ingredients = data.ingredients;
      this.method = data.method;
      this.utensils = data.utensils;
      this.notes = data.notes;
      this.imagePreview = data.image_url;
    }
  }

  // navigate back to home
  goBack() 
  {
    this.navCtrl.back();
  }

  // when file selected
  onImageSelected(event: any) 
  {
    const file: File = event.target.files[0];

    // if file selected
    if (file) 
    {
      // let file = file selected
      this.imageFile = file;

      const reader = new FileReader();

      reader.onload = () => 
      {
        this.imagePreview = reader.result as string;
      };

      // preview
      reader.readAsDataURL(file);
    }
  }

  // remove image
  removeImage() 
  {
    this.imagePreview = null;
    this.imageFile = null;
  }

  // save / create recipe
  async saveRecipe() 
  {
    // required fields
    if (!this.recipeName || !this.author || !this.ingredients || !this.method) 
    {
      console.error("Please fill out all required fields.");
      return;
    }

    // get user
    const user = await this.supabaseService.getUser();

    // if user not found
    if (!user) 
    {
      console.error('User not logged in.');
      return;
    }

    let imageUrl = this.imagePreview;

    // if file selected
    if (this.imageFile) 
    {
      // upload
      const filePath = `recipes/${user.id}/${this.imageFile.name}`;
      const imagePath = await this.supabaseService.uploadImage(filePath, this.imageFile);
    
      // if no image
      if (!imagePath) 
      {
        console.error('Error uploading image');
        alert('Failed to upload image');
        return;
      }
    
      imageUrl = imagePath;
    }


    const recipe = {
      recipe_name: this.recipeName,
      author: this.author,
      prep_time: this.prepTime,
      cook_time: this.cookTime,
      serves: this.serves,
      ingredients: this.ingredients,
      method: this.method,
      utensils: this.utensils,
      notes: this.notes,
      image_url: imageUrl,
      user_id: user.id,
    };

    console.log('Updated recipe data to be saved:', recipe);

    try 
    {
      // edit mode
      if (this.editMode && this.recipeId)
      {
        // update recipe
        const result = await this.supabaseService.updateRecipe(this.recipeId, recipe);

        if (result.error) 
        {
          console.error('Error updating recipe:', result.error.message);
          return;
        }

        console.log('Recipe updated successfully!', result.data);
      }
      else // create Mode
      {
        const result = await this.supabaseService.createRecipe(recipe);

        // if error, throw error
        if (result.error) 
        {
          console.error('Error creating recipe:', result.error.message);
          return;
        }

        console.log('Recipe created successfully!', result.data);
        alert('Recipe created!');
      }
      // go back home after save/creation
      this.navCtrl.navigateBack('/tabs/tab1'); 
    } 
    // throw error otherwise
    catch (err)
    {
      console.error('Unexpected error', err);
    }
  }
}
