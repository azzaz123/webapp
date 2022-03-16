export interface NavigationElement {
  text: string;
  external: boolean;
  alternativeText: string;
  href: string;
  icon?: string;
  onClick?: Function;
}
