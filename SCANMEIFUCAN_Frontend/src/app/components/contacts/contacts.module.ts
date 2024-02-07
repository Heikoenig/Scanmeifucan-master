import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ContactRoutingModule } from './contacts-routing.module';
import { ContactsComponent } from './contacts.component';
import { WebcamModule } from 'ngx-webcam';


@NgModule({
  declarations: [
    ContactsComponent
  ],
  imports: [
    ContactRoutingModule,
    SharedModule,
    WebcamModule,
  ],
  providers: [],
  bootstrap: []
})
export class ContactModule { }