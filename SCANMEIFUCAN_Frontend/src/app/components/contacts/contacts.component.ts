import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IContact } from 'src/app/models/contact.interface';
import { ContactService } from 'src/app/services/contact.service';
import { ActivatedRoute } from '@angular/router';
import { DetailsDialogComponent } from '../dialogs/details-dialog/details-dialog.component';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent {

  @ViewChild('contactDetail', { static: false }) public contactDetail!: ContactDetailComponent;

  public responseError: boolean = false;
  private pageSize = 10;
  private pageIndex = 1;
  public searchText: string = '';
  public isAddMode: boolean = false;
  /**
 * Gets or sets if data is being loaded.
 */
  public isLoading: boolean = false;

  public allContacts: IContact[] = [];

  public selectedContact: IContact | undefined;


  constructor(
    private route: ActivatedRoute,
    private contactsService: ContactService,
    private apiService: ApiService,
    public dialog: MatDialog) {
    this.isAddMode = route.snapshot.data['mode'] == 'add';
    this.getAllContacts();
  }

  public ngOnInit(): void {
  }

  public selectListItem(contact: IContact) {
    this.allContacts.map(x => x.done = false);
    this.isAddMode = false;
    contact.done = true;
    this.selectedContact = contact;
    this.contactDetail?.resetEditState();
    this.showDetailsDialog(contact);
  }

  private getAllContacts(): void {
    this.apiService.getAllContact().subscribe((result: any) => {
      this.allContacts = result.contact;
    });
  }

  private getPagedContacts(): void {
    this.apiService.getPagedContact(this.pageIndex, this.pageSize).subscribe(result => {
      this.allContacts = result.contact;
    });
  }

  public deleteContact(id: number | any): void {
    this.apiService.deleteContact(id).subscribe(x => {
      this.selectedContact = undefined;
      this.pageIndex = 1;
      this.getAllContacts();
    });
  }

  public showDetailsDialog(contact: IContact): void {
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width > 1200)
      return;
    this.dialog.open(DetailsDialogComponent, {
      data: { contact: contact }
    });
  }


  private trigger: Subject<any> = new Subject();
  webcamImage: any;
  private nextWebcam: Subject<any> = new Subject();

  sysImage = '';

  public getSnapshot(): void {
    if (!this.sysImage)
      this.trigger.next(void 0);
    else
      this.sysImage = '';
  }

  public captureImg(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.sysImage = webcamImage!.imageAsBase64;
  }

  public get invokeObservable(): Observable<any> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<any> {
    return this.nextWebcam.asObservable();
  }

  saveImage() {
    this.responseError = false;
    this.apiService.performOcrBase64({ image: this.sysImage })
      .subscribe((res: any) => {
        this.sysImage = '';
        this.pageIndex = 1;
        this.getAllContacts();
      })
  }

  updateContact(event:IContact){
    this.apiService.updateContact(event.id, event).subscribe(res=>{
      this.contactDetail?.resetEditState();
      this.getAllContacts();
    })
  }
}