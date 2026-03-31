import { useContext } from 'react';
import { AuthContext, type AuthContextData } from '../context/AuthContext';

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};