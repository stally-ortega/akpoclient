import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse, User } from '../models/user.model';

/**
 * Service responsible for authentication state and logic.
 * Uses Signals for state management.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = environment.baseUrl;

  // Signals for state
  private _currentUser = signal<User | null>(this.getUserFromStorage());
  private _token = signal<string | null>(this.getTokenFromStorage());

  // Computed signals
  public currentUser = computed(() => this._currentUser());
  public isAuthenticated = computed(() => !!this._token());

  /**
   * Authenticates the user with email and password.
   * @param credentials Object containing email and password.
   * @returns Observable of the login response.
   */
  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    if (environment.useMocks) {
      const mockResponse: LoginResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 'mock-user-1',
          email: credentials.email,
          name: 'Mock User',
          role: 'admin'
        }
      };
      return of(mockResponse).pipe(
        delay(800), // Simulate network latency
        tap((response) => this.setSession(response))
      );
    }

    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => {
        this.setSession(response);
      })
    );
  }

  /**
   * Logs out the current user and clears the session.
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._token.set(null);
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Gets the current authentication token.
   * @returns The JWT token or null.
   */
  getToken(): string | null {
    return this._token();
  }

  private setSession(authResult: LoginResponse): void {
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    this._token.set(authResult.token);
    this._currentUser.set(authResult.user);
  }

  private getTokenFromStorage(): string | null {
    return localStorage.getItem('token');
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
