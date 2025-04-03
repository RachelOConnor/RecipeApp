import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RouterModule } from '@angular/router';

import { CreateRecipePageRoutingModule } from './create-recipe-routing.module';

import { CreateRecipePage } from './create-recipe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    CreateRecipePageRoutingModule
  ],
  declarations: [CreateRecipePage]
})
export class CreateRecipePageModule {}
