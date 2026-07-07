// Shared utility — also present in site/src/lib/utils.ts
// If updating, consider syncing across packages
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
