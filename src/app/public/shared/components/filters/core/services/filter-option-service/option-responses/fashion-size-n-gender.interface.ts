export interface SizeNGenderResponse {
  female?: Size[];
  male?: Size[];
}

export interface Size {
  id: number;
  text: string;
}
