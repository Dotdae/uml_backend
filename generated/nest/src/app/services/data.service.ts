// src/app/services/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface DataItem {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'https://your-api-endpoint.com/data'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  getData(): Observable<DataItem[]> {
    return this.http.get<DataItem[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getDataById(id: number): Observable<DataItem> {
    return this.http.get<DataItem>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createData(data: Omit<DataItem, 'id'>): Observable<DataItem> {
    return this.http.post<DataItem>(this.apiUrl, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateData(id: number, data: Omit<DataItem, 'id'>): Observable<DataItem> {
    return this.http.put<DataItem>(`${this.apiUrl}/${id}`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteData(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}