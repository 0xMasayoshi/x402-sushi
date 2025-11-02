"use client";

import copy from "copy-to-clipboard";
import {
	useCallback,
	useEffect,
	useState,
	type FC,
	type ReactNode,
} from "react";

export function useCopyClipboard(
	timeout = 500,
): [boolean, (toCopy: string) => void] {
	const [isCopied, setIsCopied] = useState(false);

	const staticCopy = useCallback((text: string) => {
		const didCopy = copy(text);
		setIsCopied(didCopy);
	}, []);

	useEffect(() => {
		if (isCopied) {
			const hide = setTimeout(() => {
				setIsCopied(false);
			}, timeout);

			return () => {
				clearTimeout(hide);
			};
		}
		return undefined;
	}, [isCopied, timeout]);

	return [isCopied, staticCopy];
}

interface ClipboardControllerPayload {
	isCopied: boolean;
	setCopied(toCopy: string): void;
}

interface ClipboardControllerProps {
	hideTooltip?: boolean;
	children: (payload: ClipboardControllerPayload) => ReactNode;
}

export const ClipboardController: FC<ClipboardControllerProps> = ({
	children,
	hideTooltip = false,
}) => {
	const [isCopied, setCopied] = useCopyClipboard();

	const body = children({ isCopied, setCopied });

	if (hideTooltip) return <>{body}</>;

	return (
		<div className="group relative inline-flex">
			{body}
			<div
				role="status"
				className="pointer-events-none absolute left-1/2 z-10 hidden -translate-x-1/2 translate-y-1 group-hover:block"
			>
				<span className="rounded-xl bg-foreground/80 px-2 py-0.5 text-[10px] text-background shadow-sm">
					{isCopied ? "Copied!" : "Copy"}
				</span>
			</div>
		</div>
	);
};
