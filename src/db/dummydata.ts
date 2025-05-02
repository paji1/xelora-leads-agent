import { CompanyData } from "../types/company.type";

// Dummy data for testing purposes
// This data should be replaced with actual data from your database
export const companiesdata: CompanyData[] = [
	{
		name: "xelora",
		address: "123 Tech Street",
		ownerFirstName: "Taha",
		ownerLastName: "Mouhajir",
		ownerEmail: "taha@xelora.tech",
		ownerPhone: "+212656602321",
		message: "Welcome to Xelora!",
		role: "ceo",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];
