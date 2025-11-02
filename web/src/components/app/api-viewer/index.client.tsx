"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EndpointAccordion, type EndpointItem } from "./endpoint-accordion";

export function ApiViewerClient({
	title,
	version,
	swapItems,
	priceItems,
	tokenItems,
}: {
	title: string;
	version: string;
	swapItems: EndpointItem[];
	priceItems: EndpointItem[];
	tokenItems: EndpointItem[];
}) {
	return (
		<div className="w-full">
			<Tabs defaultValue="swap" className="w-full">
				<TabsList className="mb-4 bg-secondary/60">
					<TabsTrigger value="swap">Swap</TabsTrigger>
					<TabsTrigger value="price">Price</TabsTrigger>
					<TabsTrigger value="token">Token</TabsTrigger>
				</TabsList>

				<TabsContent value="swap">
					<EndpointAccordion items={swapItems} />
				</TabsContent>

				<TabsContent value="price">
					<EndpointAccordion items={priceItems} />
				</TabsContent>

				<TabsContent value="token">
					<EndpointAccordion items={tokenItems} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
