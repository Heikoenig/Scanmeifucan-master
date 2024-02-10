import { Injectable } from '@angular/core';
import { addRxPlugin, createRxDatabase, RxCollection, RxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { BehaviorSubject } from 'rxjs';
import { contactsSchema } from '../core/schemas/contact-schema.model';
import { IContact } from '../models/contact.interface';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { ITag } from '../models/tag.interface';
import { IList } from '../models/list.interface';

addRxPlugin(RxDBUpdatePlugin);
@Injectable({
  providedIn: 'root'
})
export class ContactService {
      /**
   * Gets or sets if service has been initialized.
   */
  public isInitialized: boolean = false;

  private readonly databaseKey: string = 'contacts';
  /**
   * Database that holds contacts.
   */
  private database: RxDatabase | undefined;
  private collection: { contacts: RxCollection } | undefined;
  constructor() {
    this.setupDatabase();
  }
  private async setupDatabase(): Promise<void> {
    // Creates new database.
    this.database = await createRxDatabase({
      name: this.databaseKey,
      storage: getRxStorageDexie()
    });
    // Creates collection in the database with given schema.
    this.collection = await this.database.addCollections({
      contacts: {
        schema: contactsSchema
      }
    });
    this.isInitialized = true;

  }
  /**
   * Adds new contact to database.
   * @param contact
   */
  public async addContact(contact: IContact): Promise<void> {
    await this.database![this.databaseKey].insert(contact);
  }
  /**
   * Deletes contact from database.
   * @param contact
   */
  public async deleteContact(contact: IContact): Promise<void> {
    let query = this.collection?.contacts.find({
      selector: {
        id: {
          $eq: contact.id
        }
      }
    })
    await query?.remove();
  }
  /**
   * Marks contact as completed.
   * @param contact
   */
  public async completeContact(contact: IContact, completed: boolean): Promise<void> {
    let query = this.collection?.contacts.find({
      selector: {
        id: {
          $eq: contact.id
        }
      }
    })
    await query?.update({
      $set: {
        done: completed
      }
    });
  }
  /**
   * Sets tag for the contact
   * @param contact
   */
  public async setTag(contact: IContact, tag: ITag): Promise<void> {
    let query = this.collection?.contacts.find({
      selector: {
        id: {
          $eq: contact.id
        }
      }
    })
    await query?.update({
      $set: {
        tag: tag
      }
    });
  }
  /**
   * Sets list for the contact
   * @param contact
   */
  public async setList(contact: IContact, list: IList): Promise<void> {
    let query = this.collection?.contacts.find({
      selector: {
        id: {
          $eq: contact.id
        }
      }
    })
    await query?.update({
      $set: {
        list: list
      }
    });
  }
  /**
   * Sets notes for the contact
   * @param contact
   */
  public async setNotes(contact: IContact, notes: string): Promise<void> {
    let query = this.collection?.contacts.find({
      selector: {
        id: {
          $eq: contact.id
        }
      }
    })
    await query?.update({
      $set: {
        notes: notes
      }
    });
  }
  /**
   * Gets contacts that are not marked as done.
   * @returns
   */
public getUpcomingContacts(type: string | undefined = undefined, id: string | undefined = undefined): BehaviorSubject<any[]> {
    return this.database![this.databaseKey].find({
      selector: {
        done: {
          $eq: false
        }
 },
      sort: [
        { createdAt: 'desc' }
      ]
    }).$;
  }

  /**
   * Gets contacts that are marked as done.
   * @returns
   */
public getPastContacts(type: string | undefined = undefined, id: string | undefined = undefined): BehaviorSubject<any[]> {
    return this.database![this.databaseKey].find({
      selector: {
        done: {
          $eq: true
        }
  },
      sort: [
        { createdAt: 'desc' }
      ]
    }).$;
  }
}
