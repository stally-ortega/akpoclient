import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Component to display the progress of the onboarding process.
 */
@Component({
  selector: 'app-processing-status',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Estado del Proceso</span>
        <span class="text-sm font-medium text-accent">{{ progress }}%</span>
      </div>
      <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
        <div class="bg-accent h-2.5 rounded-full transition-all duration-500 ease-out" [style.width.%]="progress"></div>
      </div>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
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
