import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoodlistPage } from './foodlist.page';

describe('FoodlistPage', () => {
  let component: FoodlistPage;
  let fixture: ComponentFixture<FoodlistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
