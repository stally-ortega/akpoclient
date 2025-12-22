import { Injectable } from '@angular/core';
import { RuleGroup, RuleCondition } from '../models/alertas.models';

@Injectable({
  providedIn: 'root'
})
export class RuleEvaluatorService {

  /**
   * Evaluates a rule against a context.
   * - If context is an Array, checks if ANY item matches the simplified rule.
   * - If context is an Object, checks properties directly.
   */
  evaluate(node: RuleGroup | RuleCondition, context: any): boolean {
    if (Array.isArray(context)) {
      // Collection Mode: Return true if count(matches) > 0 (Default "Exists")
      const matches = this.findAllMatches(node, context);
      return matches.length > 0;
    } else {
      // Scalar Mode (original)
      return this.evaluateItem(node, context);
    }
  }

  findAllMatches(node: RuleGroup | RuleCondition, context: any[]): any[] {
     return context.filter(item => this.evaluateItem(node, item));
  }

  // Recursive evaluator for a single item (or scalar context)
  private evaluateItem(node: RuleGroup | RuleCondition, item: any): boolean {
    if (this.isGroup(node)) {
      if (node.rules.length === 0) return true;
      if (node.operator === 'AND') {
        return node.rules.every(rule => this.evaluateItem(rule, item));
      } else {
        return node.rules.some(rule => this.evaluateItem(rule, item));
      }
    } else {
      return this.evaluateCondition(node, item);
    }
  }

  private evaluateCondition(condition: RuleCondition, item: any): boolean {
    const fieldValue = this.getValueFromContext(item, condition.field);
    const targetValue = condition.value;

    if (fieldValue === undefined || fieldValue === null) return false;

    // Type coercion for comparison
    const sField = String(fieldValue).toLowerCase();
    const sTarget = String(targetValue).toLowerCase(); 

    switch (condition.operator) {
      case 'EQ': return sField == sTarget;
      case 'NEQ': return sField != sTarget;
      case 'GT': return Number(fieldValue) > Number(targetValue);
      case 'LT': return Number(fieldValue) < Number(targetValue);
      case 'GTE': return Number(fieldValue) >= Number(targetValue);
      case 'LTE': return Number(fieldValue) <= Number(targetValue);
      case 'CONTAINS': return sField.includes(sTarget);
      default: return false;
    }
  }

  // ... helpers ...

  private getValueFromContext(context: any, path: string): any {
    // Basic support for "nested.path" if needed, currently assumes flat context or simple hierarchy
    return path.split('.').reduce((obj, key) => obj?.[key], context);
  }

  private isGroup(node: any): node is RuleGroup {
    return 'rules' in node && 'operator' in node;
  }
}
