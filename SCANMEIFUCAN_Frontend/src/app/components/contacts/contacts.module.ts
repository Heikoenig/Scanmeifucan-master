import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ContactRoutingModule } from './contacts-routing.module';
import { ContactsComponent } from './contacts.component';
import { WebcamModule } from 'ngx-webcam';
import { ContactItemComponent } from './contact-item/contact-item.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';


@NgModule({
  declarations: [
    ContactsComponent,
    ContactItemComponent,
    ContactDetailComponent
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
