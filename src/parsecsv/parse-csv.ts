import { parse } from "csv-parse/sync";
import * as fs from "fs";
export function parseCsvFile(filePath: string): any[] {
	const fileContent = fs.readFileSync(filePath, "utf-8");
	return parse(fileContent, {
		columns: true,
		skip_empty_lines: true,
	});
}

// Example usage
// const csvFilePath =
// 	"/home/taha/xelora/tools/twilio-sms/src/data/cleaned_without_website_v2/Car-Dealers.csv";
// const parsedData = parseCsvFile(csvFilePath);
// // This will log the parsed data as an array of objects
// const outputFilePath =
// 	"/home/taha/xelora/tools/twilio-sms/src/data/parsed-data.json";
// if (!fs.existsSync(outputFilePath)) {
// 	fs.writeFileSync(
// 		outputFilePath,
// 		JSON.stringify(parsedData, null, 2),
// 		"utf-8"
// 	);
// 	console.log(`Parsed data has been written to ${outputFilePath}`);
// } else {
// 	console.log(`File already exists at ${outputFilePath}`);
// }
