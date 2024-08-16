import axios, { AxiosResponse } from 'axios';

export interface Holiday {
  date: string;
  eventName: string;
  description: string;
}

interface GoogleCalendarResponse {
  kind: string;
  etag: string;
  summary: string;
  description: string;
  updated: string;
  timeZone: string;
  accessRole: string;
  defaultReminders: any[];
  nextPageToken?: string;
  items: {
    kind: string;
    etag: string;
    id: string;
    status: string;
    htmlLink: string;
    created: string;
    updated: string;
    summary: string;
    description: string;
    creator: {
      email: string;
      displayName: string;
      self: boolean;
    };
    organizer: {
      email: string;
      displayName: string;
      self: boolean;
    };
    start: {
      date: string;
    };
    end: {
      date: string;
    };
    transparency: string;
    visibility: string;
    iCalUID: string;
    sequence: number;
    eventType: string;
  }[];
}

/**
 * Source: /settings/browsecalendars
 *
 * - Go to https://calendar.google.com/calendar
 * - Navigate ot Settings > General > Add Calendar > Browse Calendars of interests
 * - Regional holidays > view
 *
 * @param year
 * @returns
 */
const getHolidays = async (year: number): Promise<Holiday[]> => {
  const BASE_URL = 'https://clients6.google.com/calendar/v3/calendars';
  const API_KEY = 'AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs';
  const CALENDAR_ID = 'id.indonesian%23holiday%40group.v.calendar.google.com';

  try {
    const params = {
      singleEvents: true,
      eventTypes: ['default', 'focusTime', 'outOfOffice'],
      timeZone: 'Z',
      maxAttendees: 1,
      // MaxResults: 250,
      sanitizeHtml: true,
      timeMin: `${year}-01-01T00:00:00Z`,
      timeMax: `${year}-12-31T00:00:00Z`,
      key: API_KEY,
    };

    const response: AxiosResponse<GoogleCalendarResponse> = await axios.get(
      `${BASE_URL}/${CALENDAR_ID}/events`,
      { params },
    );

    // Extract and map the relevant holiday data
    const holidays: Holiday[] = response.data.items.map((item) => ({
      date: item.start.date,
      eventName: item.summary,
      description: item.description,
    }));

    return holidays;
  } catch (error) {
    console.error('Error fetching holidays:', error);
    throw error; // Re-throw the error for handling at a higher level if needed
  }
};

const CalendarServices = {
  getHolidays,
};

export default CalendarServices;
