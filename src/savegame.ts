import type { ApiRequest, SatisfactoryClient } from "./client";

export type SaveGameRequest = ApiRequest<
	"SaveGame",
	{
		/**
		 * Name of the save game file to create.
		 *
		 * Passed name might be sanitized.
		 */
		saveName: string;
	}
>;

export type SaveGameResponse = string;

export function saveGame(this: SatisfactoryClient, saveName: string) {
	return this.buildApiRequest<SaveGameRequest, SaveGameResponse>("v1", {
		function: "SaveGame",
	})({
		data: {
			saveName,
		},
	});
}
