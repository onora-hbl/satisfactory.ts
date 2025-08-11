import { healthCheck } from "./healthcheck";

export interface ApiRequest<TFunction extends string, TData = never> {
	function: TFunction;
	data?: TData;
}

export interface ApiSuccessResponse<TData> {
	data: TData;
}

export class ApiError extends Error {
	public status: number;
	public body?: unknown;

	constructor(status: number, message: string, body?: unknown) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.body = body;
	}
}

// export type BooleanString = "True" | "False";

export class SatisfactoryClient {
	private baseUrl: string;
	private accessToken?: string;
	private allowSelfSignedCertificates: boolean;

	constructor({
		baseUrl,
		accessToken,
		allowSelfSignedCertificates = false,
	}: {
		baseUrl?: string;
		accessToken?: string;
		allowSelfSignedCertificates?: boolean;
	} = {}) {
		if (baseUrl == null) {
			console.warn(
				"No baseUrl provided, using default: https://localhost:7777/api"
			);
			baseUrl = "https://localhost:7777/api";
		}

		if (accessToken == null) {
			console.warn(
				"No accessToken provided, some features may not work as expected."
			);
		}

		if (allowSelfSignedCertificates) {
			console.warn(
				"Allowing self-signed certificates can expose your application to security risks. Use with caution."
			);
		}

		this.baseUrl = baseUrl;
		this.accessToken = accessToken;
		this.allowSelfSignedCertificates = allowSelfSignedCertificates;
	}

	private async fetchWithTlsHandling(input: RequestInfo, init?: RequestInit) {
		if (this.allowSelfSignedCertificates) {
			process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
		}
		try {
			return await fetch(input, init);
		} finally {
			if (this.allowSelfSignedCertificates) {
				delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
			}
		}
	}

	public buildApiRequest<
		TRequest extends ApiRequest<string, unknown>,
		TResponse = unknown
	>(version: "v1", body: Pick<TRequest, "function">) {
		return async (
			extra?: Omit<TRequest, "function">
		): Promise<TResponse> => {
			const response = await this.fetchWithTlsHandling(
				`${this.baseUrl}/${version}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...(this.accessToken
							? { Authorization: `Bearer ${this.accessToken}` }
							: {}),
					},
					body: JSON.stringify({
						...(extra ?? {}),
						...body,
					}),
				}
			);

			const contentType = response.headers.get("content-type");
			const parsedBody = contentType?.includes("application/json")
				? await response.json().catch(() => undefined)
				: await response.text().catch(() => undefined);

			if (!response.ok) {
				throw new ApiError(
					response.status,
					`Request failed with status ${response.status}`,
					parsedBody
				);
			}

			return parsedBody as TResponse;
		};
	}

	public healthCheck = healthCheck;
}
