import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Catalogo } from '../../../core/models/domain/activo.model';

@Component({
  selector: 'app-catalog-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full">
      <label *ngIf="label" class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
        {{ label }}
      </label>
      
      <select 
        [formControl]="control"
        [class.border-red-500]="control.invalid && control.touched"
        class="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%20stroke%3D%22%236b7280%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right:0.5rem_center] bg-no-repeat pr-8"
        (change)="onSelect($event)">
        
        <option [ngValue]="null" disabled selected>{{ placeholder }}</option>
        
        <ng-container *ngIf="items() as catalogItems">
           <option *ngFor="let item of catalogItems" [ngValue]="item.id">
             {{ item.nombre }}
           </option>
        </ng-container>

      </select>
      
      <!-- Loading State -->
      <div *ngIf="loading()" class="text-xs text-blue-500 mt-1">Cargando opciones...</div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CatalogSelectComponent implements OnInit, OnChanges {
  @Input() label = '';
  @Input() placeholder = 'Seleccione...';
  @Input() itemsSource?: Observable<Catalogo[]>; // The observable to load
  @Input() initialValue: number | undefined;

  @Output() selectionChange = new EventEmitter<Catalogo | undefined>();

  control = new FormControl<number | null>(null);
  
  items = signal<Catalogo[]>([]);
  loading = signal(false);

  private sub?: Subscription;

  ngOnInit() {
    this.control.valueChanges.subscribe(val => {
      if (val === null) return;
       const selected = this.items().find(i => i.id == val);
       this.selectionChange.emit(selected);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
     if (changes['itemsSource'] && this.itemsSource) {
        this.loadItems();
     }
     
     if (changes['initialValue'] && this.initialValue !== undefined) {
        this.control.setValue(this.initialValue, { emitEvent: false });
     }
  }

  private loadItems() {
    if (!this.itemsSource) return;
    
    this.loading.set(true);
    this.sub?.unsubscribe();
    
    this.sub = this.itemsSource.subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSelect(event: any) {
    // Handled by reactive forms subscription/event
  }
}
