export interface FooterLink {
  label: string;
  href: string;
}
export interface FooterLinkSection {
  title: string;
  excludedLanguages?: string[];
  links: FooterLink[];
}

export interface FooterIcon {
  label: string;
  href: string;
  iconSrc: string;
}
