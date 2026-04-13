export function CodeBlock({ children, language }: { children: string; language: string }) {
	return (
		<div className="rounded-xl border border-border overflow-hidden shadow-sm">
			<div className="flex items-center gap-2 bg-code-bg px-4 py-3 border-b border-white/5">
				<div className="flex gap-1.5">
					<span className="size-3 rounded-full bg-white/10" />
					<span className="size-3 rounded-full bg-white/10" />
					<span className="size-3 rounded-full bg-white/10" />
				</div>
				<span className="ml-2 text-xs text-code-fg/50">{language}</span>
			</div>
			<pre className="bg-code-bg p-5 text-sm leading-relaxed text-code-fg">
				<code>{children}</code>
			</pre>
		</div>
	);
}
