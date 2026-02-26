import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const THEME_KEY = "prismalens-theme";

type Theme = "light" | "dark";

function getStoredTheme(): Theme {
	if (typeof localStorage !== "undefined") {
		const stored = localStorage.getItem(THEME_KEY);
		if (stored === "light" || stored === "dark") return stored;
	}
	return "dark";
}

function applyTheme(theme: Theme) {
	const html = document.documentElement;
	if (theme === "dark") {
		html.classList.add("dark");
	} else {
		html.classList.remove("dark");
	}
}

export default function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>(getStoredTheme);

	useEffect(() => {
		applyTheme(theme);
		localStorage.setItem(THEME_KEY, theme);
	}, [theme]);

	useEffect(() => {
		function onStorage(e: StorageEvent) {
			if (e.key === THEME_KEY && (e.newValue === "light" || e.newValue === "dark")) {
				setTheme(e.newValue);
			}
		}
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

	function toggle() {
		setTheme((prev) => (prev === "dark" ? "light" : "dark"));
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggle}
			aria-label="Toggle theme"
			className="relative"
		>
			<Sun className={`h-5 w-5 transition-all ${theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
			<Moon className={`absolute h-5 w-5 transition-all ${theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`} />
		</Button>
	);
}
