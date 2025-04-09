import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

// Page imports
import { LoginPage } from './login/login.page';
import { SignupPage } from './signup/signup.page';
import { CreateRecipePage } from './create-recipe/create-recipe.page';
import { RecipeSelectionModalPage } from './recipe-selection-modal/recipe-selection-modal.page';
import { AccountPage } from './account/account.page';
import { RecipeDetailsPage } from './recipe-details/recipe-details.page';

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
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'create-recipe',
    loadComponent: () => import('./create-recipe/create-recipe.page').then(m => m.CreateRecipePage)
  },
  {
    path: 'edit-recipe/:id',
    loadComponent: () => import('./create-recipe/create-recipe.page').then(m => m.CreateRecipePage)
  },
  {
    path: 'recipe-selection-modal',
    component: RecipeSelectionModalPage,
  },
  {
    path: 'account',
    component: AccountPage,
  },
  {
    path: 'recipe-details/:id',
    component: RecipeDetailsPage,
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
