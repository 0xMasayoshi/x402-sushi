import type { OpenAPIV3_1 as O } from "openapi-types";
import spec from "./openapi.generated.json";

export const apiSpec = spec as Omit<O.Document, "paths"> & {
	paths: NonNullable<O.Document["paths"]>;
};
