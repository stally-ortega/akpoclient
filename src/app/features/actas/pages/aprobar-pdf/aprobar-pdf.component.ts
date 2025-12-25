import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ToastrService } from 'ngx-toastr';
import { ActasService } from '../../services';

/**
 * Page component for uploading and approving actas via PDF.
 */
@Component({
  selector: 'app-aprobar-pdf',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Aprobar Acta con PDF</h1>
        <p class="text-slate-600 mt-2">Sube el PDF firmado para aprobar automáticamente la solicitud.</p>
      </div>

      <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div 
          class="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-accent transition-colors cursor-pointer"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
          (click)="fileInput.click()"
          [class.border-accent]="isDragging()"
          [class.bg-blue-50]="isDragging()">
          
          <input #fileInput type="file" class="hidden" (change)="onFileSelected($event)" accept=".pdf">
          
          <div *ngIf="!selectedFile()">
            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="mt-4 text-lg font-medium text-slate-700">
              Arrastra el PDF aquí o haz clic para seleccionar
            </p>
            <p class="text-sm text-slate-500 mt-2">Solo archivos PDF</p>
          </div>

          <div *ngIf="selectedFile() as file" class="flex flex-col items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <div class="text-center">
              <p class="text-lg font-medium text-slate-900">{{ file.name }}</p>
              <p class="text-sm text-slate-500">{{ (file.size / 1024).toFixed(2) }} KB</p>
            </div>
            <button type="button" (click)="clearFile($event)" 
              class="mt-2 text-sm text-danger hover:text-red-700 underline">
              Eliminar archivo
            </button>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-4">
          <button type="button" (click)="cancelar()" 
            class="px-6 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button type="button" (click)="enviarPdf()" [disabled]="!selectedFile() || isUploading()" 
            class="px-6 py-2 bg-primary text-white rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <span *ngIf="!isUploading()">Enviar PDF</span>
            <span *ngIf="isUploading()" class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AprobarPdfComponent {
  private actasService = inject(ActasService);
  private router = inject(Router);
  private toast = inject(ToastrService);

  selectedFile = signal<File | null>(null);
  isDragging = signal(false);
  isUploading = signal(false);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File) {
    if (file.type === 'application/pdf') {
      this.selectedFile.set(file);
    } else {
      this.toast.error('Solo se permiten archivos PDF', 'Error');
    }
  }

  clearFile(event: Event) {
    event.stopPropagation();
    this.selectedFile.set(null);
  }

  enviarPdf() {
    const file = this.selectedFile();
    if (!file) return;

    this.isUploading.set(true);

    this.actasService.aprobarPdf(file).subscribe({
      next: (response) => {
        if (response.status === 'APROBADA_AUTO') {
          this.toast.success(response.message, 'Aprobada Automáticamente');
        } else if (response.status === 'REQUIERE_MANUAL') {
          this.toast.warning(response.message, 'Requiere Aprobación Manual');
        } else {
          this.toast.error(response.message, 'No Encontrada');
        }
        this.isUploading.set(false);
        this.router.navigate(['/actas']);
      },
      error: () => {
        this.isUploading.set(false);
      }
    });
  }

  cancelar() {
    this.router.navigate(['/actas']);
  }
}
