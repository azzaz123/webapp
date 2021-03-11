export interface SearchItem {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  flags: {
    favourited: boolean;
    reserved: boolean;
    bumped: boolean;
  };
}
