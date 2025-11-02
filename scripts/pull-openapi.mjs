import fs from "node:fs/promises";
import SwaggerParser from "@apidevtools/swagger-parser";

const url = process.env.SUSHI_OPENAPI_URL || "https://docs.sushi.com/openapi.yaml";
const outFile = "web/src/lib/openapi/openapi.generated.json";

console.log("🔗 Pulling & dereferencing", url);
const deref = await SwaggerParser.dereference(url); // handles YAML + $ref
await fs.mkdir("src/lib", { recursive: true });
await fs.writeFile(outFile, JSON.stringify(deref, null, 2));
console.log("✅ Wrote", outFile);
