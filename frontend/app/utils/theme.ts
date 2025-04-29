import { theme } from '../styles/theme';

type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

type ColorCategory = keyof typeof theme.colors;
type PrimaryColorName = keyof typeof theme.colors.primary;
type ColorName = PrimaryColorName | keyof typeof theme.colors.success | keyof typeof theme.colors.warning | keyof typeof theme.colors.error;
type AnimationName = keyof typeof theme.animation.keyframes;

const isPrimaryColor = (category: ColorCategory, name: ColorName): name is PrimaryColorName => {
  return category === 'primary' && (name === 'indigo' || name === 'violet' || name === 'purple');
};

export const getColor = (color: `${ColorCategory}.${ColorName}`, shade: ColorShade = 500) => {
  const [category, name] = color.split('.') as [ColorCategory, ColorName];
  if (isPrimaryColor(category, name)) {
    return (theme.colors[category] as typeof theme.colors.primary)[name][shade];
  }
  return (theme.colors[category] as Record<ColorName, Record<ColorShade, string>>)[name][shade];
};

export const getAnimation = (name: AnimationName, duration: keyof typeof theme.animation.durations = 'normal') => {
  return `${theme.animation.keyframes[name]} ${theme.animation.durations[duration]} ${theme.animation.timingFunctions.easeInOut}`;
};

export const getShadow = (size: keyof typeof theme.shadows = 'DEFAULT') => {
  return theme.shadows[size];
};

export const getBorderRadius = (size: keyof typeof theme.borderRadius = 'DEFAULT') => {
  return theme.borderRadius[size];
};

export const getBackdropBlur = (size: keyof typeof theme.backdropBlur = 'DEFAULT') => {
  return theme.backdropBlur[size];
};

export const getGradient = (startColor: `${ColorCategory}.${ColorName}`, endColor: `${ColorCategory}.${ColorName}`, angle: number = 45) => {
  return `linear-gradient(${angle}deg, ${getColor(startColor)} 0%, ${getColor(endColor)} 100%)`;
};

export const getGlow = (color: `${ColorCategory}.${ColorName}`, intensity: number = 0.3) => {
  const rgb = getColor(color).match(/\d+/g)?.map(Number) || [0, 0, 0];
  return `0 0 20px rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${intensity})`;
};

export const getTransition = (property: string, duration: keyof typeof theme.animation.durations = 'normal') => {
  return `${property} ${theme.animation.durations[duration]} ${theme.animation.timingFunctions.easeInOut}`;
}; 