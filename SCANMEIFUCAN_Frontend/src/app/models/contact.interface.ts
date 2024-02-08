import { IItemBase } from "./item-base.interface";

/**
 * Model that represents contact.
 */
export interface IContact extends IItemBase {
  /**
  * Gets or sets firstname of the contact.
  */
  firstname: string;

  /**
  * Gets or sets lastname of the contact.
  */
  lastname: string;

  /**
   * Gets or sets avatar
   */
  avatar: string;

  /**
  * Gets or sets email of the contact.
  */
  email: string;
  /**
   * Gets or sets profession
   */
  profession: string;
  /**
   * Gets or sets mobile
   */
  mobile: string;
  /**
   * Gets or sets tel
   */
  tel: string;
  /**
   * Gets or sets notes
   */
  notes: string;
  /**
   * Gets or sets createdon datetime
   */
  createdon: string;

  /**
   * Gets or sets if contact has been marked as done / visited.
   */
  done: boolean;
}