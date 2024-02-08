import { RxJsonSchema } from "rxdb";
import { IContact } from "src/app/models/contact.interface";

/**
 * Collection schema for contacts.
 */
export const contactsSchema: RxJsonSchema<IContact> = {
  title: 'contacts schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'number',
      maxLength: 10000 // <- the primary key must have set maxLength
    },
    firstname: {
      type: 'string',
    },
    lastname: {
      type: 'string'
    },
    avatar: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    profession: {
      type: 'string'
    },
    mobile: {
      type: 'string'
    },
    tel: {
      type: 'string'
    },
    notes: {
      type: 'string'
    },
    createdon: {
      type: 'string'
    },
    done: {
      type: 'boolean'
    },
  },
  required: ['id', 'firstname', 'lastname', 'email', 'avatar', 'profession', 'mobile', 'tel', 'done', 'notes']
}