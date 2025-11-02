import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApiViewer } from "@/components/app/api-viewer";
import { apiSpec } from "@/lib/openapi";
import { SushiIcon } from "@/components/ui/icons/sushi";
import { ApiStatus } from "@/components/app/api-status";

export default function Page() {
	return (
		<main className="min-h-screen bg-background text-foreground">
			{/* Hero */}
			<section className="relative hero-gradient">
				<div className="mx-auto max-w-6xl px-6 py-16">
					<div className="space-y-6">
						<div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
							<SushiIcon width={16} height={16} />
							Payment-gated swap API powered by x402
						</div>

						<h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
							x402 <span className="text-primary">Sushi</span>Swap
						</h1>

						<p className="max-w-2xl text-muted-foreground">
							Fast, flexible, and secure endpoints for quoting and executing
							swaps with first-class price and token data.
						</p>

						<div className="flex flex-wrap gap-3">
							<Button
								asChild
								size="lg"
								className="bg-primary text-primary-foreground hover:opacity-90"
							>
								<Link
									href="https://www.x402scan.com/server/26424cc4-4527-4349-a9e5-968e95801e65"
									target="_blank"
									rel="noreferrer"
								>
									View on x402 Scan <ArrowUpRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							<Button
								asChild
								variant="outline"
								size="lg"
								className="border-border hover:bg-secondary"
							>
								<Link
									href="https://github.com/0xMasayoshi/x402-sushi"
									target="_blank"
									rel="noreferrer"
								>
									<Github className="mr-2 h-4 w-4" /> See code on GitHub
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* API status / health indicator */}
			<section className="border-b border-border bg-muted/30">
				<div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="text-lg font-medium">x402 API Health</h2>
						<p className="text-sm text-muted-foreground">
							Live status of the x402 API endpoint
						</p>
					</div>
					<ApiStatus />
				</div>
			</section>

			{/* API Viewer (RSC) */}
			<section className="mx-auto max-w-6xl px-6 pb-20 pt-12">
				<div className="mb-6 flex items-center gap-2">
					<Badge className="bg-secondary text-secondary-foreground">
						OpenAPI {apiSpec.info.version}
					</Badge>
					<div className="text-sm text-muted-foreground">
						{apiSpec.info.title}
					</div>
				</div>

				<ApiViewer spec={apiSpec} />
			</section>
		</main>
	);
}
