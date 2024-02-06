import { NgModule } from '@angular/core';
import { ContactRoutingModule } from './contacts-routing.module';
import { ContactsComponent } from './contacts.component';


@NgModule({
  declarations: [
    ContactsComponent,

  imports: [
    ContactRoutingModule,
 
  ],
  providers: [],
  bootstrap: []


]})

export class ContactModule { }