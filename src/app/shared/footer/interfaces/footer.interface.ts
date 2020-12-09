export interface FooterLinkSection {
  title: string;
  excludedLanguages?: string[];
  links: { label: string; href: string }[];
}

export interface FooterIcon {
  label: string;
  href: string;
  iconSrc: string;
}
