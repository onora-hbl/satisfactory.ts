import { ApiRequest, SatisfactoryClient } from "./client";

export type HealthCheckRequest = ApiRequest<
	"HealthCheck",
	{
		/**
		 * Custom Data passed from the Game Client or Third Party service. Not used by vanilla Dedicated Servers.
		 */
		clientCustomData: string;
	}
>;

export type HealthCheckResponseData = {
	/**
	 * "healthy" if tick rate is above ten ticks per second, "slow" otherwise.
	 */
	health: "healthy" | "slow";
	/**
	 * Custom Data passed from the Dedicated Server to the Game Client or Third Party service. Vanilla Dedicated Server returns empty string.
	 */
	serverCustomData: string;
};

export function healthCheck(this: SatisfactoryClient) {
	return this.buildApiRequest<HealthCheckRequest, HealthCheckResponseData>(
		"v1",
		{
			function: "HealthCheck",
		}
	)({ data: { clientCustomData: "" } });
}
