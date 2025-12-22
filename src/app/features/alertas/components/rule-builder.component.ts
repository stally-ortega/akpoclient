import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { RuleGroup, RuleCondition, Operator } from '../models/alertas.models';

@Component({
  selector: 'app-rule-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="border-l-2 border-slate-200 pl-4 py-2 space-y-3">
      <!-- Group Header -->
      <div class="flex items-center gap-3">
        <select [(ngModel)]="group.operator" class="text-xs font-bold uppercase rounded border-slate-300 bg-slate-100 px-2 py-1">
          <option value="AND">Y (Todas)</option>
          <option value="OR">O (Cualquiera)</option>
        </select>
        
        <div class="flex gap-2">
          <button (click)="addCondition()" class="text-xs flex items-center gap-1 text-slate-600 hover:text-primary transition-colors">
            <lucide-icon name="plus" class="w-3 h-3"></lucide-icon> Condición
          </button>
          <button (click)="addGroup()" class="text-xs flex items-center gap-1 text-slate-600 hover:text-primary transition-colors">
            <lucide-icon name="plus" class="w-3 h-3"></lucide-icon> Grupo
          </button>
          <button *ngIf="!isRoot" (click)="removeSelf()" class="text-xs text-red-500 hover:text-red-700 ml-2">
             <lucide-icon name="trash" class="w-3 h-3"></lucide-icon>
          </button>
        </div>
      </div>

      <!-- Children -->
      <div class="space-y-2">
        <ng-container *ngFor="let item of group.rules; let i = index">
          
          <!-- If it's a Condition -->
          <div *ngIf="!isGroup(item)" class="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-100">
             <!-- Field Selector -->
             <select [(ngModel)]="castCondition(item).field" class="text-xs rounded border-slate-200 py-1">
               <option *ngFor="let f of availableFields" [value]="f.key">{{ f.label }}</option>
             </select>

             <!-- Operator -->
             <select [(ngModel)]="castCondition(item).operator" class="text-xs rounded border-slate-200 py-1 font-mono">
               <option value="EQ">=</option>
               <option value="NEQ">!=</option>
               <option value="GT">&gt;</option>
               <option value="LT">&lt;</option>
               <option value="GTE">&gt;=</option>
               <option value="LTE">&lt;=</option>
               <option value="CONTAINS">Contiene</option>
             </select>

             <!-- Value -->
             <input [(ngModel)]="castCondition(item).value" type="text" class="text-xs rounded border-slate-200 py-1 px-2 w-24" placeholder="Valor">

             <button (click)="removeRule(i)" class="text-slate-400 hover:text-red-500 ml-auto">
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
      value: ''
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
}
