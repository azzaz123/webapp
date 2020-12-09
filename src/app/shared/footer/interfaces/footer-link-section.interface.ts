export interface FooterLinkSection {
  title: string;
  excludedLanguages?: string[];
  links: { label: string; href: string }[];
}
