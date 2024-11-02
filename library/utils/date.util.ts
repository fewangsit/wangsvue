export const formatDate = (date: Date): string => {
  return date
    .toLocaleString('en-GB', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(',', '');
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
