const reHexShort = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
const reHexFull = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

export type RGB = {
    r: number;
    g: number;
    b: number;
};

export const hexToRGB = (hex: string): RGB => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    hex = hex.replace(reHexShort, (_, r, g, b) => r + r + g + g + b + b);

    const result = reHexFull.exec(hex);
    if (!result) {
        throw `failed to parse ${hex}`;
    }
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    };
};

export const rgbToString = (rgb: RGB, alpha: number = 1): string =>
    `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;

export const rgbToNumber = ({ r, g, b }: RGB): number =>
    (1 << 24) + (r << 16) + (g << 8) + b;
