import { Component, EventEmitter, Input, Output, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

/**
 * Component for uploading files.
 * Pure Dropzone: No internal form state, just file selection.
 */
@Component({
  selector: 'app-upload-form',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="h-full flex flex-col">
        <!-- Drag & Drop Area -->
        <div 
          class="flex-1 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-all cursor-pointer bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center group min-h-[200px]"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
          (click)="fileInput.click()"
          [ngClass]="{'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-4 ring-blue-500/10': isDragging()}">
          
          <input #fileInput type="file" class="hidden" (change)="onFileSelected($event)" accept=".csv,.xlsx">
          
          <div *ngIf="!selectedFile()" class="pointer-events-none">
            <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
               <lucide-icon name="upload-cloud" class="w-6 h-6 text-blue-600 dark:text-blue-400"></lucide-icon>
            </div>
            
            <p class="text-sm font-medium text-slate-700 dark:text-slate-200">
              <span class="text-blue-600 dark:text-blue-400">Cargar Archivo</span>
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">CSV o XLSX</p>
          </div>

          <div *ngIf="selectedFile() as file" class="w-full relative z-10">
              <div class="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm animate-fade-in text-left">
                 <div class="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400 shrink-0">
                    <lucide-icon name="file-text" class="w-5 h-5"></lucide-icon>
                 </div>
                 
                 <div class="flex-1 overflow-hidden">
                   <p class="text-sm font-semibold text-slate-900 dark:text-white truncate">{{ file.name }}</p>
                   <p class="text-xs text-slate-500 dark:text-slate-400 font-mono">{{ (file.size / 1024).toFixed(2) }} KB</p>
                 </div>
                 
                 <button type="button" (click)="clearFile($event)" class="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                   <lucide-icon name="x" class="w-4 h-4"></lucide-icon>
                 </button>
              </div>
          </div>
        </div>
    </div>
  `,
  styles: []
})
export class UploadFormComponent {
  @Input() disabled: boolean = false;
  @Output() fileSelected = new EventEmitter<File | null>();
  
  isDragging = signal(false);
  selectedFile = signal<File | null>(null);
  
  onDragOver(event: DragEvent) {
    if (this.disabled) return;
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
    if (this.disabled) return;
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    if (this.disabled) return;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File) {
    if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
      this.selectedFile.set(file);
      this.fileSelected.emit(file);
    } else {
      alert('Solo archivos .csv y .xlsx son permitidos');
    }
  }

  clearFile(event: Event) {
    event.stopPropagation();
    this.selectedFile.set(null);
    this.fileSelected.emit(null);
  }
}
