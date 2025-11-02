import type { OpenAPIV3_1 as O } from "openapi-types";

export type GroupedEndpoint = {
	path: string;
	method: string;
	summary?: string;
	description?: string;
	parameters: O.ParameterObject[];
	responses: Record<string, O.ResponseObject>;
};

export function groupByTag(
	paths: O.PathsObject,
	tag: string,
): GroupedEndpoint[] {
	const items: GroupedEndpoint[] = [];

	for (const [path, def] of Object.entries(paths)) {
		const op = def?.get as O.OperationObject | undefined;
		if (!op || !op.tags?.includes(tag)) continue;

		const parameters = (op.parameters ?? []) as O.ParameterObject[];
		const responses200 = (
			op.responses as Record<string, O.ResponseObject> | undefined
		)?.["200"];

		const responses: Record<string, O.ResponseObject> = {};
		if (responses200) responses["200"] = responses200;

		items.push({
			path,
			method: "GET",
			summary: op.summary,
			description: op.description,
			parameters,
			responses,
		});
	}

	return items;
}

export function toPretty(resp: O.ResponseObject): string {
	const content = resp.content?.["application/json"];
	const candidate =
		content?.example ?? content?.examples ?? content?.schema ?? resp;
	try {
		return typeof candidate === "string"
			? candidate
			: JSON.stringify(candidate, null, 2);
	} catch {
		return String(candidate);
	}
}
