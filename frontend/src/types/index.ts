// src/types/index.ts

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // The backend sends a full ISO string (e.g., "2025-04-14T15:00:00.000Z")
  location: string;
  capacity: number;
  tags: string[];
  imageUrl: string;
  bookedSeats: number;
  spotsLeft: number;
  createdAt: string;
  updatedAt: string;
}

// Type for the paginated response from the API
export interface PaginatedEvents {
  data: Event[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}