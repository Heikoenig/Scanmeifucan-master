import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IContact } from 'src/app/models/contact.interface';
import { ContactService } from 'src/app/services/contact.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { DetailsDialogComponent } from '../dialogs/details-dialog/details-dialog.component';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ExtractedInformation } from 'src/app/models/extracted-Information.interface';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent {

responseError: boolean = false;
  public searchText: string = '';
  public isAddMode: boolean = false;
  /**
 * Gets or sets if data is being loaded.
 */
  public isLoading: boolean = false;

  public upcomingContacts: IContact[] = [];

  public selectedContact: IContact | undefined;


  constructor(
    private route: ActivatedRoute,
    private contactsService: ContactService,
    private apiService: ApiService,
    public dialog: MatDialog) {
    this.isAddMode = route.snapshot.data['mode'] == 'add';
    // Check passed query params to check if we
    // need to load all contacts or from specified list / tag.
    this.route.queryParams.subscribe(params => {
      this.isLoading = false;
      let type = params['type'];
      let id = params['id'];
      this.selectedContact = undefined;

      //this.initializeData(type, id);
    });
    this.getPagedContacts();
  }
  public ngOnInit(): void {
  }

  public selectListItem(contact: IContact) {
    this.upcomingContacts.map(x => x.done = false);
    this.isAddMode = false;
    contact.done = true;
    this.selectedContact = contact;
    this.showDetailsDialog(contact);
  }


  private getPagedContacts(): void {
    this.apiService.getPagedInformation(this.pageIndex, this.pageSize).subscribe(result => {
      this.upcomingContacts = result.contact;
    });
  }

  public deleteContact(id: number): void {
    debugger
    this.apiService.deleteInformation(id).subscribe(x => {
      this.selectedContact = undefined;
      this.pageIndex = 1;
      this.getPagedContacts();
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
      if (res.status == 200) {
        this.sysImage = '';
        this.pageIndex = 1;
        this.getPagedContacts();
      }else{
        this.responseError = true;
      }
      })
  }
}