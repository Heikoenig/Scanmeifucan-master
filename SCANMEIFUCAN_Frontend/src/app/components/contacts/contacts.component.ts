import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IContact } from 'src/app/models/contact.interface';
import { IList } from 'src/app/models/list.interface';
import { ITag } from 'src/app/models/tag.interface';
import { ContactService } from 'src/app/services/contact.service';
import { ListsService } from 'src/app/services/lists.service';
import { TagsService } from 'src/app/services/tags.service';
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


  public searchText: string = '';
  public isAddMode: boolean = false;
  /**
 * Gets or sets if data is being loaded.
 */
  public isLoading: boolean = false;

  public upcomingContacts: ExtractedInformation[] = [];

  public selectedContact: ExtractedInformation | undefined;


  constructor(
    private route: ActivatedRoute,
    private listsService: ListsService,
    private tagsService: TagsService,
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

  public selectListItem(contact: ExtractedInformation) {
    this.upcomingContacts.map(x => x.done = false);
    this.isAddMode = false;
    contact.done = true;
    this.selectedContact = contact;
    this.showDetailsDialog(contact);
  }


  private getPagedContacts(): void {
    this.apiService.getPagedInformation(1, 20).subscribe(result => {
      this.upcomingContacts = result.information;
    });
  }

  public deleteContact(id: number): void {
    debugger
    this.apiService.deleteInformation(id).subscribe(x => {
      this.selectedContact = undefined;
      this.getPagedContacts();
    });
  }

  public showDetailsDialog(contact: ExtractedInformation): void {
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
    this.sysImage = webcamImage!.imageAsDataUrl;
    console.info('got webcam image', this.sysImage);
  }

  public get invokeObservable(): Observable<any> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<any> {
    return this.nextWebcam.asObservable();
  }

  saveImage() {
    // call api here
  }
}