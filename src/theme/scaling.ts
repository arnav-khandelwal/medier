import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Standard mobile screen dimensions used as a base guideline (iPhone 11/12/13 Pro width 375, height 812)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

/**
 * Scale horizontally based on screen width.
 * Best for margins, padding, widths, fontSizes.
 */
export const scale = (size: number): number => (width / guidelineBaseWidth) * size;

/**
 * Scale vertically based on screen height.
 * Best for heights, vertical spacing.
 */
export const verticalScale = (size: number): number => (height / guidelineBaseHeight) * size;

/**
 * Scale with moderation.
 * Useful when you don't want linear scaling (e.g. font sizes on tablets).
 */
export const moderateScale = (size: number, factor: number = 0.5): number =>
  size + (scale(size) - size) * factor;

export { width as screenWidth, height as screenHeight };
export const isTablet = width >= 768;
export const isSmallDevice = width < 375;
export const isTallDevice = height > 850;
export const isShortDevice = height < 700;
export const deviceAspectRatio = height / width;
export const percentWidth = (percent: number): number => (width * percent) / 100;
export const percentHeight = (percent: number): number => (height * percent) / 100;
export const topOffset = verticalScale(40);
