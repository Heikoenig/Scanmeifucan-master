import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExtractedInformation } from '../models/extracted-Information.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api/information';  // Replace with your Flask server URL

  constructor(private http: HttpClient) { }

  // CRUD operations

  // Create a new entry
  createInformation(information: ExtractedInformation): Observable<any> {
    return this.http.post(this.apiUrl, information);
  }

  // Read all entries
  getAllInformation(): Observable<ExtractedInformation[]> {
    return this.http.get<ExtractedInformation[]>(this.apiUrl);
  }

  // Read a specific entry by ID
  getInformationById(id: number): Observable<ExtractedInformation> {
    return this.http.get<ExtractedInformation>(${this.apiUrl}/${id});
  }

  // Update an entry by ID
  updateInformation(id: number, information: ExtractedInformation): Observable<any> {
    return this.http.put(${this.apiUrl}/${id}, information);
  }

  // Delete an entry by ID
  deleteInformation(id: number): Observable<any> {
    return this.http.delete(${this.apiUrl}/${id});
  }

  // Paged API call
  getPagedInformation(page: number, perPage: number): Observable<any> {
    const url = ${this.apiUrl}/paged?page=${page}&per_page=${perPage};
    return this.http.get<any>(url);
  }

  // Function to perform OCR on an image file
  performOcr(imageFile: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('image', imageFile, imageFile.name);

    return this.http.post<string>(${this.apiUrl}/ocr, formData);
  }
}