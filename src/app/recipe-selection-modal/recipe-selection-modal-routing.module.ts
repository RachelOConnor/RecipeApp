import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipeSelectionModalPage } from './recipe-selection-modal.page';

const routes: Routes = [
  {
    path: '',
    component: RecipeSelectionModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipeSelectionModalPageRoutingModule {}
