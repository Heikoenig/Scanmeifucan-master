import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IContact } from '../models/contact.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api/contact';  // Replace with your Flask server URL

  constructor(private http: HttpClient) { }

  // CRUD operations

  // Create a new entry
  createContact(contact: IContact): Observable<any> {
    return this.http.post(this.apiUrl, contact);
  }

  // Read all entries
  getAllContact(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Read a specific entry by ID
  getContactById(id: number): Observable<IContact> {
    return this.http.get<IContact>(`${this.apiUrl}/${id}`);
  }

  // Update an entry by ID
  updateContact(id: number|any, contact: IContact): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, contact);
  }

  // Delete an entry by ID
  deleteContact(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Paged API call
  getPagedContact(page: number, perPage: number): Observable<any> {
    const url = `${this.apiUrl}/paged?page=${page}&per_page=${perPage}`;
    return this.http.get<any>(url);
  }

  // Function to perform OCR on an image file
  performOcr(imageFile: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('image', imageFile, imageFile.name);

    return this.http.post<string>(`${this.apiUrl}/ocr`, formData);
  }

  performOcrBase64(body: any): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/ocr`, body);
  }
}
