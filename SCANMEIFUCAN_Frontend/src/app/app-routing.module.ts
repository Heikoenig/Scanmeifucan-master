import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule) },
  { path: 'contacts', loadChildren: () => import('./components/contacts/contacts.module').then(m => m.ContactModule) },
  { path: 'destinations', loadChildren: () => import('./components/destinations/destination.module').then(m => m.DestinationModule) },
  { path: 'privacy', loadChildren: () => import('./components/privacy/privacy.module').then(m => m.PrivacyModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
