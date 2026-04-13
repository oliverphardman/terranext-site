"use client";

import { useCallback, useEffect, useState } from "react";
import { FaSun, FaMoon, FaCircleHalfStroke } from "react-icons/fa6";

type Theme = "system" | "light" | "dark";

function getSystemPreference(): "light" | "dark" {
	if (typeof window === "undefined") return "dark";
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
	const root = document.documentElement;
	if (theme === "system") {
		root.removeAttribute("data-theme");
	} else {
		root.setAttribute("data-theme", theme);
	}
}

function nextTheme(current: Theme): Theme {
	const systemIsDark = getSystemPreference() === "dark";

	switch (current) {
		case "system":
			return systemIsDark ? "light" : "dark";
		case "light":
			return systemIsDark ? "dark" : "system";
		case "dark":
			return systemIsDark ? "system" : "light";
	}
}

const LABELS: Record<Theme, string> = {
	system: "System",
	light: "Light",
	dark: "Dark",
};

function ThemeIcon({ theme }: { theme: Theme }) {
	const resolved = theme === "system" ? getSystemPreference() : theme;

	if (theme === "system") return <FaCircleHalfStroke className="size-3.5" />;
	if (resolved === "light") return <FaSun className="size-3.5" />;
	return <FaMoon className="size-3.5" />;
}

export function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>("system");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem("theme") as Theme | null;
		const initial = stored === "light" || stored === "dark" ? stored : "system";
		setTheme(initial);
		applyTheme(initial);
		setMounted(true);
	}, []);

	const toggle = useCallback(() => {
		const next = nextTheme(theme);
		setTheme(next);
		applyTheme(next);
		localStorage.setItem("theme", next);
	}, [theme]);

	if (!mounted) return null;

	return (
		<button
			type="button"
			onClick={toggle}
			className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
			aria-label={`Theme: ${LABELS[theme]}. Click to change.`}
		>
			<ThemeIcon theme={theme} />
		</button>
	);
}
