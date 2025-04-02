import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

// Page imports
import { LoginPage } from './login/login.page';
import { SignupPage } from './signup/signup.page';

const routes: Routes = [
  {
    // Use component instead of loadChildren for standalone pages
    path: '',
    // component: LoginPage,
    redirectTo: '/login', 
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'signup',
    component: SignupPage,
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard] // Protect tabs page from unauthorized users
  },
  {
    path: 'tabs/tab1',
    loadChildren: () => import('./tab1/tab1.module').then(m => m.Tab1PageModule),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
