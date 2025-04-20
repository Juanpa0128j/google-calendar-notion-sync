const { google } = require('googleapis');
const { Client } = require('@notionhq/client');
const cron = require('node-cron');

// Google API setup
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);
oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// Notion client setup
const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function syncEvents() {
  try {
    console.log('Fetching Google Calendar events...');
    const { data } = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 10
    });

    const events = data.items;
    console.log(`Found ${events.length} events.`);

    for (const event of events) {
      console.log(`Processing event: ${event.summary} (${event.id})`);

      // Check if the event exists in Notion
      const query = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
        filter: {
          property: 'EventID',
          rich_text: {
            equals: event.id
          }
        }
      });

      const exists = query.results.length > 0;

      if (event.status === 'cancelled') {
        console.log(`Event ${event.id} is cancelled.`);

        if (exists) {
          console.log(`Flagging event ${event.id} as cancelled in Notion.`);
          await notion.pages.update({
            page_id: query.results[0].id,
            properties: {
              Status: { select: { name: 'Cancelled' } }
            }
          });
        } else {
          console.log(`Cancelled event ${event.id} not found in Notion.`);
        }

      } else if (exists) {
        console.log(`Updating existing event ${event.id} in Notion.`);
        await notion.pages.update({
          page_id: query.results[0].id,
          properties: {
            Title: { title: [{ text: { content: event.summary || 'No Title' } }] },
            Date: {
              date: {
                start: event.start?.dateTime || event.start?.date,
                end: event.end?.dateTime || event.end?.date
              }
            }
          }
        });
      } else {
        console.log(`Creating new page for event ${event.id} in Notion.`);
        await notion.pages.create({
          parent: { database_id: process.env.NOTION_DATABASE_ID },
          properties: {
            Title: { title: [{ text: { content: event.summary || 'No Title' } }] },
            EventID: { rich_text: [{ text: { content: event.id } }] },
            Date: {
              date: {
                start: event.start?.dateTime || event.start?.date,
                end: event.end?.dateTime || event.end?.date
              }
            }
          }
        });
      }
    }
    console.log('Sync completed.');
  } catch (error) {
    console.error('Sync failed:', error.message);
    console.error(error);
  }
}

// Run every 10 seconds (for debugging)
cron.schedule('*/10 * * * * *', () => {
  console.log('--- Sync Triggered ---');
  syncEvents();
});
