import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IContact } from 'src/app/models/contact.interface';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrls: ['./contact-item.component.css']
})
export class ContactItemComponent {
  @Input() contact!: IContact;
  @Output() deleteClicked: EventEmitter<any> = new EventEmitter();

  constructor(private confirmationDialogService: ConfirmationDialogService) { }

  deleteContact(id: number | string) {
    this.confirmationDialogService.openConfirmationDialog('Delete Contact','Are you sure you want to delete the selected contact?', '600px')
      .subscribe((result: boolean) => {
        if (result) {
          console.log('OK clicked');
          this.deleteClicked.emit(id);
        } else {
          // User clicked Cancel
          console.log('Cancel clicked');
        }
      });

  }
}
