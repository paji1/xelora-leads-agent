import {
	DefaultAzureCredential,
	getBearerTokenProvider,
} from "@azure/identity";
import type {
	ChatCompletion,
	ChatCompletionCreateParamsNonStreaming,
} from "openai/resources/index";
import { CompanyData } from "../types/company.type";
import { initOpenAIClient } from "./openaiClient";
import { clientAi } from "..";

// keyless authentication

// Initialize OpenAI API

export async function generateMessage(company: CompanyData): Promise<string> {
	const companyName = process.env.COMPANY_NAME || "Default Company Name";
	const companyOwner = process.env.COMPANY_OWNER || "Default Company Name";
	const prompt = `
You are a representative of ${companyName}, a tech agency that helps businesses improve their digital presence by creating or enhancing websites and integrating AI solutions. 
Based on the following company details, craft a personalized message offering ${companyName}'s services:
Note: Please avoid using em dashes or dash and use commas or periods instead.
make it more professional and friendly. and not too long a bit short .
include the exapmle of product or service that ${companyName} can provide.
like website development, AI integration, etc.
at end put My name is ${
		companyOwner.charAt(0).toUpperCase() + companyOwner.slice(1)
	} , and position is CEO of ${companyName}.
and email is ${companyOwner}@${companyName}.tech
dont add any other information.
give him this link to book a meeting with me https://calendly.com/pajinew/${companyName}
Make sure the message fits within 1 SMS (GSM-7: max 160 characters, or UCS-2: max 70 characters if using emojis or special characters). Avoid exceeding Twilio SMS length limits.
Company Details:
- Name: ${company.name}
- Owner: ${company.ownerFirstName} ${company.ownerLastName}
- Address: ${company.address || "Not provided"}
- Email: ${company.ownerEmail || "Not provided"}
- Phone: ${company.ownerPhone || "Not provided"}
- Additional Info: ${JSON.stringify(company, null, 2)}

Message:
`;

	try {
		const response = await clientAi.chat.completions.create({
			model: "gpt-4o",
			messages: [
				{
					role: "system",
					content:
						"You are a helpful assistant that generates personalized business messages.",
				},
				{ role: "user", content: prompt },
			],
			max_tokens: 200,
		});
		console.log("Generated message:", response.choices[0].message.content);
		return (
			response.choices[0].message.content ||
			"Hello, we at Xelora would love to help your business grow!"
		);
	} catch (error) {
		console.error("Error generating message:", error);
		return "Hello, we at Xelora would love to help your business grow!";
	}
}
