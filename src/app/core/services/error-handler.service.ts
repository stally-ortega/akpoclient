import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Centralized service for handling errors across the application.
 * Uses ToastrService to display user-friendly messages.
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private toast = inject(ToastrService);

  /**
   * Handles an HTTP error response.
   * @param error The error response from the server or client.
   */
  handleError(error: HttpErrorResponse): void {
    let message = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      message = error.error.message;
    } else {
      // Server-side error
      if (error.status === 401) {
        message = 'Session expired. Please login again.';
      } else if (error.status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (error.status >= 500) {
        message = 'Server error. Please try again later.';
      } else if (error.error && error.error.message) {
        message = error.error.message;
      }
    }

    this.toast.error(message, 'Error', {
      timeOut: 5000,
      positionClass: 'toast-top-right',
    });
    
    console.error('Global Error Handler:', error);
  }
}
