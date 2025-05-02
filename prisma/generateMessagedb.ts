import { Company } from "@/generated/prisma";

export async function generateMessage(
	company: Company,
	clientAi: any
): Promise<string> {
	const prompt = `
You are a representative of Xelora, a tech agency that helps businesses improve their digital presence by creating or enhancing websites and integrating AI solutions. 
Based on the following company details, craft a personalized message offering Xelora's services:
Note: Please avoid using em dashes or dash and use commas or periods instead.
make it more professional and friendly. and not too long a bit short .
include the exapmle of product or service that Xelora can provide.
like website development, AI integration, etc.
at end put My name is Taha , and position is CEO of Xelora.
and email is taha@xelora.tech
dont add any other information.
give him this link to book a meeting with me https://calendly.com/pajinew/xelora
Make sure the message fits within 1 SMS (GSM-7: max 160 characters, or UCS-2: max 70 characters if using emojis or special characters). Avoid exceeding Twilio SMS length limits.
Company Details:
- Name: ${company.name}
- Address: ${company.address || "Not provided"}
- Additional Info: ${JSON.stringify(company, null, 2)}

from additional info  get custumized message for the company
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
