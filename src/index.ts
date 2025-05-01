import dotenv from "dotenv";

import { connectToDatabase } from "./config/db";
import { Company } from "./models/Company";

import { companiesdata } from "./data/dummydata";
import { twilioinit } from "./broadcasting/twilio";
import { sendBulkSms } from "./broadcasting/sendBulks";
import { initOpenAIClient } from "./openai/openaiClient";
import { PrismaClient } from "@prisma/client";
dotenv.config();
// Your Twilio Account SID and Auth Token

// Your Twilio phone number

// Initialize Twilio client

connectToDatabase();
export const clientAi = initOpenAIClient();

// Send bulk SMS

export const client = twilioinit();
async function main() {
	try {
		await sendBulkSms(companiesdata);
		console.log("Bulk SMS sending completed.");
	} catch (error) {
		console.error("An error occurred during bulk SMS sending:", error);
	}
}

main();
