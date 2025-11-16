import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

class GoogleCalendarService {
  constructor() {
    this.oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  // Get authorization URL
  getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  // Exchange code for tokens
  async getTokens(code) {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens;
  }

  // Set credentials
  setCredentials(tokens) {
    this.oauth2Client.setCredentials(tokens);
  }

  // Get calendar events
  async getEvents(timeMin, timeMax) {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
    
    try {
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax,
        maxResults: 50,
        singleEvents: true,
        orderBy: 'startTime',
        q: 'interview OR job OR career OR application'
      });

      return response.data.items.map(event => ({
        id: event.id,
        title: event.summary,
        description: event.description,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        location: event.location,
        attendees: event.attendees?.map(a => a.email) || [],
        isJobRelated: this.isJobRelatedEvent(event.summary, event.description)
      }));
    } catch (error) {
      console.error('Calendar events error:', error);
      throw new Error('Failed to fetch calendar events');
    }
  }

  // Create calendar event
  async createEvent(eventData) {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
    
    const event = {
      summary: eventData.title,
      description: eventData.description,
      start: {
        dateTime: eventData.startTime,
        timeZone: eventData.timeZone || 'America/Los_Angeles'
      },
      end: {
        dateTime: eventData.endTime,
        timeZone: eventData.timeZone || 'America/Los_Angeles'
      },
      location: eventData.location,
      attendees: eventData.attendees?.map(email => ({ email })) || [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 }
        ]
      }
    };

    try {
      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event
      });

      return {
        id: response.data.id,
        htmlLink: response.data.htmlLink,
        hangoutLink: response.data.hangoutLink
      };
    } catch (error) {
      console.error('Create event error:', error);
      throw new Error('Failed to create calendar event');
    }
  }

  // Check if event is job-related
  isJobRelatedEvent(summary, description) {
    const jobKeywords = [
      'interview', 'job', 'career', 'application', 'hiring', 'recruiter',
      'onsite', 'phone screen', 'technical', 'behavioral', 'final round'
    ];

    const text = `${summary || ''} ${description || ''}`.toLowerCase();
    return jobKeywords.some(keyword => text.includes(keyword));
  }

  // Sync job applications with calendar
  async syncJobApplications(applications) {
    const syncedEvents = [];
    
    for (const app of applications) {
      if (app.interviewDate && !app.calendarEventId) {
        try {
          const event = await this.createEvent({
            title: `${app.company} - ${app.position} Interview`,
            description: `Interview for ${app.position} at ${app.company}`,
            startTime: new Date(app.interviewDate).toISOString(),
            endTime: new Date(new Date(app.interviewDate).getTime() + 60 * 60 * 1000).toISOString(),
            location: app.interviewLocation || 'TBD'
          });

          syncedEvents.push({
            applicationId: app.id,
            eventId: event.id,
            eventLink: event.htmlLink
          });
        } catch (error) {
          console.error(`Failed to sync application ${app.id}:`, error);
        }
      }
    }

    return syncedEvents;
  }
}

export default GoogleCalendarService;