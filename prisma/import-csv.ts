import { Company } from "./../src/models/Company";
import { exit } from "process";
import { PrismaClient } from "../generated/prisma";
import { parseCsvFile } from "../src/parsecsv/parse-csv";
import * as fs from "fs";
import * as path from "path";
import { connections } from "mongoose";
import { create } from "domain";

function getExecutivesFromRecord(record: Record<string, string>): Array<{
	firstName: string;
	lastName: string;
	title?: string;
	gender?: string;
}> {
	const executives: Array<{
		firstName: string;
		lastName: string;
		title?: string;
		gender?: string;
	}> = [];

	// Base executive fields (no index)
	const seenExecutives = new Set<string>();

	if (record["Executive First Name"] && record["Executive Last Name"]) {
		const key = `${record["Executive First Name"]} ${record["Executive Last Name"]}`;
		if (!seenExecutives.has(key)) {
			seenExecutives.add(key);
			executives.push({
				firstName: record["Executive First Name"],
				lastName: record["Executive Last Name"],
				title:
					record["Executive Title"] ||
					record["Professional Title"] ||
					undefined,
				gender: record["Executive Gender"] || undefined,
			});
		}
	}

	// Indexed executive fields (1 to 50)
	for (let i = 1; i <= 50; i++) {
		const firstName = record[`Executive First Name ${i}`];
		const lastName = record[`Executive Last Name ${i}`];
		if (firstName && lastName) {
			const key = `${firstName} ${lastName}`;
			if (!seenExecutives.has(key)) {
				seenExecutives.add(key);
				executives.push({
					firstName,
					lastName,
					title: record[`Executive Title ${i}`] || undefined,
					gender: record[`Executive Gender ${i}`] || undefined,
				});
			}
		}
	}

	return executives;
}

function getSicCodesFromRecord(record: Record<string, string>): Array<{
	code: string;
	description?: string;
	adSize?: string;
	yearAppeared?: number;
}> {
	const sicCodes: Array<{
		code: string;
		description?: string;
		adSize?: string;
		yearAppeared?: number;
	}> = [];

	const seenCodes = new Set<string>();

	// Primary SIC Code
	if (
		record["Primary SIC Code"] &&
		!seenCodes.has(record["Primary SIC Code"])
	) {
		seenCodes.add(record["Primary SIC Code"]);
		sicCodes.push({
			code: record["Primary SIC Code"],
			description: record["Primary SIC Description"] || undefined,
			adSize: record["Primary SIC Ad Size"] || undefined,
			yearAppeared: record["Primary SIC Year Appeared"]
				? parseInt(record["Primary SIC Year Appeared"])
				: undefined,
		});
	}

	// Indexed SIC Codes (1 to 10)
	for (let i = 1; i <= 10; i++) {
		const code = record[`SIC Code ${i}`];
		if (code && !seenCodes.has(code)) {
			seenCodes.add(code);
			sicCodes.push({
				code,
				description: record[`SIC Code ${i} Description`] || undefined,
				adSize: record[`SIC Code ${i} Ad Size`] || undefined,
				yearAppeared: record[`SIC Code ${i} Year Appeared`]
					? parseInt(record[`SIC Code ${i} Year Appeared`])
					: undefined,
			});
		}
	}

	return sicCodes;
}

const prisma = new PrismaClient();

const directories = [
	"src/data/cleaned_with_website_v2",
	"src/data/cleaned_without_website_v2",
];

const files = [
	"Car-Dealers.csv",
	"Restaurants-20.csv",
	"Management-&-Strategy-Consulting.csv",
	"hospitals.csv",
	"Offices-of-Lawyers-20.csv",
	"Detail2025042905520664.csv", // Only in cleaned_without_website_v2
];

async function importCsvs() {
	for (const dir of directories) {
		for (const file of fs.readdirSync(dir)) {
			if (!file.endsWith(".csv")) continue;
			const filePath = path.join(dir, file);
			const records = parseCsvFile(filePath);

			for (const record of records) {
				// Map CSV columns to Company fields
				const category = `${path.basename(dir)}_${file}`; // Adjust this to your needs
				try {
					const company = await prisma.company.create({
						data: {
							name: record["Company Name"],
							parentCompanyName:
								record["Parent Company Name"] || undefined,
							description:
								record["Company Description"] || undefined,
							website: record["Website"] || undefined,
							phoneNumber:
								record["Phone Number Combined"] || undefined,
							faxNumber:
								record["Fax Number Combined"] || undefined,
							tollFreeNumber:
								record["Toll Free Number Combined"] ||
								undefined,
							address: record["Address"] || undefined,
							city: record["City"] || undefined,
							state: record["State"] || undefined,
							zipCode: record["ZIP Code"] || undefined,
							county: record["County"] || undefined,
							metroArea: record["Metro Area"] || undefined,
							neighborhood: record["Neighborhood"] || undefined,
							squareFootage: undefined, // Needs parsing if you want to store as Int
							locationType: record["Location Type"] || undefined,
							category: {
								connectOrCreate: {
									where: {
										id: category, // Ensure `category` is a valid `id` or adjust accordingly
									},
									create: {
										id: category, // Ensure `category` is a valid `id` or adjust accordingly
										name: category,
										// Add any other fields you need to create
									},
									// If the category doesn't exist, create it
									// This assumes you have a Category model in your Prisma schema
									// Adjust the model name and field names as necessary
								},
							},
							locationEmployeeSize:
								parseInt(
									record["Location Employee Size Actual"]
								) || undefined,
							locationSalesVolume:
								parseFloat(
									record[
										"Location Sales Volume Actual"
									]?.replace(/[^0-9.-]+/g, "")
								) || undefined,
							corporateEmployeeSize:
								parseInt(
									record["Corporate Employee Size Actual"]
								) || undefined,
							corporateSalesVolume:
								parseFloat(
									record[
										"Corporate Sales Volume Actual"
									].replace(/[^0-9.-]+/g, "")
								) || undefined,
							establishedYear:
								parseInt(record["Year Established"]) ||
								undefined,
							yearsInDatabase:
								parseInt(record["Years In Database"]) ||
								undefined,
							lastUpdatedOn: (() => {
								const val = record["Last Updated On"];
								if (val && /^\d{6}$/.test(val)) {
									const date = new Date(val + "01");
									return isNaN(date.getTime())
										? undefined
										: date;
								}
								return undefined;
							})(),
							ein1: record["EIN 1"] || undefined,
							ein2: record["EIN 2"] || undefined,
							ein3: record["EIN 3"] || undefined,
							tickerSymbol: record["Ticker Symbol"] || undefined,
							stockExchange:
								record["Stock Exchange"] || undefined,
							legalName: record["Legal Name"] || undefined,
							recordType: record["Record Type"] || undefined,
							foreignParentFlag:
								record["Foreign Parent Flag"] === "Yes"
									? true
									: record["Foreign Parent Flag"] === "No"
									? false
									: undefined,
							// Executives
							executives: {
								create: getExecutivesFromRecord(record),
							},
							// SIC Codes
							sicCodes: {
								create: getSicCodesFromRecord(record),
							},
							// NAICS Codes
							naicsCodes: {
								create: [
									...(record["Primary NAICS"]
										? [
												{
													code: record[
														"Primary NAICS"
													],
													description:
														record[
															"Primary NAICS Description"
														] || undefined,
												},
										  ]
										: []),
									...(record["NAICS 1"]
										? [
												{
													code: record["NAICS 1"],
													description:
														record[
															"NAICS 1 Description"
														] || undefined,
												},
										  ]
										: []),
									// Add more NAICS codes if present
								],
							},
							// Franchise Descriptions
							franchiseDescriptions: {
								create: [
									...(record["Franchise Description 1"]
										? [
												{
													value: record[
														"Franchise Description 1"
													],
												},
										  ]
										: []),
									...(record["Franchise Description 2"]
										? [
												{
													value: record[
														"Franchise Description 2"
													],
												},
										  ]
										: []),
									...(record["Franchise Description 3"]
										? [
												{
													value: record[
														"Franchise Description 3"
													],
												},
										  ]
										: []),
									...(record["Franchise Description 4"]
										? [
												{
													value: record[
														"Franchise Description 4"
													],
												},
										  ]
										: []),
									...(record["Franchise Description 5"]
										? [
												{
													value: record[
														"Franchise Description 5"
													],
												},
										  ]
										: []),
								],
							},
						},
					});
					console.log(`Imported company: ${company.name}`);
				} catch (error) {
					console.error(
						`Error importing record from ${filePath}:`,
						error
					);
					continue; // Skip this record and continue with the next
				}
			}
			console.log(`Imported ${filePath}`);
		}
	}
	await prisma.$disconnect();
}

importCsvs().catch((e) => {
	console.error(e);
	prisma.$disconnect();
	process.exit(1);
});
