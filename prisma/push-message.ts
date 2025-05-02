import { PrismaClient } from "../generated/prisma";
import { exit } from "process";
import { initOpenAIClient } from "../src/openai/openaiClient";
import { generateMessage } from "./generateMessagedb";

const prisma = new PrismaClient();

// Initialize OpenAI API

async function generateMessagesdb() {
	const clientAi = initOpenAIClient();
	try {
		// Fetch all companies from the database
		const companies = await prisma.company.findMany();

		for (const company of companies) {
			// await new Promise((resolve) => setTimeout(resolve, 500)); // Add a 1-second delay for rate limiting
			try {
				let message: string | null = null;
				let attempts = 0;
				const maxAttempts = 5;
				const retryDelay = 500; // 1 second

				while (!message && attempts < maxAttempts) {
					try {
						message = await generateMessage(company, clientAi);
					} catch (error) {
						attempts++;
						console.error(
							`Attempt ${attempts} failed for company ${company.name}:`,
							error
						);
						if (attempts < maxAttempts) {
							await new Promise((resolve) =>
								setTimeout(resolve, retryDelay)
							);
						} else {
							console.error(
								`Max attempts reached for company ${company.name}. Skipping.`
							);
						}
					}
				}
				// Update the company with the generated message
				await prisma.company.update({
					where: { name: company.name },
					data: { message },
				});
				console.log(`Updated company ${company.name} with message.`);
			} catch (error) {
				console.error(
					`Error generating message for company ${company.name}:`,
					error
				);
			}
		}
	} catch (error) {
		console.error("Error generating messages:", error);
	} finally {
		await prisma.$disconnect();
	}
}

generateMessagesdb();
