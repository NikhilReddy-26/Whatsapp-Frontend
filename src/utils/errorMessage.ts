import { ApiError } from '../services/http';

/** Turns anything thrown by the API layer into a user-presentable string. */
export function errorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
