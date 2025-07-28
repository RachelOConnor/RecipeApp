import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthStateService } from '../auth-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-picture',
  template: `
    <div (click)="goToAccountPage()" class="profile-picture-container">
      <img 
        *ngIf="profilePicture" 
        [src]="profilePicture" 
        alt="Profile Picture"
        class="profile-picture-img"
        (error)="onImageError()"
      />
      <ion-icon 
        *ngIf="!profilePicture" 
        name="person-circle" 
        class="profile-picture-icon">
      </ion-icon>
    </div>
  `,
  styles: [`
    .profile-picture-container {
      margin-right: 10%;
      margin-top: 40%;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background: transparent;
    }

    .profile-picture-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid white;
    }

    .profile-picture-icon {
      font-size: 50px;
      color: #ffffff;
    }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ProfilePictureComponent implements OnInit, OnDestroy {
  profilePicture: string | null = null;
  private subscription: Subscription | null = null;

  constructor(
    private authStateService: AuthStateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription = this.authStateService.profilePicture$.subscribe(
      (picture) => {
        this.profilePicture = picture;
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  goToAccountPage() {
    this.router.navigate(['/account']);
  }

  onImageError() {
    // If the image fails to load, fall back to the icon
    this.profilePicture = null;
  }
} 