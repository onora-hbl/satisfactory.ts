import type { ApiRequest, SatisfactoryClient } from "./client";

export type ShutdownRequest = ApiRequest<"Shutdown">;

export type ShutdownResponse = string;

export function shutdown(this: SatisfactoryClient) {
	return this.buildApiRequest<ShutdownRequest, ShutdownResponse>("v1", {
		function: "Shutdown",
	})();
}
