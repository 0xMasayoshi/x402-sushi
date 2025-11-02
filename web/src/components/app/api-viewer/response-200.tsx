"use client";

import type { OpenAPIV3_1 as O } from "openapi-types";
import { Card, CardContent } from "@/components/ui/card";
import { toPretty } from "@/lib/openapi";
import { CopyButton } from "@/components/app/copy-button";

export function Response200({
	responses,
}: {
	responses?: Record<string, O.ResponseObject>;
}) {
	const resp = responses?.["200"];
	if (!resp) {
		return (
			<p className="text-sm text-muted-foreground">
				No success response documented.
			</p>
		);
	}

	const pretty = toPretty(resp);

	return (
		<Card className="border-border bg-secondary/40">
			<CardContent className="p-0">
				<div className="flex items-center justify-between border-b border-border px-4 py-2">
					<div className="text-sm text-muted-foreground">
						200 • {resp.description ?? "Success"}
					</div>
					<CopyButton
						value={pretty} // lazy so we don’t allocate until click (even though this is server-rendered)
						label="Copy JSON"
						variant="ghost"
						size="icon"
						iconOnly
						hideTooltip={false}
					/>
				</div>
				<pre className="overflow-x-auto p-4 text-sm">
					<code>{pretty}</code>
				</pre>
			</CardContent>
		</Card>
	);
}
