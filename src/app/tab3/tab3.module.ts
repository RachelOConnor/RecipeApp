import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ProfilePictureComponent } from '../shared/profile-picture.component';

import { Tab3PageRoutingModule } from './tab3-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab3PageRoutingModule,
    ProfilePictureComponent
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule {}
