import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable loading spinner component.
 * Uses Tailwind CSS for styling.
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-center items-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  `,
  styles: []
})
export class LoadingSpinnerComponent {}
