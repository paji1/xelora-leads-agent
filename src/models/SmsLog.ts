import mongoose, { Schema, Document } from "mongoose";

export interface ISmsLog extends Document {
	recipient: string;
	companyName: string;
	ownerfirstName: string;
	ownerlastName: string;

	message: string;
	status: string;
	sid?: string;
	error?: string;
	timestamp: Date;
}

const SmsLogSchema: Schema = new Schema({
	recipient: { type: String, required: true },
	companyName: { type: String, required: true },
	ownerfirstName: { type: String, required: true },
	ownerlastName: { type: String, required: true },
	message: { type: String, required: true },
	status: { type: String, required: true },
	sid: { type: String },
	error: { type: String },
	timestamp: { type: Date, default: Date.now },
});

export const SmsLog = mongoose.model<ISmsLog>("SmsLog", SmsLogSchema);
