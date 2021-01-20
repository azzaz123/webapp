export interface UserImage {
  average_hex_color: string;
  id: string;
  original_height: number;
  original_width: number;
  urls_by_size: {
    large: string;
    medium: string;
    original: string;
    small: string;
    xlarge: string;
    xmall: string;
  };
}
