import twilio from "twilio";

export function twilioinit() {
	const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
	const authToken = process.env.TWILIO_AUTH_TOKEN || "";

	if (!accountSid.startsWith("AC")) {
		console.error(
			'Invalid TWILIO_ACCOUNT_SID. It must start with "AC". Please check your environment variables.'
		);
		process.exit(1);
	}
	if (!authToken) {
		console.error(
			"TWILIO_AUTH_TOKEN is not set. Please check your environment variables."
		);
		process.exit(1);
	}
	const client = twilio(accountSid, authToken);
	if (!accountSid || !authToken) {
		console.error(
			"Twilio credentials are not set. Please check your environment variables."
		);
		process.exit(1);
	}
	return client;
}
