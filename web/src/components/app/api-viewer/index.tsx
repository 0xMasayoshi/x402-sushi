import { ApiViewerClient } from "./index.client";
import { groupByTag, apiSpec } from "@/lib/openapi";

/** Server component: prepares data and hands off to a tiny client island for Tabs/Accordion */
export function ApiViewer({ spec }: { spec: typeof apiSpec }) {
	const swapItems = groupByTag(spec.paths, "swap");
	const priceItems = groupByTag(spec.paths, "price");
	const tokenItems = groupByTag(spec.paths, "token");

	return (
		<ApiViewerClient
			title={spec.info.title}
			version={spec.info.version}
			swapItems={swapItems}
			priceItems={priceItems}
			tokenItems={tokenItems}
		/>
	);
}
