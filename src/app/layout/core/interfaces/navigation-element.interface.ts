export interface NavigationElement {
  text: string;
  external: boolean;
  alternateText: string;
  href: string;
  icon?: string;
  children?: NavigationElement[];
  onClick?: Function;
}
