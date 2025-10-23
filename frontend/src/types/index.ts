// frontend/src/types/index.ts

// The basic shape of an Event object, including the extra fields from the backend service
export interface IEvent {
  id: string;
  title: string;
  description: string;
  date: string; // The date will be a string in ISO format when coming from the API
  location: string;
  capacity: number;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;

  // These fields are dynamically calculated and added by the backend EventsService
  bookedSeats: number;
  spotsLeft: number;
}

// The structure for paginated API responses (like for upcoming/past events)
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// User data received from the backend after login or when fetching a profile
export interface IUser {
  id: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

// The decoded JWT payload, which is what's available in our AuthContext
export interface JwtPayload {
  sub: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

// Shape of a booking object, especially when fetching a user's own bookings
export interface IBooking {
  id: string;
  numberOfSeats: number;
  createdAt: string;
  userId: string;
  eventId: string;
  event: IEvent; // The backend includes the full event object in 'my-bookings'
}