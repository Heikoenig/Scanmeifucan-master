import { Component, Input } from '@angular/core';
import { IContact } from 'src/app/models/contact.interface';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent {
  @Input() contact!: IContact;
}