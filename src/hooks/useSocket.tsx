import { useEffect, useCallback } from 'react';
import socketService from '../services/socket';

export const useSocket = (userId?: string) => {
  useEffect(() => {
    if (userId) {
      socketService.connect(userId);
    }

    return () => {
      if (userId) {
        socketService.disconnect();
      }
    };
  }, [userId]);

  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    socketService.on(event, callback);
  }, []);

  const off = useCallback((event: string, callback?: (...args: any[]) => void) => {
    socketService.off(event, callback);
  }, []);

  const emit = useCallback((event: string, data: any) => {
    socketService.emit(event, data);
  }, []);

  const joinConversation = useCallback((conversationId: string) => {
    socketService.joinConversation(conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    socketService.leaveConversation(conversationId);
  }, []);

  const sendTyping = useCallback((conversationId: string, userId: string, userName: string) => {
    socketService.sendTyping(conversationId, userId, userName);
  }, []);

  const stopTyping = useCallback((conversationId: string, userId: string) => {
    socketService.stopTyping(conversationId, userId);
  }, []);

  const isConnected = useCallback(() => {
    return socketService.isConnected();
  }, []);

  return {
    on,
    off,
    emit,
    joinConversation,
    leaveConversation,
    sendTyping,
    stopTyping,
    isConnected,
  };
};
