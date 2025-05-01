import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUri =
	process.env.MONGO_URI || "mongodb://localhost:27017/twilio_sms_logs";

async function runMigration() {
	try {
		await mongoose.connect(mongoUri, {});
		console.log("Connected to MongoDB");

		const SmsLog = mongoose.model(
			"SmsLog",
			new mongoose.Schema({}, { strict: false })
		);

		// Example: Add a new field to all documents
		await SmsLog.updateMany({}, { $set: { migrated: true } });
		console.log("Migration completed successfully");
	} catch (error) {
		console.error("Migration failed:", error);
	} finally {
		mongoose.connection.close();
	}
}

runMigration();
