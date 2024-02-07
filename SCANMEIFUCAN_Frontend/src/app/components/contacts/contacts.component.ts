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

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent {

  // Sample data for tags and lists
  public tag1: ITag = { id: '1', name: 'Personal' };
  public tag2: ITag = { id: '2', name: 'Work' };

  public list1: IList = { id: '1', name: 'To-Do' };
  public list2: IList = { id: '2', name: 'Contacts' };

  public searchText: string = '';
  public isAddMode: boolean = false;
  /**
 * Gets or sets if data is being loaded.
 */
  public isLoading: boolean = false;
  /**
   * Gets or sets list of all available lists.
   */
  public availableLists: IList[] = [];
  /**
   * Gets or sets list if all available tags.
   */
  public availableTags: ITag[] = [];
  /**
   * Gets or sets list of upcoming contacts.
   */
  public upcomingContacts: IContact[] = [
    {
      id: '1',
      contact: 'John Doe',
      continent: 'North America',
      createdAt: '2022-01-28T12:00:00Z',
      tag: this.tag1,
      list: this.list1,
      done: false,
      notes: 'Met at the conference.'
    },
    {
      id: '2',
      contact: 'Alice Smith',
      continent: 'Europe',
      createdAt: '2022-01-27T14:30:00Z',
      tag: this.tag2,
      list: this.list2,
      done: false,
      notes: 'Work collaboration.'
    },
    {
      id: '3',
      contact: 'John Doe',
      continent: 'North America',
      createdAt: '2022-01-28T12:00:00Z',
      tag: this.tag1,
      list: this.list1,
      done: false,
      notes: 'Met at the conference.'
    },
    {
      id: '4',
      contact: 'Alice Smith',
      continent: 'Europe',
      createdAt: '2022-01-27T14:30:00Z',
      tag: this.tag2,
      list: this.list2,
      done: false,
      notes: 'Work collaboration.'
    },
    // Add more objects as needed...
  ];
  /**
 * Gets or sets list of upcoming contacts.
 */
  public pastContacts: IContact[] = [];
  /**
   * Gets or sets selected contact.
   */
  public selectedContact: IContact | undefined;


  constructor(
    private route: ActivatedRoute,
    private listsService: ListsService,
    private tagsService: TagsService,
    private contactsService: ContactService,
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

  private initializeData(type: string | undefined = undefined, id: string | undefined = undefined): void {
    this.getUpcomingContacts(type, id);
    this.getPastContacts(type, id);
    setTimeout(() => {
      this.listsService.getLists().subscribe(result => {
        this.availableLists = result.map((item) => {
          return item._data;
        })
      });
    }, this.listsService.isInitialized ? 0 : 1000);
    setTimeout(() => {
      this.tagsService.getTags().subscribe(result => {
        this.availableTags = result.map((item) => {
          return item._data;
        })
      });
    }, this.tagsService.isInitialized ? 0 : 1000);
  }
  /**
  * Gets upcoming contacts.
  */
  private getUpcomingContacts(type: string | undefined = undefined, id: string | undefined = undefined): void {
    setTimeout(() => {
      this.contactsService.getUpcomingContacts(type, id).subscribe(result => {
        this.upcomingContacts = result.map((val) => {
          return val._data;
        });

        if (type != undefined) {
          this.upcomingContacts = this.upcomingContacts.filter(x => type == 'list' ? (x.list.id == id) : (x.tag.id == id));
        }
      });
    }, this.contactsService.isInitialized ? 0 : 1000);
  }

  /**
   * Gets upcoming contacts.
   */
  private getPastContacts(type: string | undefined = undefined, id: string | undefined = undefined): void {
    setTimeout(() => {
      this.contactsService.getPastContacts(type, id).subscribe(result => {
        this.pastContacts = result.map((val) => {
          return val._data;
        });

        if (type != undefined) {
          this.pastContacts = this.pastContacts.filter(x => type == 'list' ? (x.list.id == id) : (x.tag.id == id));
        }
      });
      this.isLoading = false;
    }, this.contactsService.isInitialized ? 0 : 1000);
  }
  /**
   * Deletes selected contact.
   */
  public deleteContact(): void {
    this.contactsService.deleteContact(this.selectedContact!);

  }
  /**
   * Completes selected contact.
   */
  public completeContact(contact: IContact, complete: boolean): void {
    this.contactsService.completeContact(contact, complete);
    this.selectedContact = undefined;
  }

  /**
   * Sets tag for the contact.
   * @param tag
   */
  public updateTag(tag: ITag): void {
    this.contactsService.setTag(this.selectedContact!, tag);
  }
  /**
   * Sets list for the contact.
   * @param list
   */
  public updateList(list: IList): void {
    this.contactsService.setList(this.selectedContact!, list);
  }
  /**
   * Sets notes for the contact.
   * @param list
   */
  public updateNotes(newValue: string): void {
    this.contactsService.setNotes(this.selectedContact!, newValue);
  }
  /**
   * Shows details dialog about selected contact
   * if display is in narrow mode.
   */
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
    this.sysImage = webcamImage!.imageAsDataUrl;
    console.info('got webcam image', this.sysImage);
  }

  public get invokeObservable(): Observable<any> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<any> {
    return this.nextWebcam.asObservable();
  }
  
  saveImage(){
    // call api here
  }
}