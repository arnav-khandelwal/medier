export interface AgendaDay {
  date: Date;
  isAvailable: boolean;
  onlineSlots: TimeSlot[];
  offlineSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isBlocked?: boolean;
  address?: string; // For offline slots
}

// Helper function to get date relative to current date
const getDate = (daysOffset: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date;
};

// Mock data - always surrounding current date
export const agendaData: AgendaDay[] = [
  // Current date - has both online and offline slots
  {
    date: getDate(0),
    isAvailable: true,
    onlineSlots: [
      { id: 'online-1', startTime: '09:00 AM', endTime: '12:00 PM' },
      { id: 'online-2', startTime: '02:00 PM', endTime: '05:00 PM' },
    ],
    offlineSlots: [
      { id: 'offline-1', startTime: '10:00 AM', endTime: '01:00 PM', address: '123 Main St, New York' },
    ],
  },
  // Yesterday - only online slots
  {
    date: getDate(-1),
    isAvailable: true,
    onlineSlots: [
      { id: 'online-3', startTime: '08:00 AM', endTime: '11:00 AM' },
      { id: 'online-4', startTime: '01:00 PM', endTime: '04:00 PM' },
    ],
    offlineSlots: [],
  },
  // Day before yesterday - only offline slots
  {
    date: getDate(-2),
    isAvailable: true,
    onlineSlots: [],
    offlineSlots: [
      { id: 'offline-2', startTime: '09:30 AM', endTime: '12:30 PM', address: '456 Oak Ave, Los Angeles' },
      { id: 'offline-3', startTime: '02:30 PM', endTime: '05:30 PM', address: '789 Pine Rd, Chicago' },
    ],
  },
  // 3 days ago - blocked online slots
  {
    date: getDate(-3),
    isAvailable: true,
    onlineSlots: [
      { id: 'online-5', startTime: '09:00 AM', endTime: '12:00 PM', isBlocked: true },
      { id: 'online-6', startTime: '02:00 PM', endTime: '05:00 PM', isBlocked: true },
    ],
    offlineSlots: [],
  },
  // 4 days ago - blocked offline slots
  {
    date: getDate(-4),
    isAvailable: true,
    onlineSlots: [],
    offlineSlots: [
      { id: 'offline-4', startTime: '10:00 AM', endTime: '01:00 PM', address: '321 Elm St, Houston', isBlocked: true },
    ],
  },
  // 5 days ago - mixed available and blocked slots
  {
    date: getDate(-5),
    isAvailable: true,
    onlineSlots: [
      { id: 'online-7', startTime: '09:00 AM', endTime: '12:00 PM' },
      { id: 'online-8', startTime: '03:00 PM', endTime: '06:00 PM', isBlocked: true },
    ],
    offlineSlots: [
      { id: 'offline-5', startTime: '11:00 AM', endTime: '02:00 PM', address: '654 Maple Dr, Phoenix', isBlocked: true },
    ],
  },
  // Tomorrow - completely blocked day (no slots)
  {
    date: getDate(1),
    isAvailable: false,
    onlineSlots: [],
    offlineSlots: [],
  },
  // Day after tomorrow - empty day (no slots but available)
  {
    date: getDate(2),
    isAvailable: true,
    onlineSlots: [],
    offlineSlots: [],
  },
  // 3 days ahead - only online with blocked
  {
    date: getDate(3),
    isAvailable: true,
    onlineSlots: [
      { id: 'online-9', startTime: '08:00 AM', endTime: '11:00 AM', isBlocked: true },
      { id: 'online-10', startTime: '01:00 PM', endTime: '04:00 PM', isBlocked: true },
    ],
    offlineSlots: [],
  },
  // 4 days ahead - only offline with blocked
  {
    date: getDate(4),
    isAvailable: true,
    onlineSlots: [],
    offlineSlots: [
      { id: 'offline-6', startTime: '09:00 AM', endTime: '12:00 PM', address: '987 Cedar Ln, Boston', isBlocked: true },
      { id: 'offline-7', startTime: '02:00 PM', endTime: '05:00 PM', address: '246 Birch Blvd, Seattle', isBlocked: true },
    ],
  },
  // 5 days ahead - both online and offline with some blocked
  {
    date: getDate(5),
    isAvailable: true,
    onlineSlots: [
      { id: 'online-11', startTime: '09:00 AM', endTime: '12:00 PM' },
      { id: 'online-12', startTime: '02:00 PM', endTime: '05:00 PM', isBlocked: true },
    ],
    offlineSlots: [
      { id: 'offline-8', startTime: '10:00 AM', endTime: '01:00 PM', address: '135 Spruce Way, Miami' },
      { id: 'offline-9', startTime: '03:00 PM', endTime: '06:00 PM', address: '864 Willow Ct, Denver', isBlocked: true },
    ],
  },
  // 6 days ahead - completely empty (no slots, not blocked)
  {
    date: getDate(6),
    isAvailable: true,
    onlineSlots: [],
    offlineSlots: [],
  },
  // 7 days ahead - completely blocked
  {
    date: getDate(7),
    isAvailable: false,
    onlineSlots: [],
    offlineSlots: [],
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
  if (!agendaDay) return false;
  
  // Check if day is completely blocked
  if (!agendaDay.isAvailable) return true;
  
  // Check if any slot (online or offline) is blocked
  const hasBlockedOnlineSlots = agendaDay.onlineSlots.some(slot => slot.isBlocked);
  const hasBlockedOfflineSlots = agendaDay.offlineSlots.some(slot => slot.isBlocked);
  
  return hasBlockedOnlineSlots || hasBlockedOfflineSlots;
};
