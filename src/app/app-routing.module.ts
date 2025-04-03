import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from './auth.guard';

// Page imports
import { LoginPage } from './login/login.page';
import { SignupPage } from './signup/signup.page';
import { CreateRecipePage } from './create-recipe/create-recipe.page';
import { RecipeSelectionModalPage } from './recipe-selection-modal/recipe-selection-modal.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login', 
    pathMatch: 'full'
  },
  {
    // Use component instead of loadChildren for standalone pages
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'signup',
    component: SignupPage,
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'create-recipe',
    component: CreateRecipePage,
  },
  {
    path: 'recipe-selection-modal',
    component: RecipeSelectionModalPage,
  },
  // {
  //   path: 'recipe-selection-modal',
  //   loadChildren: () => import('./recipe-selection-modal/recipe-selection-modal.module').then( m => m.RecipeSelectionModalPageModule)
  // },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
