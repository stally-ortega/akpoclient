export type ModuloAlerta = 'PRESTAMOS' | 'INVENTARIO' | 'ACTAS' | 'GENERAL';
export type TipoAlerta = 'GENERAL' | 'ESPECIFICA';

export type Operator = 'EQ' | 'GT' | 'LT' | 'GTE' | 'LTE' | 'NEQ' | 'CONTAINS';
export type GroupOperator = 'AND' | 'OR';

export interface RuleCondition {
  field: string;
  operator: Operator;
  value: any;
  valueType?: 'LITERAL' | 'VARIABLE'; // Default 'LITERAL'
}

export interface RuleGroup {
  operator: GroupOperator;
  rules: (RuleCondition | RuleGroup)[];
}

export interface TriggerCondition {
  operator: 'GT' | 'LT' | 'GTE' | 'LTE' | 'EQ';
  value: number;
}

export interface AlertConfig {
  id: string;
  nombre: string;
  mensaje: string;
  modulo: ModuloAlerta;
  tipo: TipoAlerta;
  target?: string;
  horaInicio: string;  // HH:mm for daily check
  activo: boolean;
  
  // Ownership
  isGlobal: boolean;   // If true, applies to all users
  userId?: string;     // ID of the owner (if private)
  
  // Logic
  rootRule: RuleGroup;
  triggerCondition?: TriggerCondition; // New: Aggregation logic
  ultimaEjecucion?: Date;
}
