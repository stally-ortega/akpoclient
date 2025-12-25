import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadFormComponent } from './components/upload-form.component';
import { ResultsTableComponent } from './components/results-table.component';
import { ProcessingStatusComponent } from './components/processing-status.component';
import { CorreosService } from './services/correos.service';
import { CorreosRequest } from './models/correos.models';
import { ToastrService } from 'ngx-toastr';

/**
 * Main Correos Page.
 * Orchestrates the upload, status, and results components.
 */
@Component({
  selector: 'app-correos-page',
  standalone: true,
  imports: [CommonModule, UploadFormComponent, ResultsTableComponent, ProcessingStatusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Envío de Correos</h1>
          <!-- <p class="text-slate-500 mt-1">Sube el archivo Excel para procesar los envíos.</p> -->
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column: Upload Form -->
        <div class="space-y-6">
          <section class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Cargar Archivo</h2>
            <app-upload-form 
              (upload)="onUpload($event)"
              [disabled]="isProcessing()">
            </app-upload-form>
          </section>

          <section *ngIf="isProcessing() || currentStatus()" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Estado del Proceso</h2>
            <app-processing-status 
              [status]="currentStatus()"
              [progress]="progress()">
            </app-processing-status>
          </section>
        </div>
        
        <!-- Right Column: Results -->
         <div class="space-y-6">
          <section class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700 h-full">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Resultados</h2>
              <button 
                *ngIf="processingResults().length > 0"
                (click)="clearResults()"
                class="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                Limpiar
              </button>
            </div>
            <app-results-table 
              [results]="processingResults()">
            </app-results-table>
          </section>
        </div>
      </div>
    </div>
  `
})
export class CorreosPageComponent {
  private correosService = inject(CorreosService);
  private toast = inject(ToastrService);

  // Expose signals for template
  isProcessing = this.correosService.isProcessing;
  currentStatus = this.correosService.currentStatus;
  progress = this.correosService.progress;
  processingResults = this.correosService.results;

  onUpload(request: CorreosRequest) {
    this.correosService.startProcess(request).subscribe({
      next: (response) => {
        this.toast.success('Proceso iniciado correctamente', 'Éxito');
        this.correosService.pollResults(response.processId).subscribe();
      },
      error: (err) => {
        console.error('Upload failed', err);
        this.toast.error('Error al iniciar el proceso', 'Error');
      }
    });
  }

  clearResults() {
    // Implement specific method in service if needed, or just reset logic
    // For now assuming service handles state reset on new start
  }
}
