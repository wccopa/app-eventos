import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventEditPageRoutingModule } from './event-edit-routing.module';

import { EventEditPage } from './event-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventEditPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EventEditPage]
})
export class EventEditPageModule {}
