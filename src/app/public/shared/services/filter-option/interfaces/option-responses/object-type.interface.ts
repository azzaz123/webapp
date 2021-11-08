export interface ObjectType {
  id: string;
  name: string;
  excluded_fields?: string[];
  has_children?: boolean;
  children?: ObjectTypeChild[];
  hierarchy?: unknown[];
}

export interface ObjectTypeChild {
  id: string;
  name: string;
}
