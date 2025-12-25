import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Generic API service for making HTTP requests.
 * Wrapper around HttpClient to standardize API calls.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.baseUrl;

  /**
   * Performs a GET request.
   * @param path The endpoint path (relative to base URL).
   * @param params Optional query parameters.
   * @returns Observable of the response.
   */
  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${this.API_URL}${path}`, { params });
  }

  /**
   * Performs a POST request.
   * @param path The endpoint path (relative to base URL).
   * @param body The request body.
   * @returns Observable of the response.
   */
  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.API_URL}${path}`, body);
  }

  /**
   * Performs a PUT request.
   * @param path The endpoint path (relative to base URL).
   * @param body The request body.
   * @returns Observable of the response.
   */
  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.API_URL}${path}`, body);
  }

  /**
   * Performs a DELETE request.
   * @param path The endpoint path (relative to base URL).
   * @returns Observable of the response.
   */
  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.API_URL}${path}`);
  }
}
