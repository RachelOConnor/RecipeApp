import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipeSelectionModalPageRoutingModule } from './recipe-selection-modal-routing.module';

import { RecipeSelectionModalPage } from './recipe-selection-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipeSelectionModalPageRoutingModule
  ],
  declarations: [RecipeSelectionModalPage]
})
export class RecipeSelectionModalPageModule {}
