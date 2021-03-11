export interface SearchItem {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  detailUrl: string;
  images: string[];
  flags: {
    favourited: boolean;
    sold: boolean;
    reserved: boolean;
    bumped: boolean;
    // BEFOREMERGE: Do we need to take actions on these flags?
    // pending: boolean;
    // banned: boolean;
    // expired: boolean;
    // onhold: boolean;
  };
}
