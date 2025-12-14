import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Component to display the progress of the onboarding process.
 */
@Component({
  selector: 'app-processing-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-slate-700">Estado del Proceso</span>
        <span class="text-sm font-medium text-accent">{{ progress }}%</span>
      </div>
      <div class="w-full bg-slate-200 rounded-full h-2.5">
        <div class="bg-accent h-2.5 rounded-full transition-all duration-500 ease-out" [style.width.%]="progress"></div>
      </div>
      <p class="text-xs text-slate-500 mt-2 text-center">
        {{ status }}
      </p>
    </div>
  `,
  styles: []
})
export class ProcessingStatusComponent {
  @Input() progress: number = 0;
  @Input() status: string = 'Procesando...';
}
