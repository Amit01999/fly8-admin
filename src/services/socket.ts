import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;

  connect(userId: string) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.userId = userId;
    const token = localStorage.getItem('adminToken');

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      auth: {
        token,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      if (this.userId) {
        this.socket?.emit('join', this.userId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
    }
  }

  // Join conversation room
  joinConversation(conversationId: string) {
    this.socket?.emit('join-conversation', conversationId);
  }

  // Leave conversation room
  leaveConversation(conversationId: string) {
    this.socket?.emit('leave-conversation', conversationId);
  }

  // Send typing indicator
  sendTyping(conversationId: string, userId: string, userName: string) {
    this.socket?.emit('typing', { conversationId, userId, userName });
  }

  // Stop typing indicator
  stopTyping(conversationId: string, userId: string) {
    this.socket?.emit('stop-typing', { conversationId, userId });
  }

  // Listen to events
  on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback);
  }

  // Remove event listener
  off(event: string, callback?: (...args: any[]) => void) {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }

  // Emit custom event
  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }

  // Check if socket is connected
  isConnected() {
    return this.socket?.connected || false;
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;
