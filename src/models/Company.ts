import mongoose, { Schema, Document } from "mongoose";

export interface Company extends Document {
	name: string;
	address?: string;
	ownerFirstName: string;
	ownerLastName: string;
	ownerEmail?: string;
	ownerPhone?: string;
	message?: string;
	role?: string;
	createdAt: Date;
	updatedAt: Date;
}

const CompanySchema: Schema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		address: { type: String },
		ownerFirstName: { type: String, required: true },
		ownerLastName: { type: String, required: true },
		ownerEmail: { type: String },
		message: { type: String },
		ownerPhone: { type: String },
		role: { type: String },
	},
	{ timestamps: true }
);

export const Company = mongoose.model<Company>("Company", CompanySchema);
