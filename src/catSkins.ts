export interface CatSpot {
  part: 'head' | 'body' | 'leftArm' | 'rightArm';
  x: number;
  y: number;
  rx: number;
  ry: number;
  rotation?: number;
  color: string;
  opacity?: number;
}

export type CatPattern = 'solid' | 'bicolor' | 'tuxedo' | 'tabby' | 'calico' | 'siamese';

export interface CatSkinConfig {
  id: string;
  name: string;
  emoji?: string;
  builtin?: boolean;

  furColor: string;
  furSecondaryColor?: string;
  outlineColor?: string;
  legLineColor?: string;

  pattern?: CatPattern;
  maskColor?: string;
  foreheadBridgeColor?: string;
  flankColor?: string;
  bellyBibColor?: string;
  stripeColor?: string;
  calicoPatchColor?: string;

  earOuterColor?: string;
  earTipColor?: string;
  earInnerColor?: string;
  earTuftColor?: string;

  tailColor?: string;
  tailTipColor?: string;
  tailFluffy?: boolean;
  tailStripes?: boolean;

  eyeColorTop: string;
  eyeColorBottom?: string;
  pupilColor?: string;
  eyeCatchlight?: boolean;
  eyeRimColor?: string;
  squintColor?: string;
  squintGlowColor?: string;
  noseColor?: string;
  mouthColor?: string;
  blushColor?: string;
  whiskerColor?: string;

  armColor?: string;
  pawColor?: string;
  pawOutlineColor?: string;
  armCreaseColor?: string;

  accentColor?: string;
  accentSideColor?: string;

  spots?: CatSpot[];
}

export interface ResolvedSkin {
  id: string;
  name: string;
  isDarkBase: boolean;
  furColor: string;
  furSecondaryColor: string;
  outlineColor: string | null;
  legLineColor: string;
  pattern: CatPattern;
  maskColor: string | null;
  foreheadBridgeColor: string | null;
  flankColor: string | null;
  bellyBibColor: string | null;
  stripeColor: string | null;
  calicoPatchColor: string | null;
  earOuterColor: string;
  earTipColor: string | null;
  earInnerColor: string | null;
  earTuftColor: string | null;
  tailColor: string;
  tailTipColor: string;
  tailFluffy: boolean;
  tailStripes: boolean;
  eyeColorTop: string;
  eyeColorBottom: string;
  pupilColor: string;
  eyeCatchlight: boolean;
  eyeRimColor: string | null;
  squintColor: string;
  squintGlowColor: string | null;
  noseColor: string | null;
  mouthColor: string | null;
  blushColor: string | null;
  whiskerColor: string;
  armColor: string;
  pawColor: string;
  pawOutlineColor: string | null;
  armCreaseColor: string | null;
  accentColor: string;
  accentSideColor: string;
  spots: CatSpot[];
}

function parseHexLuminance(hex: string): number {
  const m = hex.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return 0.5;
  let h = m[1];
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function isLightColor(hex: string): boolean {
  return parseHexLuminance(hex) > 0.48;
}

export function resolveCustomSkin(raw: CatSkinConfig): ResolvedSkin {
  const fur = raw.furColor || '#f2a452';
  const darkBase = !isLightColor(fur);
  const pattern: CatPattern = raw.pattern || 'solid';
  const defaultOutline = darkBase ? null : '#524840';
  const outlineColor = raw.outlineColor !== undefined ? (raw.outlineColor || null) : defaultOutline;
  const pawColor = raw.pawColor || (pattern === 'tuxedo' ? '#faf9f5' : fur);
  const armColor = raw.armColor || fur;
  const pawIsLight = isLightColor(pawColor);

  return {
    id: raw.id,
    name: raw.name || raw.id,
    isDarkBase: darkBase,
    furColor: fur,
    furSecondaryColor: raw.furSecondaryColor || fur,
    outlineColor,
    legLineColor:
      raw.legLineColor || (darkBase ? 'rgba(214, 218, 224, 0.62)' : 'rgba(82, 72, 64, 0.62)'),
    pattern,
    maskColor: raw.maskColor || (pattern === 'siamese' ? '#4a382c' : pattern === 'bicolor' ? '#9e8e7f' : null),
    foreheadBridgeColor: raw.foreheadBridgeColor || null,
    flankColor: raw.flankColor || null,
    bellyBibColor:
      raw.bellyBibColor || (pattern === 'tuxedo' ? '#faf9f5' : null),
    stripeColor:
      raw.stripeColor || (pattern === 'tabby' ? '#9e5318' : null),
    calicoPatchColor:
      raw.calicoPatchColor || (pattern === 'calico' ? '#3a3533' : null),
    earOuterColor: raw.earOuterColor || raw.maskColor || fur,
    earTipColor: raw.earTipColor || null,
    earInnerColor: raw.earInnerColor || (darkBase ? null : '#efc4c8'),
    earTuftColor: raw.earTuftColor || null,
    tailColor: raw.tailColor || raw.earOuterColor || raw.maskColor || fur,
    tailTipColor: raw.tailTipColor || raw.earTipColor || raw.tailColor || fur,
    tailFluffy: Boolean(raw.tailFluffy),
    tailStripes: Boolean(raw.tailStripes || pattern === 'tabby'),
    eyeColorTop: raw.eyeColorTop || '#5a94d6',
    eyeColorBottom: raw.eyeColorBottom || raw.eyeColorTop || '#a3d2f2',
    pupilColor: raw.pupilColor || '#10141e',
    eyeCatchlight: raw.eyeCatchlight ?? !darkBase,
    eyeRimColor: raw.eyeRimColor || (darkBase ? null : 'rgba(42, 46, 58, 0.78)'),
    squintColor: raw.squintColor || (darkBase ? raw.eyeColorTop || '#d4f044' : '#2c2928'),
    squintGlowColor: raw.squintGlowColor || null,
    noseColor: raw.noseColor !== undefined ? (raw.noseColor || null) : (darkBase ? null : '#ee8e9e'),
    mouthColor: raw.mouthColor || (darkBase ? null : 'rgba(72, 68, 76, 0.78)'),
    blushColor: raw.blushColor || (darkBase ? null : '#f492a6'),
    whiskerColor:
      raw.whiskerColor || (darkBase ? 'rgba(210, 214, 220, 0.56)' : 'rgba(84, 76, 70, 0.56)'),
    armColor,
    pawColor,
    pawOutlineColor:
      raw.pawOutlineColor !== undefined
        ? (raw.pawOutlineColor || null)
        : (pawIsLight ? outlineColor || '#524840' : null),
    armCreaseColor:
      raw.armCreaseColor !== undefined
        ? (raw.armCreaseColor || null)
        : (!pawIsLight ? 'rgba(216, 218, 222, 0.62)' : null),
    accentColor: raw.accentColor || '#d2f244',
    accentSideColor: raw.accentSideColor || '#8cb014',
    spots: Array.isArray(raw.spots) ? raw.spots : [],
  };
}

export const DEFAULT_BUILTIN_CATS: CatSkinConfig[] = [
  {
    id: 'black',
    name: '小黑猫',
    emoji: '🐈‍⬛',
    builtin: true,
    furColor: '#141314',
    eyeColorTop: '#d4f044',
    accentColor: '#d2f244',
    accentSideColor: '#8cb014',
  },
  {
    id: 'ragdoll',
    name: '布偶猫',
    emoji: '🐱',
    builtin: true,
    furColor: '#fbf9f3',
    eyeColorTop: '#2c5594',
    accentColor: '#7ac7ff',
    accentSideColor: '#4690d8',
  },
  {
    id: 'nuonuo',
    name: '糯糯',
    emoji: '🐱',
    builtin: true,
    furColor: '#c7c2b8',
    furSecondaryColor: '#aea99d',
    outlineColor: '#5d564c',
    pattern: 'tabby',
    bellyBibColor: '#fbf9f3',
    stripeColor: '#6e6a60',
    earOuterColor: '#a9a49b',
    earTipColor: '#5d5850',
    earInnerColor: '#efc4c8',
    earTuftColor: '#fcf9f2',
    tailColor: '#b8b3a8',
    tailTipColor: '#4a4038',
    tailFluffy: true,
    tailStripes: false,
    eyeColorTop: '#2c5594',
    eyeColorBottom: '#a3d2f2',
    eyeCatchlight: true,
    noseColor: '#ee8e9e',
    blushColor: '#f492a6',
    armColor: '#b5b0a6',
    pawColor: '#fcfaf4',
    accentColor: '#7ac7ff',
    accentSideColor: '#4690d8',
    spots: [
      {
        part: 'head',
        x: 0.32,
        y: -0.12,
        rx: 10,
        ry: 15,
        rotation: -0.5,
        color: '#8a6f4d',
        opacity: 0.85,
      },
      {
        part: 'head',
        x: 0.38,
        y: 0.3,
        rx: 12,
        ry: 17,
        rotation: -0.45,
        color: '#8a6f4d',
        opacity: 0.85,
      },
    ],
  },
];
