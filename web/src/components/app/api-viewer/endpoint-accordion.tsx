"use client";

import { Badge } from "@/components/ui/badge";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Response200 } from "./response-200";
import type { OpenAPIV3_1 as O } from "openapi-types";

export type EndpointItem = {
	path: string;
	method: string;
	summary?: string;
	description?: string;
	parameters: O.ParameterObject[];
	responses: Record<string, O.ResponseObject>;
};

export function EndpointAccordion({ items }: { items: EndpointItem[] }) {
	return (
		<Accordion type="single" collapsible className="w-full">
			{items.map((e, idx) => (
				<AccordionItem key={`${e.path}-${idx}`} value={`${e.path}-${idx}`}>
					<AccordionTrigger className="text-left hover:text-primary">
						<div className="flex items-center gap-3">
							<Badge className="bg-primary text-primary-foreground">
								{e.method}
							</Badge>
							<span className="font-mono">{e.path}</span>
						</div>
					</AccordionTrigger>

					<AccordionContent>
						<div className="space-y-4">
							{(e.summary || e.description) && (
								<div className="space-y-1">
									{e.summary && <p className="text-sm">{e.summary}</p>}
									{e.description && (
										<p className="text-sm text-muted-foreground">
											{e.description}
										</p>
									)}
								</div>
							)}

							<Separator />

							{/* Compact parameters */}
							<div className="space-y-2">
								<div className="text-[11px] uppercase tracking-wide text-muted-foreground">
									Parameters
								</div>
								{e.parameters?.length ? (
									<div className="grid gap-1.5">
										{e.parameters.map((p, i) => {
											const schema = p.schema as O.SchemaObject | undefined;
											return (
												<div
													key={`${p.in}-${p.name}-${i}`}
													className="rounded-md border border-border bg-muted/40 px-2 py-1.5 text-xs leading-tight"
												>
													<div className="flex flex-wrap items-center gap-1.5">
														<Badge
															variant="secondary"
															className="px-1 py-0 text-[10px]"
														>
															{p.in}
														</Badge>
														<code className="font-mono text-[11px]">
															{p.name}
														</code>
														{p.required && (
															<Badge
																variant="destructive"
																className="px-1 py-0 text-[10px]"
															>
																req
															</Badge>
														)}
														{schema?.type && (
															<span className="text-[11px] text-muted-foreground">
																({schema.type}
																{schema?.format ? `, ${schema.format}` : ""})
															</span>
														)}
														{typeof schema?.default !== "undefined" && (
															<span className="text-[11px] text-muted-foreground">
																• default: {String(schema.default)}
															</span>
														)}
														{schema?.enum && Array.isArray(schema.enum) && (
															<span className="text-[11px] text-muted-foreground">
																• enum: {schema.enum.join(", ")}
															</span>
														)}
													</div>
													{p.description && (
														<p className="mt-0.5 text-[11px] text-muted-foreground">
															{p.description}
														</p>
													)}
												</div>
											);
										})}
									</div>
								) : (
									<p className="text-sm text-muted-foreground">
										No parameters.
									</p>
								)}
							</div>

							<div className="space-y-2">
								<div className="text-[11px] uppercase tracking-wide text-muted-foreground">
									Response (200)
								</div>
								<Response200 responses={e.responses} />
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
}
