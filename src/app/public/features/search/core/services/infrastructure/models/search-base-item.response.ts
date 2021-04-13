export interface SearchBaseItemResponse {
  id: string;
  title: string;
  distance: number;
  images: {
    small: string;
  }[];
  flags: {
    reserved: boolean;
  };
  visibility_flags: {
    bumped: boolean;
  };
  price: number;
  currency: string;
  web_slug: string;
  category_id: number;
}
