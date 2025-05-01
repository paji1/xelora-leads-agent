import { client } from "..";
import { Company } from "../models/Company";
import { SmsLog } from "../models/SmsLog";
import { CompanyData } from "../types/company.type";

async function ensureCompanyExists(companyData: Partial<Company>) {
	const existingCompany = await Company.findOne({ name: companyData.name });
	if (!existingCompany) {
		// Pass companyData directly to Company.create
		const newCompany = await Company.create(companyData);
		console.log(`New company added: ${newCompany.name}`);
		return newCompany;
	}
	return existingCompany;
}
export async function sendSms(
	to: string,
	message: string,
	companyData: CompanyData
) {
	const fromPhone = process.env.TWILIO_PHONE_NUMBER || "";
	try {
		// Ensure the company exists in the database

		const company = await ensureCompanyExists(companyData);

		const result = await client.messages.create({
			from: fromPhone,
			to,
			body: message,
		});

		console.log(`Message sent to ${to}: ${result.sid}`);

		// Save success log to MongoDB
		await SmsLog.create({
			recipient: to,
			companyName: company.name,
			ownerfirstName: company.ownerFirstName,
			ownerlastName: company.ownerLastName,
			message,
			status: "sent",
			sid: result.sid,
			timestamp: new Date(),
		});
	} catch (error: any) {
		console.error(`Failed to send SMS to ${to}:`, error);

		// Save error log to MongoDB
		await SmsLog.create({
			recipient: to,
			companyName: companyData.name,
			ownerfirstName: companyData.ownerFirstName,
			ownerlastName: companyData.ownerLastName,
			message,
			status: "failed",
			error: error.message,
			timestamp: new Date(),
		});
	}
}
