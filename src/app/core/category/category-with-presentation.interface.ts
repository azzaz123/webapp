export interface CategoryWithPresentation {
  id: number;
  name: string;
  subcategories: CategoryWithPresentation[];
  presentation: { background_color: string; image_url: string; title_color: string };
}
