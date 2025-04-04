import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../supabase.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

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
  ) { }

  async ngOnInit() 
  {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) 
      {
      const { data, error } = await this.supabaseService.getRecipeById(id);

      if (error) 
      {
        console.error('Error fetching recipe:', error);
      } 
      else 
      {
        this.recipe = data;
      }
    }
  }


  goBack() {
    this.navCtrl.back();
  }
}
