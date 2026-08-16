export const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function normalizedTime(value) {
  const text = String(value ?? '').trim().toLowerCase();
  if (!text) return '';
  const direct = text.match(/^(\d{1,2}):(\d{2})$/);
  if (direct) return `${direct[1].padStart(2, '0')}:${direct[2]}`;
  const twelve = text.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/);
  if (!twelve) return '';
  let hour = Number(twelve[1]);
  if (twelve[3] === 'pm' && hour !== 12) hour += 12;
  if (twelve[3] === 'am' && hour === 12) hour = 0;
  return `${String(hour).padStart(2, '0')}:${twelve[2]}`;
}

export function parseLegacyTsmlSchedule(record, meetingName = '') {
  const dayText = String(record?.day ?? '').trim().toLowerCase();
  let days = [];

  if (/daily|every\s*day/.test(dayText) || /daily/i.test(meetingName)) {
    days = weekdays;
  } else if (/^\d+$/.test(dayText)) {
    const tsmlDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const day = tsmlDays[Number(dayText)];
    if (day) days = [day];
  } else {
    const day = weekdays.find(value => dayText.includes(value));
    if (day) days = [day];
  }

  const titleTime = String(meetingName).match(/\b(\d{1,2}:\d{2})\b/)?.[1] ?? '';
  const time = normalizedTime(record?.time) || normalizedTime(titleTime);
  return { days, time };
}
