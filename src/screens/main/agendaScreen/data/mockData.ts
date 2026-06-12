export interface AgendaDay {
  date: Date;
  isAvailable: boolean;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

// Mock data for June 2026
export const agendaData: AgendaDay[] = [
  {
    date: new Date(2026, 5, 12), // June 12, 2026 (current date)
    isAvailable: true,
    timeSlots: [
      { id: '1', startTime: '12:30 AM', endTime: '09:30 AM' },
      { id: '2', startTime: '01:15 AM', endTime: '05:15 AM' },
      { id: '3', startTime: '01:15 AM', endTime: '05:15 AM' },
    ],
  },
  {
    date: new Date(2026, 5, 10), // June 10, 2026
    isAvailable: false,
    timeSlots: [],
  },
  {
    date: new Date(2026, 5, 15), // June 15, 2026
    isAvailable: true,
    timeSlots: [
      { id: '4', startTime: '09:00 AM', endTime: '12:00 PM' },
      { id: '5', startTime: '02:00 PM', endTime: '05:00 PM' },
    ],
  },
  {
    date: new Date(2026, 5, 8), // June 8, 2026
    isAvailable: false,
    timeSlots: [],
  },
  {
    date: new Date(2026, 5, 20), // June 20, 2026
    isAvailable: true,
    timeSlots: [
      { id: '6', startTime: '10:00 AM', endTime: '02:00 PM' },
    ],
  },
  {
    date: new Date(2026, 5, 18), // June 18, 2026
    isAvailable: false,
    timeSlots: [],
  },
];

export const getAgendaDay = (date: Date): AgendaDay | undefined => {
  return agendaData.find(
    (day) =>
      day.date.getDate() === date.getDate() &&
      day.date.getMonth() === date.getMonth() &&
      day.date.getFullYear() === date.getFullYear()
  );
};

export const isDayBlocked = (date: Date): boolean => {
  const agendaDay = getAgendaDay(date);
  return agendaDay ? !agendaDay.isAvailable : false;
};
