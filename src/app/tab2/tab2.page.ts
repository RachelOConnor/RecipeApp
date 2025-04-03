import { Component } from '@angular/core';
import { Router } from '@angular/router';

type Category = 'dairy' | 'meat' | 'fruit' | 'drinks';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})

export class Tab2Page {

  constructor(private router: Router) {}

  categories: Record<Category, boolean> = {
    dairy: false,
    meat: false,
    fruit: false,
    drinks: false,
  };

  toggleCategory(category: Category) {
    this.categories[category] = !this.categories[category];
  }

  meatItems = [
    { name: 'Chicken Fillets', quantity: 4, checked: false },
    { name: 'Fish Fingers', quantity: 1, checked: true },
  ];

  deleteItem(category: string, index: number) {
    if (category === 'meat') {
      this.meatItems.splice(index, 1);
    }
  }

  clearCategory(category: string) {
    if (category === 'meat') {
      this.meatItems = [];
    }
  }

  addItem(category: string) {
    console.log(`Add item to ${category}`);
    // Implement logic to add a new item to the list
  }

  goToAccountPage() {
    this.router.navigate(['/account']);
  }

}
