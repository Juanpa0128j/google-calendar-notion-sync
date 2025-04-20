# Google Calendar to Notion Sync

This Node.js application synchronizes events from your Google Calendar to a Notion database. It fetches upcoming events from Google Calendar and creates, updates, or archives corresponding entries in Notion.

## Features

- Fetches upcoming events from your primary Google Calendar.
- Creates new pages in Notion for events not already present.
- Updates existing Notion pages if event details change.
- Archives Notion pages when events are canceled in Google Calendar.
- Runs automatically every 10 minutes using a cron job.

## New Features

- **Manual Sync Trigger**: Added a button in the frontend to manually trigger the sync process.
- **Dynamic Status Updates**: The frontend dynamically updates the sync status using WebSocket.

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


## Updated Usage

To start the application with both the backend and frontend, run:

```bash
npm start
```

This will start the server and serve the frontend at the specified port. The WebSocket connection will provide real-time updates on the sync status.

## Debugging

Debugging messages have been added to the browser console, `app.js`, and `index.js` to help trace the sync process and WebSocket events.

## License

This project is licensed under the [MIT License](LICENSE).