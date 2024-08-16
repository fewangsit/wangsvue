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

const getHolidays = async (year: number): Promise<Holiday[]> => {
  const BASE_URL = import.meta.env.VITE_APP_GOOGLE_PUBLIC_HOLIDAY_API;
  const API_KEY = import.meta.env.VITE_APP_GOOGLE_PUBLIC_HOLIDAY_API_KEY;
  const CALENDAR_ID = import.meta.env
    .VITE_APP_GOOGLE_PUBLIC_HOLIDAY_CALENDAR_ID;

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
