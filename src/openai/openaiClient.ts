import { AzureOpenAI } from "openai";

export function initOpenAIClient() {
	function getClient(): AzureOpenAI {
		const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "Your endpoint";

		// Required Azure OpenAI deployment name and API version
		const apiVersion =
			process.env.OPENAI_API_VERSION || "2024-08-01-preview";
		const deploymentName =
			process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o"; //This must match your deployment name.
		return new AzureOpenAI({
			endpoint,
			apiKey: process.env.AZURE_OPENAI_API_KEY,
			apiVersion,
			deployment: deploymentName,
		});
	}
	const clientAi = getClient();
	return clientAi;
}
