// utils/index.ts
export * from './client.utils';
export * from './file.utils';
export * from './form.utils';
export * from './storage.utils';
export * from './color.utils';

// Explicitly export the function that useClientManagement needs
export { createClientFromForm, transformFormDataToClient, safeStringToArray } from './client.utils';