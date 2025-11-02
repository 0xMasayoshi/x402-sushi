"use client";

import { QueryClientProvider } from "../components/app/providers/query-client-provider";
import { ReactNode } from "react";

export default function RootProviders({ children }: { children: ReactNode }) {
	return <QueryClientProvider>{children}</QueryClientProvider>;
}
