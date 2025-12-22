import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { RuleGroup, RuleCondition, Operator } from '../models/alertas.models';
import { PreferenciasService } from '../../preferencias/services/preferencias.service';

@Component({
  selector: 'app-rule-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="border-l-2 border-slate-200 pl-4 py-2 space-y-3">
      <!-- Group Header -->
      <div class="flex items-center gap-3">
        <select [(ngModel)]="group.operator" class="text-xs font-bold uppercase rounded border-slate-300 bg-slate-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 px-2 py-1">
          <option value="AND">Y (Todas)</option>
          <option value="OR">O (Cualquiera)</option>
        </select>
        
        <div class="flex gap-2">
          <button (click)="addCondition()" class="text-xs flex items-center gap-1 text-slate-600 dark:text-blue-400 hover:text-primary dark:hover:text-blue-300 transition-colors">
            <lucide-icon name="plus" class="w-3 h-3"></lucide-icon> Condición
          </button>
          <button (click)="addGroup()" class="text-xs flex items-center gap-1 text-slate-600 dark:text-blue-400 hover:text-primary dark:hover:text-blue-300 transition-colors">
            <lucide-icon name="plus" class="w-3 h-3"></lucide-icon> Grupo
          </button>
          <button *ngIf="!isRoot" (click)="removeSelf()" class="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-2">
             <lucide-icon name="trash" class="w-3 h-3"></lucide-icon>
          </button>
        </div>
      </div>

      <!-- Children -->
      <div class="space-y-2">
        <ng-container *ngFor="let item of group.rules; let i = index">
          
          <!-- If it's a Condition -->
          <!-- If it's a Condition -->
          <div *ngIf="!isGroup(item)" class="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-700">
             <!-- Field Selector -->
             <select [(ngModel)]="castCondition(item).field" class="text-xs rounded border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-1 max-w-[120px]">
               <option *ngFor="let f of availableFields" [value]="f.key">{{ f.label }}</option>
             </select>

             <!-- Operator -->
             <!-- Operator -->
             <select [(ngModel)]="castCondition(item).operator" class="text-xs rounded border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-1 font-mono">
               <option value="EQ">=</option>
               <option value="NEQ">!=</option>
               <option value="GT">&gt;</option>
               <option value="LT">&lt;</option>
               <option value="GTE">&gt;=</option>
               <option value="LTE">&lt;=</option>
               <option value="CONTAINS">Contiene</option>
             </select>

             <!-- Value Type Toggle (Literal vs Variable) -->
             <div class="flex items-center border border-slate-200 dark:border-slate-600 rounded overflow-hidden">
                <button type="button" 
                  (click)="toggleValueType(castCondition(item), 'LITERAL')"
                  [class]="castCondition(item).valueType !== 'VARIABLE' ? 'bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-white' : 'bg-white text-slate-400 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'"
                  class="px-2 py-1 text-[10px] font-bold"
                  title="Valor Literal">
                  123
                </button>
                <div class="w-[1px] bg-slate-200 dark:bg-slate-600 h-full"></div>
                <button type="button"
                  (click)="toggleValueType(castCondition(item), 'VARIABLE')"
                  [class]="castCondition(item).valueType === 'VARIABLE' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'bg-white text-slate-400 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'"
                  class="px-2 py-1 text-[10px] font-bold"
                  title="Usar Variable de Entorno">
                  {{ '{ }' }}
                </button>
             </div>

             <!-- Value Input (Literal) -->
             <input *ngIf="castCondition(item).valueType !== 'VARIABLE'"
                    [(ngModel)]="castCondition(item).value" 
                    type="text" 
                    class="text-xs rounded border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-1 px-2 w-24" 
                    placeholder="Valor">

             <!-- Value Select (Variable) -->
             <select *ngIf="castCondition(item).valueType === 'VARIABLE'"
                     [(ngModel)]="castCondition(item).value"
                     class="text-xs rounded border-slate-200 dark:border-slate-600 py-1 w-24 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                <option value="" disabled>-- Var --</option>
                <option *ngFor="let v of prefs.userVariables()" [value]="v.key">{{ v.key }}</option>
                <option *ngIf="prefs.userVariables().length === 0" disabled>No hay vars</option>
             </select>

             <button (click)="removeRule(i)" class="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 ml-auto p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
               <lucide-icon name="x" class="w-3 h-3"></lucide-icon>
             </button>
          </div>

          <!-- If it's a Group (Recursive) -->
          <app-rule-builder *ngIf="isGroup(item)" 
            [group]="castGroup(item)" 
            [availableFields]="availableFields"
            [isRoot]="false"
            (remove)="removeRule(i)">
          </app-rule-builder>

        </ng-container>
      </div>
    </div>
  `
})
export class RuleBuilderComponent {
  @Input() group!: RuleGroup;
  @Input() availableFields: { key: string, label: string }[] = [];
  @Input() isRoot = false;
  @Output() remove = new EventEmitter<void>();
  
  public prefs = inject(PreferenciasService);

  isGroup(node: any): boolean {
    return 'rules' in node && 'operator' in node;
  }

  castGroup(node: any): RuleGroup {
    return node as RuleGroup;
  }

  castCondition(node: any): RuleCondition {
    return node as RuleCondition;
  }

  addCondition() {
    this.group.rules.push({
      field: this.availableFields[0]?.key || '',
      operator: 'EQ',
      value: '',
      valueType: 'LITERAL'
    });
  }

  addGroup() {
    this.group.rules.push({
      operator: 'AND',
      rules: []
    });
  }

  removeRule(index: number) {
    this.group.rules.splice(index, 1);
  }

  removeSelf() {
    this.remove.emit();
  }
  
  toggleValueType(condition: RuleCondition, type: 'LITERAL' | 'VARIABLE') {
    condition.valueType = type;
    condition.value = ''; // Reset value on type switch
  }
}
