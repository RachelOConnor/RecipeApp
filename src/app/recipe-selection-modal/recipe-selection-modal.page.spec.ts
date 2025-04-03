import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeSelectionModalPage } from './recipe-selection-modal.page';

describe('RecipeSelectionModalPage', () => {
  let component: RecipeSelectionModalPage;
  let fixture: ComponentFixture<RecipeSelectionModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeSelectionModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
