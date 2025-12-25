import { Injectable, inject } from '@angular/core';
import { RuleGroup, RuleCondition, Operator } from '../models/alertas.models';
import { PreferenciasService } from '../../preferencias/services/preferencias.service';

/**
 * Service for evaluating logical rules against data contexts.
 * Supports scalar values (Object) and collections (Array).
 */
@Injectable({
  providedIn: 'root'
})
export class RuleEvaluatorService {
  private prefs = inject(PreferenciasService);

  /**
   * Evaluates a rule node (Group or Condition) against a context.
   * - If context is an Array, returns true if ANY item matches (OR logic across collection).
   * - If context is an Object, evaluates directly against its properties.
   * @param node The rule or group to evaluate.
   * @param context The data context (single object or array of objects).
   */
  evaluate(node: RuleGroup | RuleCondition, context: unknown): boolean {
    if (this.isGroup(node)) {
      return this.evaluateGroup(node, context);
    } else {
      if (Array.isArray(context)) {
        return context.some(item => this.evaluateCondition(node, item));
      } else {
        return this.evaluateCondition(node, context);
      }
    }
  }

  /**
   * Finds all items in a collection that match the given rule group.
   * @param node The rule group to evaluate.
   * @param context The array of items to filter.
   * @returns Array of matching items.
   */
  findAllMatches(node: RuleGroup, context: unknown[]): unknown[] {
     return context.filter(item => this.evaluateGroup(node, item));
  }

  private isGroup(node: unknown): node is RuleGroup {
    return typeof node === 'object' && node !== null && 'rules' in node;
  }

  private evaluateGroup(group: RuleGroup, context: unknown): boolean {
    const results = group.rules.map(rule => this.evaluate(rule, context));
    
    if (group.operator === 'AND') {
      return results.every(r => r);
    } else { // OR
      return results.some(r => r);
    }
  }

  private evaluateCondition(condition: RuleCondition, context: unknown): boolean {
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

  private getValueFromPath(context: unknown, path: string): unknown {
    if (!context || typeof context !== 'object') return null;
    
    return path.split('.').reduce((obj, key) => {
      if (obj && typeof obj === 'object' && key in obj) {
        return (obj as Record<string, unknown>)[key];
      }
      return null;
    }, context as Record<string, unknown> | null | unknown);
  }
}
