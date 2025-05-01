import mongoose from "mongoose";

export async function connectToDatabase() {
	const mongoUri =
		process.env.MONGO_URI || "mongodb://localhost:27017/twilio_sms_logs";

	try {
		await mongoose.connect(mongoUri, {});
		console.log("Connected to MongoDB");
	} catch (error) {
		console.error("Failed to connect to MongoDB:", error);
		process.exit(1);
	}
}
