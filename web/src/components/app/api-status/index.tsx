// components/status/health-indicator.tsx
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { CopyButton } from "../copy-button";

type Health = {
	ok: boolean;
	status: number;
	latency: number; // ms
	upstream: string;
	ts: string;
};

const API_BASE =
	process.env.NEXT_PUBLIC_X402_URL?.replace(/\/$/, "") ??
	"https://your-railway-api.example.com";

async function fetchHealth(): Promise<Health> {
	const url = `${API_BASE}/health`;
	const t0 = performance.now();
	const res = await fetch(url, { cache: "no-store" });
	const latency = Math.round(performance.now() - t0);
	// accept non-200 as "down" but still parse if it returns JSON
	let body: any = null;
	try {
		body = await res.json();
	} catch {
		/* ignore */
	}
	return {
		ok: res.ok,
		status: res.status,
		latency,
		upstream: url,
		ts: new Date().toISOString(),
		...body,
	};
}

export function ApiStatus({ intervalMs = 30_000 }: { intervalMs?: number }) {
	const q = useQuery({
		queryKey: ["x402-health"],
		queryFn: fetchHealth,
		refetchInterval: intervalMs,
		refetchOnWindowFocus: false,
		staleTime: intervalMs,
		retry: 1,
	});

	const data = q.data;
	const isDown = !q.isLoading && !data?.ok

	return (
		<div className="flex items-center gap-3">
			<div className="truncate text-sm text-muted-foreground">
				<span className="mr-2">x402 URL:</span>
				<code className="font-mono">
					{data?.upstream ?? `${API_BASE}/health`}
				</code>
			</div>

			<CopyButton
				value={data?.upstream ?? `${API_BASE}/health`}
				label="Copy URL"
				variant="ghost"
				size="icon"
				iconOnly
				hideTooltip={false}
			/>

			<Badge
				className={isDown ? "bg-red-600 text-white" : "bg-green-600 text-white"}
			>
				{isDown ? "DOWN" : "UP"}
			</Badge>

			<div className="text-xs text-muted-foreground">
				{typeof data?.latency === "number" ? `${data.latency} ms` : "— ms"}
			</div>

			<Button
				variant="ghost"
				size="icon"
				onClick={() => q.refetch()}
				title="Refresh"
				aria-label="Refresh"
			>
				<RefreshCw
					className={`h-4 w-4 ${q.isFetching ? "animate-spin" : ""}`}
				/>
			</Button>
		</div>
	);
}
