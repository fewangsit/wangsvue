export type TDateFormat =
  | 'd/m/yy'
  | 'd/mm/yy'
  | 'dd/mm/yy'
  | 'dd/mm/yyyy'
  | 'dd M yy'
  | 'dd M yyyy'
  | 'dd MM yy'
  | 'dd MM yyyy'
  | 'D dd M yy'
  | 'D dd M yyyy'
  | 'DD dd MM yy'
  | 'DD dd MM yyyy'
  | 'D, dd M yy'
  | 'D, dd M yyyy'
  | 'DD, dd MM yy'
  | 'DD, dd MM yyyy';

export type TTimeFormat = 'HH:mm' | 'HH:mm:ss' | 'without-time';

export const formatDate = (
  date: Date,
  locale: string = 'en-GB',
  dateFormat: TDateFormat = 'dd/mm/yy',
  timeFormat: TTimeFormat = 'HH:mm',
): string => {
  let format = {};

  switch (dateFormat) {
    case 'd/m/yy':
      format = {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
      };
      break;
    case 'd/mm/yy':
      format = {
        year: '2-digit',
        month: '2-digit',
        day: 'numeric',
      };
      break;
    case 'dd/mm/yyyy':
      format = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      };
      break;
    case 'dd M yy':
      format = {
        year: '2-digit',
        month: 'short',
        day: '2-digit',
      };
      break;
    case 'dd M yyyy':
      format = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      };
      break;
    case 'dd MM yy':
      format = {
        year: '2-digit',
        month: 'long',
        day: '2-digit',
      };
      break;
    case 'dd MM yyyy':
      format = {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      };
      break;
    case 'D dd M yy':
    case 'D, dd M yy':
      format = {
        weekday: 'short',
        year: '2-digit',
        month: 'short',
        day: '2-digit',
      };
      break;
    case 'D dd M yyyy':
    case 'D, dd M yyyy':
      format = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      };
      break;
    case 'DD dd MM yy':
    case 'DD, dd MM yy':
      format = {
        weekday: 'long',
        year: '2-digit',
        month: 'long',
        day: '2-digit',
      };
      break;
    case 'DD dd MM yyyy':
    case 'DD, dd MM yyyy':
      format = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      };
      break;
    default: // Format dd/mm/yy
      format = {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      };
      break;
  }

  switch (timeFormat) {
    case 'HH:mm':
      format = { ...format, hour: '2-digit', minute: '2-digit', hour12: false };
      break;
    case 'HH:mm:ss':
      format = {
        ...format,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      break;
    default:
      break;
  }

  if (dateFormat.includes(',')) return date.toLocaleString(locale, format);
  return date.toLocaleString(locale, format).replace(',', '');
};

/**
 * Formats a date to human readable form (timeago / relative time from now).
 *
 * @param date - The date to be displayed. Can be a Date object or a string in a recognized date format.
 * @param maxSeconds - Max value of seconds difference. Use it for formats a date according to the user's general settings.
 * @returns The formatted date string.
 */
export const formatDateReadable = (date: Date, maxSeconds?: number): string => {
  const seconds = Math.floor(
    (new Date().valueOf() - new Date(date).valueOf()) / 1000,
  );

  if (maxSeconds && seconds > maxSeconds) {
    return formatDate(date);
  }

  const interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval + ' tahun lalu';
  }

  const months = Math.floor(seconds / 2628000);
  if (months >= 1) {
    return months + ' bulan lalu';
  }

  const days = Math.floor(seconds / 86400);
  if (days >= 1) {
    return days + ' hari lalu';
  }

  const hours = Math.floor(seconds / 3600);
  if (hours >= 1) {
    return hours + ' jam lalu';
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes >= 1) {
    return minutes + ' menit lalu';
  }

  return 'baru saja';
};
