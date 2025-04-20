const { google } = require('googleapis');
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);
oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function syncEvents() {
  // 1. Fetch upcoming events
  const { data } = await calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    singleEvents: true,
    orderBy: 'startTime'
  });
  const events = data.items;

  for (const event of events) {
    // 2. Check if event already exists in Notion
    const query = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        property: 'EventID',
        text: { equals: event.id }
      }
    });

    if (event.status === 'cancelled') {
      // 3a. Delete or flag the page
      if (query.results.length) {
        await notion.pages.update({
          page_id: query.results[0].id,
          properties: { Status: { select: { name: 'Cancelled' } } }
        });
      }
    } else if (query.results.length) {
      // 3b. Update existing page
      await notion.pages.update({
        page_id: query.results[0].id,
        properties: {
          Name: { title: [{ text: { content: event.summary } }] },
          Date: { date: { start: event.start.dateTime, end: event.end.dateTime } }
        }
      });
    } else {
      // 3c. Create new page
      await notion.pages.create({
        parent: { database_id: process.env.NOTION_DATABASE_ID },
        properties: {
          Name: { title: [{ text: { content: event.summary } }] },
          EventID: { rich_text: [{ text: { content: event.id } }] },
          Date: { date: { start: event.start.dateTime, end: event.end.dateTime } }
        }
      });
    }
  }
}

const cron = require('node-cron');

cron.schedule('*/5 * * * *', () => {
  console.log('Syncing events at', new Date().toISOString());
  syncEvents().catch(console.error);
});

