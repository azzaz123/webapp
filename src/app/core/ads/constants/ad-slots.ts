type MobileSize = 'small' | 'medium' | 'big';

export const AD_SLOT_NETWORK_ID = 6866;
export const AD_DESKTOP_SCREEN_SIZE: number[] = [980, 250];
export const AD_DESKTOP_MAPPING: number[][] = [
  [728, 90],
  [970, 90],
  [980, 90],
  [970, 250],
  [980, 200],
  [980, 250],
];
export const AD_DESKTOP_VERTICAL_MAPPING: number[][] = [
  [300, 250],
  [336, 280],
  [300, 600],
  [120, 600],
  [160, 600],
];
export const AD_TABLET_SCREEN_SIZE: number[] = [728, 250];
export const AD_TABLET_MAPPING: number[][] = [
  [728, 90],
  [728, 250],
];
export const AD_MOBILE_SCREEN_SIZE: number[] = [0, 0];
export const AD_MOBILE_MAPPING: { [key in MobileSize]: number[][] } = {
  small: [
    [300, 50],
    [300, 100],
    [320, 50],
    [320, 100],
  ],
  medium: [
    [300, 50],
    [300, 100],
    [320, 50],
    [320, 100],
    [300, 250],
    [336, 280],
  ],
  big: [
    [300, 50],
    [300, 100],
    [320, 50],
    [320, 100],
    [300, 250],
    [336, 280],
    [300, 600],
  ],
};
export const AD_DESKTOP_NATIVE_MAPPING = ['fluid', [220, 420]];
export const AD_MOBILE_NATIVE_MAPPING = ['fluid', [170, 420]];
export const AD_DESKTOP_NATIVE_WIDE_MAPPING = ['fluid', [680, 200]];
export const AD_MOBILE_NATIVE_WIDE_MAPPING = ['fluid', [336, 280]];
