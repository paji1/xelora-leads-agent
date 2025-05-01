import { generateMessage } from "../openai/generateMessage";
import { CompanyData } from "../types/company.type";
import { sendSms } from "./sendSms";

export async function sendBulkSms(companies: CompanyData[]) {
	for (const company of companies) {
		// Generate a personalized message for each company
		const message = await generateMessage(company);

		// Send the SMS
		await sendSms(company.ownerPhone || "", message, company);
	}
}
