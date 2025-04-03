import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recipe-selection-modal',
  templateUrl: './recipe-selection-modal.page.html',
  styleUrls: ['./recipe-selection-modal.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class RecipeSelectionModalPage implements OnInit {

  @Input() recipes: any[] = []; 
  @Input() day: string = ""; 
  @Input() meal: string = ""; 

  searchTerm: string = "";

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  // Search recipes - if have large number
  get filteredRecipes() 
  {
    return this.recipes.filter(recipe => recipe.recipe_name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  // Go back to other page
  dismiss()
  {
    this.modalController.dismiss();
  }

  // Recipe selected
  selectRecipe(recipe: any)
  {
    this.modalController.dismiss({ selectedRecipe: recipe });
  }

}
