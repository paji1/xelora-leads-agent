# Twilio SMS Tools

This project provides tools for importing company data, generating personalized messages using OpenAI, and sending SMS via Twilio.

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- [Prisma](https://www.prisma.io/) CLI (for migrations)
- MongoDB (for logs, if needed)
- PostgreSQL or your configured database (for Prisma)
- Twilio account (for SMS sending)
- OpenAI API credentials (for message generation)

## Setup

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd twilio-sms
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**

   Copy `.example.env` to `.env`  
   ```sh
   cp .example.env .env
   ```
   

4. **Run database migrations (if needed):**
   ```sh
   npx prisma migrate deploy
   ```

## Usage

### Import CSV Data

To import company data from CSV files into your database:

```sh
npx ts-node prisma/import-csv.ts
```

### Generate and Push Messages

To generate personalized messages for each company and update the database:

```sh
npx ts-node prisma/push-message.ts
```

### Send Bulk SMS

To send SMS messages in bulk (make sure your Twilio credentials are set):

```sh
npx npm run dev
```

## Notes

- Make sure your database(s) are running and accessible.
- Adjust file paths and environment variables as needed for your setup.
- For OpenAI/Azure OpenAI, ensure your deployment and endpoint are correct.

## Example message
- Hello Hometown Restaurant, located at 2225 S Cushman St. Xelora can create a website for online menus or AI-powered customer engagement tools. Book a meeting: https://calendly.com/pajinew/xelora. My name is Taha, CEO of Xelora. Email: taha@xelora.tech.

## License

MIT