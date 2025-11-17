// hooks/index.ts
export * from './useFileUpload';
export * from './useClientManagement';
export * from './useAuth'; // Export from useAuth.ts instead
export { useModal } from './useClientManagement'; // Remove duplicate useClientManagement export