import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';

import { UploadFormComponent } from './components/upload-form.component';
import { ResultsTableComponent } from './components/results-table.component';
import { ProcessingStatusComponent } from './components/processing-status.component';
import { CorreosService } from './services/correos.service';
import { CorreosRequest } from './models/correos.models';

/**
 * Main Correos Page.
 * Implements a dense, no-scroll dashboard layout.
 */
@Component({
  selector: 'app-correos-page',
  standalone: true,
  imports: [
    CommonModule, 
    UploadFormComponent, 
    ResultsTableComponent, 
    ProcessingStatusComponent, 
    LucideAngularModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="h-[calc(100vh-6rem)] flex flex-col space-y-6 animate-fade-in pb-4">
      
      <!-- Compact Header & Toolbar -->
      <!-- Premium Header -->
      <div class="relative overflow-hidden bg-gradient-to-r from-violet-900 to-fuchsia-900 rounded-2xl shadow-lg p-5 text-white">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-xl"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-4">
             <div class="p-2 bg-white/10 rounded-lg shrink-0">
                <lucide-icon name="mail-check" class="w-6 h-6 text-fuchsia-200"></lucide-icon>
             </div>
             <div>
               <h1 class="text-2xl font-bold tracking-tight">Envío Masivo</h1>
               <p class="text-fuchsia-100 text-sm opacity-90">Gestión de notificaciones y credenciales.</p>
             </div>
          </div>
          
          <!-- Controls Toolbar -->
          <button type="button" (click)="onStartProcess()" 
            [disabled]="!selectedFile() || isProcessing()"
            class="h-10 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap border border-indigo-500/50">
            <lucide-icon *ngIf="!isProcessing()" name="send" class="w-4 h-4"></lucide-icon>
            <svg *ngIf="isProcessing()" class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span *ngIf="!isProcessing()">Iniciar Envío</span>
            <span *ngIf="isProcessing()">Procesando...</span>
          </button>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        <!-- Left: Dropzone -->
        <div class="lg:col-span-4 flex flex-col gap-6">
           <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-1 flex-1">
              <app-upload-form 
                [disabled]="isProcessing()"
                (fileSelected)="onFileSelected($event)">
              </app-upload-form>
           </div>

           <!-- Status (Appears below dropzone) -->
           <div *ngIf="isProcessing() || currentStatus()" class="animate-fade-in-up">
              <app-processing-status 
                [status]="currentStatus()"
                [progress]="progress()">
              </app-processing-status>
           </div>
        </div>
        
        <!-- Right: Results -->
         <div class="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden">
            <div class="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
              <h2 class="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                 <lucide-icon name="activity" class="w-4 h-4 text-blue-500"></lucide-icon>
                 Resultados
              </h2>
              <button 
                *ngIf="processingResults().length > 0"
                (click)="clearResults()"
                class="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1">
                <lucide-icon name="trash" class="w-3 h-3"></lucide-icon>
                Limpiar
              </button>
            </div>
            
            <div class="flex-1 overflow-auto p-4">
               <app-results-table 
                 [results]="processingResults()">
               </app-results-table>
            </div>
         </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
    .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class CorreosPageComponent {
  private correosService = inject(CorreosService);
  private toast = inject(ToastrService);

  // Layout & Form state
  selectedFile = signal<File | null>(null);
  
  // Service Signals
  isProcessing = this.correosService.isProcessing;
  currentStatus = this.correosService.currentStatus;
  progress = this.correosService.progress;
  processingResults = this.correosService.results;

  onFileSelected(file: File | null) {
    this.selectedFile.set(file);
  }

  onStartProcess() {
    if (this.selectedFile()) {
      const request: CorreosRequest = {
        file: this.selectedFile()!,
        mode: 'completo',
        credentialsType: 'todas'
      };

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
  }

  clearResults() {
    // Optional: Clear logic
  }
}
