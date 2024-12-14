import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AddworkerComponent } from './components/addworker/addworker.component';
import { AddsuplierComponent } from './components/addsuplier/addsuplier.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { LogoComponent } from './components/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { AddfoodsComponent } from './components/addfoods/addfoods.component';
import { NumberofpeopleComponent } from './components/numberofpeople/numberofpeople.component';
import { ExtrasComponent } from './components/extras/extras.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { RouterModule } from '@angular/router';
import { ToggleThemeComponent } from './components/toggle-theme/toggle-theme.component';
import { AddPendienteModalComponent } from './components/add-pendiente-modal/add-pendiente-modal.component';




import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    AddworkerComponent,
    AddsuplierComponent,
    CalendarioComponent,
    LogoComponent,
    AddfoodsComponent,
    NumberofpeopleComponent,
    ExtrasComponent,
    SidemenuComponent,
    ToggleThemeComponent,
    AddPendienteModalComponent,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    AddworkerComponent,
    AddsuplierComponent,
    CalendarioComponent,
    LogoComponent,
    AddfoodsComponent,
    NumberofpeopleComponent,
    ExtrasComponent,
    ReactiveFormsModule,
    SidemenuComponent,
    ToggleThemeComponent,
    AddPendienteModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule // <--- AGREGA ESTO
  ]
})
export class SharedModule { }
