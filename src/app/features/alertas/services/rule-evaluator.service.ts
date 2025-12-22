import { Injectable, inject } from '@angular/core';
import { RuleGroup, RuleCondition, Operator } from '../models/alertas.models';
import { PreferenciasService } from '../../preferencias/services/preferencias.service';

@Injectable({
  providedIn: 'root'
})
export class RuleEvaluatorService {
  private prefs = inject(PreferenciasService);

  /**
   * Evaluates a rule against a context.
   * - If context is an Array, checks if ANY item matches the simplified rule (Collection Mode).
   * - If context is an Object, checks properties directly (Scalar Mode).
   */
  evaluate(node: RuleGroup | RuleCondition, context: any | any[]): boolean {
    if (this.isGroup(node)) {
      return this.evaluateGroup(node, context);
    } else {
      // Determine if we are in "Collection Mode" (Context is Array) or "Scalar Mode"
      if (Array.isArray(context)) {
        // COLLECTION FILTERING: "Find ANY match in the array"
        return context.some(item => this.evaluateCondition(node, item));
      } else {
        return this.evaluateCondition(node, context);
      }
    }
  }

  findAllMatches(node: RuleGroup, context: any[]): any[] {
     // Return subsets that match
     return context.filter(item => this.evaluateGroup(node, item));
  }

  private isGroup(node: any): node is RuleGroup {
    return 'rules' in node;
  }

  private evaluateGroup(group: RuleGroup, context: any): boolean {
    const results = group.rules.map(rule => this.evaluate(rule, context));
    
    if (group.operator === 'AND') {
      return results.every(r => r);
    } else { // OR
      return results.some(r => r);
    }
  }

  private evaluateCondition(condition: RuleCondition, context: any): boolean {
    const itemValue = this.getValueFromPath(context, condition.field);
    
    // Resolve Target Value (Literal vs Variable)
    const targetValue = this.prefs.resolveValue(condition.value, condition.valueType);

    switch (condition.operator) {
      case 'EQ': return itemValue == targetValue;
      case 'NEQ': return itemValue != targetValue;
      case 'GT': return Number(itemValue) > Number(targetValue);
      case 'LT': return Number(itemValue) < Number(targetValue);
      case 'GTE': return Number(itemValue) >= Number(targetValue);
      case 'LTE': return Number(itemValue) <= Number(targetValue);
      case 'CONTAINS': 
        return String(itemValue).toLowerCase().includes(String(targetValue).toLowerCase());
      default: return false;
    }
  }

  private getValueFromPath(context: any, path: string): any {
    if (!context) return null;
    return path.split('.').reduce((obj, key) => obj?.[key], context);
  }
}
