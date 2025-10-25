import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, type AdminUser, type LoginCredentials } from '../services';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import socketService from '../services/socket';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<AdminUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('adminToken');
      const storedUser = localStorage.getItem('adminUser');

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);

          // Connect socket
          socketService.connect(parsedUser._id);

          // Optionally, verify token with backend
          const freshUser = await authAPI.getProfile();
          setUser(freshUser);
          localStorage.setItem('adminUser', JSON.stringify(freshUser));
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authAPI.login(credentials);

      // Store token and user data
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminUser', JSON.stringify(response.admin));

      setUser(response.admin);
      setIsAuthenticated(true);

      // Connect socket
      socketService.connect(response.admin._id);

      toast.success('Login successful!');
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
    setIsAuthenticated(false);

    // Disconnect socket
    socketService.disconnect();

    toast.info('Logged out successfully');
    navigate('/login');
  };

  const updateUser = async (data: Partial<AdminUser>) => {
    try {
      const updatedUser = await authAPI.updateProfile(data);
      setUser(updatedUser);
      localStorage.setItem('adminUser', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Update user error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
