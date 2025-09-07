// types/index.ts
export * from './client.types';
export * from './ui.types';
export * from './auth.types';

// Explicitly export UserRole and other commonly used types
export { UserRole } from './auth.types';
export type { User, LoginFormData, AuthState, JWTPayload, UserStats } from './auth.types';

// Export specific items from form.types to avoid conflicts
export type { FileUploadField } from './form.types';
export { arrayFieldToString, stringToArrayField } from './form.types';