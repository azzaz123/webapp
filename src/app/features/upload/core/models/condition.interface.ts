export interface Condition {
  id: string;
  title: string;
  description: string;
}

export interface ConditionsResponse {
  category_id: number;
  conditions: Condition[];
}
