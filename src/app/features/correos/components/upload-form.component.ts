import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CorreosRequest } from '../models/correos.models';

/**
 * Component for uploading files.
 * Supports drag and drop and form configuration.
 */
@Component({
  selector: 'app-upload-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h3 class="text-lg font-semibold text-slate-900 mb-4">Nuevo Proceso de Envío</h3>
      
      <form [formGroup]="uploadForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Drag & Drop Area -->
        <div 
          class="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
          (click)="fileInput.click()"
          [class.border-accent]="isDragging()"
          [class.bg-blue-50]="isDragging()">
          
          <input #fileInput type="file" class="hidden" (change)="onFileSelected($event)" accept=".csv,.xlsx">
          
          <div *ngIf="!selectedFile()">
            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="mt-2 text-sm text-slate-600">
              <span class="font-medium text-accent">Click para cargar</span> o arrastra y suelta
            </p>
            <p class="text-xs text-slate-500">Solo archivos CSV o XLSX</p>
          </div>

          <div *ngIf="selectedFile() as file" class="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="text-left">
              <p class="text-sm font-medium text-slate-900">{{ file.name }}</p>
              <p class="text-xs text-slate-500">{{ (file.size / 1024).toFixed(2) }} KB</p>
            </div>
            <button type="button" (click)="clearFile($event)" class="ml-2 text-slate-400 hover:text-danger">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Configuration Options -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Modo</label>
            <select formControlName="mode" class="block w-full rounded-md border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border">
              <option value="completo">Completo</option>
              <option value="parcial">Parcial</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Tipo de Credenciales</label>
            <select formControlName="credentialsType" class="block w-full rounded-md border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border">
              <option value="todas">Todas</option>
              <option value="solo_correo">Solo Correo</option>
            </select>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button type="submit" [disabled]="uploadForm.invalid || !selectedFile()" 
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Iniciar Proceso
          </button>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class UploadFormComponent {
  @Input() disabled: boolean = false;
  @Output() upload = new EventEmitter<CorreosRequest>();
  
  isDragging = signal(false);
  selectedFile = signal<File | null>(null);
  
  uploadForm = new FormBuilder().group({
    mode: ['completo', Validators.required],
    credentialsType: ['todas', Validators.required]
  });

  // ... (keeping methods as they are, just ensuring types are correct)
  // Re-implementing methods to ensure no OnboardingRequest remains in method signatures in the invisible part
  
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
    if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
      this.selectedFile.set(file);
    } else {
      alert('Solo archivos .csv y .xlsx son permitidos');
    }
  }

  clearFile(event: Event) {
    event.stopPropagation();
    this.selectedFile.set(null);
  }

  onSubmit() {
    if (this.uploadForm.valid && this.selectedFile()) {
      const request: CorreosRequest = {
        file: this.selectedFile()!,
        mode: this.uploadForm.value.mode as any,
        credentialsType: this.uploadForm.value.credentialsType as any
      };
      this.upload.emit(request);
    }
  }
}
