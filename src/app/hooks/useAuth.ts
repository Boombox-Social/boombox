// Re-export from context for backward compatibility
export { 
  useAuthContext as useAuth, 
  usePermission, 
  AuthProvider 
} from '../contexts/AuthContext';

export type { User, LoginFormData, AuthState, UserRole } from '../types/auth.types';