import { converter, parse } from 'culori';
import css from '../../../design-tokens/tokens.css?raw';

type RGB = [number, number, number];

// The card follows the dark theme in the synced tokens (design/GUIDELINES.md rule 8).
const dark = css.slice(css.indexOf('.dark {'));
const toRgb = converter('rgb');

export function darkToken(name: string): RGB {
	const value = dark.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1];
	const rgb = value ? toRgb(parse(value)) : undefined;
	if (!rgb) throw new Error(`design token --${name} not found in the .dark block`);
	const channel = (c: number) => Math.round(Math.min(1, Math.max(0, c)) * 255);
	return [channel(rgb.r), channel(rgb.g), channel(rgb.b)];
}
