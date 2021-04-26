export interface ConditionResponse {
  category_id: string;
  conditions: Condition[];
}

export interface Condition {
  id: string;
  title: string;
  description: string;
}
