import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IContact } from 'src/app/models/contact.interface';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent {
  @Input() contact!: IContact;
  @Output() saveChangesClicked: EventEmitter<IContact> = new EventEmitter();

  public editTitle: boolean = false;
  public editFirstName: boolean = false;
  public editLastName: boolean = false;
  public editEmail: boolean = false;
  public editProfession: boolean = false;
  public editMobile: boolean = false;
  public editTel: boolean = false;

  constructor(public dialogRef: MatDialogRef<ContactDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data && this.data.contact)
      this.contact = this.data.contact;
  }
  public resetEditState() {
    this.editTitle = false
    this.editFirstName = false;
    this.editLastName = false;
    this.editEmail = false;
    this.editProfession = false;
    this.editMobile = false;
    this.editTel = false;
  }
}