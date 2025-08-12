import type {
	ApiRequest,
	ApiSuccessResponse,
	BooleanString,
	SatisfactoryClient,
} from "./client";

export type GetServerOptionsRequest = ApiRequest<"GetServerOptions">;

export type GetServerOptionsResponseData = {
	/**
	 * All current server option values. Key is the name of the option, and value is it's stringified value.
	 */
	serverOptions: {
		"FG.DSAutoPause": BooleanString;
		"FG.DSAutoSaveOnDisconnect": BooleanString;
		"FG.AutosaveInterval": string;
		"FG.ServerRestartTimeSlot": string;
		"FG.SendGameplayData": BooleanString;
		"FG.NetworkQuality": string;
		[key: string]: string;
	};
	/**
	 * Server option values that will be applied when the session or server restarts.
	 */
	pendingServerOptions: Record<string, string>;
};

export function getServerOptions(this: SatisfactoryClient) {
	return this.buildApiRequest<
		GetServerOptionsRequest,
		GetServerOptionsResponseData
	>("v1", {
		function: "GetServerOptions",
	})();
}
