import { generateMessage } from "../openai/generateMessage";
import { CompanyData } from "../types/company.type";
import { sendSms } from "./sendSms";

export async function sendBulkSms(companies: CompanyData[]) {
	for (const company of companies) {
		// Generate a personalized message for each company
		const message = await generateMessage(company);

		// Send the SMS
		// Introduce a delay to avoid sending messages too quickly
		await new Promise((resolve) => setTimeout(resolve, 1000));
		await sendSms(
			company.ownerPhone || "",
			` Hi Audi Anchorage, we specialize in enhancing business digital presence. Xelora can improve your website or integrate AI to streamline customer service. Let’s talk! Schedule a meeting: https://calendly.com/pajinew/xelora. My name is Taha, CEO of Xelora. Email: taha@xelora.tech
Updated company Audi Anchorage with message.`,
			company
		);
	}
}
