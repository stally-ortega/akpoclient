export interface UserVariable {
  id: string;
  key: string;       // e.g. "MAX_DAILY_LOANS"
  value: any;        // e.g. 5
  type: 'NUMBER' | 'STRING' | 'BOOLEAN';
  description?: string;
  userId: string;    // Owner
}
