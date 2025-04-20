# Google Calendar to Notion Sync

This Node.js application synchronizes events from your Google Calendar to a Notion database. It fetches upcoming events from Google Calendar and creates, updates, or archives corresponding entries in Notion.

## Features

- Fetches upcoming events from your primary Google Calendar.
- Creates new pages in Notion for events not already present.
- Updates existing Notion pages if event details change.
- Archives Notion pages when events are canceled in Google Calendar.
- Runs automatically every 10 minutes using a cron job.

## Prerequisites

- Node.js installed on your machine.
- Google API credentials (Client ID, Client Secret, and Refresh Token).
- Notion integration token and a database with the following properties:
  - `Title` (Title)
  - `EventID` (Rich Text)
  - `Date` (Date)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Juanpa0128j/google-calendar-notion-sync.git
   cd google-calendar-notion-sync
   ```


2. Install dependencies:

   ```bash
   npm install
   ```


3. Create a `.env` file in the root directory and add your credentials:

   ```env
   CLIENT_ID=your_google_client_id
   CLIENT_SECRET=your_google_client_secret
   REFRESH_TOKEN=your_google_refresh_token
   NOTION_TOKEN=your_notion_integration_token
   NOTION_DATABASE_ID=your_notion_database_id
   ```


## Usage

To start the synchronization process, run:


```bash
node app.js
```


The application will log synchronization activities to the console every 10 minutes.

## License

This project is licensed under the [MIT License](LICENSE).