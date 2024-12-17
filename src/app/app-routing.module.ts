import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [authGuard],
    data: { title: 'Home' }, 
  },
  {
    path: 'event-details/:fecha',
    loadChildren: () => import('./pages/event-details/event-details.module').then( m => m.EventDetailsPageModule),
    canActivate: [authGuard],
    data: { title: 'Registrar evento'}, 
  },
  {
    path: 'foodlist',
    loadChildren: () => import('./pages/foodlist/foodlist.module').then( m => m.FoodlistPageModule),
    canActivate: [authGuard],
    data: { title: 'Platos' }, 
  },
  {
    path: 'events',
    loadChildren: () => import('./pages/events/events.module').then( m => m.EventsPageModule),
    canActivate: [authGuard],
    data: { title: 'Eventos' }, 
  },
  {
    path: 'worker',
    loadChildren: () => import('./pages/worker/worker.module').then( m => m.WorkerPageModule),
    canActivate: [authGuard],
    data: { title: 'Trabajadores' }, 
  },
  {
    path: 'details',
    loadChildren: () => import('./pages/details/details.module').then( m => m.DetailsPageModule),
    canActivate: [authGuard],
    data: { title: 'Detalles' }, 
  },
  {
    path: 'event-edit/:fecha',
    loadChildren: () => import('./pages/event-edit/event-edit.module').then( m => m.EventEditPageModule),
    canActivate: [authGuard],
    data: {title: 'Editar'}
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule),
    data: { title: 'Ingresar' }, 
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register.module').then( m => m.RegisterPageModule),
    data: { title: 'Registro' }, 
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/auth/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [authGuard],
    data: { title: 'Perfil' }, 
  },
  {
    path: 'pendientes',
    loadChildren: () => import('./pages/pendientes/pendientes.module').then( m => m.PendientesPageModule),
    data: {title: 'Pendientes'}
  },
  {
    path: 'reporte',
    loadChildren: () => import('./pages/reporte/reporte.module').then( m => m.ReportePageModule),
    canActivate: [authGuard],
    data: {title: 'Reportes'}
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
