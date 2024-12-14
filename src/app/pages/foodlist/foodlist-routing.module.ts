import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodlistPage } from './foodlist.page';

const routes: Routes = [
  {
    path: '',
    component: FoodlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoodlistPageRoutingModule {}
