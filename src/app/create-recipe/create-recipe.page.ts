import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';

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

  constructor(
    private navCtrl: NavController,
    private supabaseService: SupabaseService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.back();
  }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imageFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file); // Preview the selected image
    }
  }

  removeImage() {
    this.imagePreview = null;
    this.imageFile = null;
  }

  async createRecipe() {
    if (!this.recipeName || !this.ingredients || !this.method) {

      console.error("Please fill out all required fields.");
      return;
    }

    const user = await this.supabaseService.getUser();
    if (!user) {
      console.error('User not logged in.');
      return;
    }

    if (user) {
      let imageUrl = '';

      if (this.imageFile) {
        const filePath = `recipes/${user.id}/${this.imageFile.name}`;
        const imagePath = await this.supabaseService.uploadImage(filePath, this.imageFile);
      
        if (!imagePath) {
          console.error('Error uploading image');
          alert('Failed to upload image');
          return;
        }
      
        imageUrl = imagePath; // Store only the path in the database
      }

    if (!user) {
      console.error('User not logged in.');
      return;
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
      user_id: user.id,  // Link the recipe to the current user
    };

    try {

      const result = await this.supabaseService.createRecipe(recipe);

      if (result.error) {
        console.error('Error creating recipe:', result.error.message);
        return;
      }

      console.log('Recipe created successfully!', result.data);
      this.navCtrl.navigateBack('/tabs/tab1');  // Navigate back to tab1 after creation
    } catch (err) {
      console.error('Error creating recipe:', err);
    }
  }
}

}
