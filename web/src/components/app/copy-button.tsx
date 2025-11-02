"use client";

import { Slot } from "@radix-ui/react-slot";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { ClipboardController } from "./clipboard-controller";

type ValueProvider = string | (() => string);

function resolve(v: ValueProvider) {
	return typeof v === "function" ? v() : v;
}

export function CopyButton({
	value,
	label = "Copy",
	asChild,
	iconOnly,
	hideTooltip,
	...btn
}: {
	value: ValueProvider;
	label?: string;
	asChild?: boolean;
	iconOnly?: boolean;
	hideTooltip?: boolean;
} & Omit<React.ComponentProps<typeof Button>, "onClick">) {
	const Comp = asChild ? Slot : Button;

	return (
		<ClipboardController hideTooltip={hideTooltip}>
			{({ isCopied, setCopied }) => (
				<Comp
					{...btn}
					aria-label={label}
					title={isCopied ? "Copied" : label}
					onClick={() => setCopied(resolve(value))}
					className={!asChild ? `gap-2 ${btn.className ?? ""}` : btn.className}
				>
					{iconOnly ? (
						isCopied ? (
							<Check className="h-4 w-4" />
						) : (
							<Copy className="h-4 w-4" />
						)
					) : (
						<>
							{isCopied ? (
								<Check className="h-4 w-4" />
							) : (
								<Copy className="h-4 w-4" />
							)}
							<span>{isCopied ? "Copied" : label}</span>
						</>
					)}
				</Comp>
			)}
		</ClipboardController>
	);
}
