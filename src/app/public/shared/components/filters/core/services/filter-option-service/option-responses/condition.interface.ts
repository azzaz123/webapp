export interface ConditionResponse {
  category_id: string;
  conditions: Condition[];
}

export interface Condition {
  id: string;
  icon_id: string;
  text: string;
}
