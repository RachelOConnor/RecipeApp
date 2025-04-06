import { Component, OnInit } from '@angular/core';
import { SupabaseService, ShoppingItem } from '../supabase.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

type Category =
  | 'dairy'
  | 'meat'
  | 'fruit'
  | 'vegetables'
  | 'bakery'
  | 'sauces & spices'
  | 'snacks'
  | 'frozen'
  | 'drinks'
  | 'health & household'
  | 'other';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})

export class Tab2Page implements OnInit
{
  categories: Record<Category, boolean> = {
    dairy: false,
    meat: false,
    fruit: false,
    vegetables: false,
    bakery: false,
    'sauces & spices': false,
    'snacks': false,
    frozen: false,
    drinks: false,
    'health & household': false,
    other: false,
  };

  itemsByCategory: Record<Category, ShoppingItem[]> = {
    dairy: [],
    meat: [],
    fruit: [],
    vegetables: [],
    bakery: [],
    'sauces & spices': [],
    'snacks': [],
    frozen: [],
    drinks: [],
    'health & household': [],
    other: [],
  };

  constructor(
    private router: Router,
    private supabase: SupabaseService,
    private alertCtrl: AlertController,
    private changeDetect: ChangeDetectorRef ) {}

  // on init
  async ngOnInit() 
  {
    await this.loadShoppingItems();
  }
  
  // open category
  toggleCategory(category: Category) 
  {
    this.categories[category] = !this.categories[category];
  }
  
  // load existing items
  async loadShoppingItems() 
  {
    const items = await this.supabase.getShoppingItems();

    // if items are there
    if (items) 
      {
      // group by category
        for (const category in this.itemsByCategory) 
        {
        this.itemsByCategory[category as Category] = items.filter(
          (item) => item.category === category
        );
      }
    }
  }
  
  // add item to category selected
  async addItem(category: Category) 
  {
    // create popup to add item
    const alert = await this.alertCtrl.create({
      header: `Add item to ${category}`,
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Item name',
        },
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'Quantity',
          min: 1,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Add',
          handler: async (data) => {

            const name = data.name?.trim();
            const quantity = parseInt(data.quantity, 10);
  
            // if no name or quantity is not filled, return error
            if (!name || isNaN(quantity) || quantity <= 0) 
              {
              this.supabase.createNotice('Please enter a valid name and quantity.');
              return false;
            }

            // add new item
            const newItem: ShoppingItem = 
            {
              name: data.name,
              quantity: Number(data.quantity),
              category,
              checked: false,
            };

            // add new item
            const { data: added, error } = await this.supabase.addShoppingItem(newItem);
            if (error) 
            {
              this.supabase.createNotice('Error adding item.');
              return false;
            }
            else if (added)
            {
              // refresh
              this.loadShoppingItems();
              return true;
            }
            return false;
          },
        },
      ],
    });

    await alert.present();
  }

  // delete item
  async deleteItem(category: Category, itemId: string) 
  {
    const { error } = await this.supabase.deleteShoppingItem(itemId);
    // if no error, continue
    if (!error) 
    {
      this.itemsByCategory[category] = this.itemsByCategory[category].filter
      (
        (item) => item.id !== itemId
      );
    }
  }
  
  // check off / on item
  async toggleItem(item: ShoppingItem) 
  {
    const originalChecked = item.checked;
    item.checked = !item.checked;

    // update number checked off immediately - deal with errors later
    this.changeDetect.detectChanges();

    const { error } = await this.supabase.updateShoppingItem(item);

    // if error updating
    if (error) 
    {
      item.checked = originalChecked;
      console.error('Error updating item:', error);
    }
  }
  
  // delete everything from the one category
  async clearCategory(category: Category) 
  {
    // get all items of category
    const items = this.itemsByCategory[category];
    // for all items
    for (const item of items) 
      {
        // if item exists, delete
        if (item.id) 
        {
          await this.supabase.deleteShoppingItem(item.id);
        }
    }
    this.itemsByCategory[category] = [];
  }

  // get how many items are checked off
  getCompletedItemsCount(category: Category): number 
  {
    const items = this.itemsByCategory[category];
    // where checked = true
    return items.filter(item => item.checked).length;
  }
  
  // get total number of items
  getTotalItemsCount(category: Category): number 
  {
    const items = this.itemsByCategory[category];
    return items.length;
  }

  castCategory(value: string): Category 
  {
    return value as Category;
  }

  goToAccountPage() 
  {
    this.router.navigate(['/account']);
  }
  

}
