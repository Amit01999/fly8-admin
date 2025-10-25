
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Search,
  Send,
  Phone,
  Video,
  Paperclip,
  MoreHorizontal,
  Loader2
} from 'lucide-react';
import { messageAPI, socketService, type Conversation, type Message } from '@/services';
import { toast } from 'sonner';

const Messages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch all conversations
  const { data: conversations = [], isLoading: loadingConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messageAPI.getAllConversations(),
  });

  // Auto-select first conversation
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].conversationId);
    }
  }, [conversations, selectedConversationId]);

  // Fetch messages for selected conversation
  const { data: messagesData, isLoading: loadingMessages } = useQuery({
    queryKey: ['messages', selectedConversationId],
    queryFn: () => messageAPI.getConversationMessages(selectedConversationId!),
    enabled: !!selectedConversationId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (data: { studentId: string; content: string }) =>
      messageAPI.sendMessage(data),
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages', selectedConversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send message');
    },
  });

  // Real-time socket updates
  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket) return;

    socket.on('message_received', (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['messages', data.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast.info('New message received');
    });

    socket.on('message_delivered', (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['messages', data.conversationId] });
    });

    return () => {
      socket.off('message_received');
      socket.off('message_delivered');
    };
  }, [queryClient]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    sendMessageMutation.mutate({
      studentId: selectedConversation.student._id,
      content: newMessage.trim(),
    });
  };

  const selectedConversation = conversations.find(
    (c: Conversation) => c.conversationId === selectedConversationId
  );

  const messages = messagesData?.messages || [];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return date.toLocaleDateString();
  };

  if (loadingConversations) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </AdminLayout>
    );
  }

  if (!conversations.length) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96 text-gray-500">
          <div className="text-center">
            <p className="text-xl mb-2">No conversations yet</p>
            <p className="text-sm">Messages from students will appear here</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex h-[calc(100vh-8rem)] space-x-6">
        {/* Messages Sidebar */}
        <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Messages</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-y-auto h-full">
            {conversations.map((conversation: Conversation) => {
              const student = conversation.student;
              const isSelected = conversation.conversationId === selectedConversationId;

              return (
                <div
                  key={conversation.conversationId}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => setSelectedConversationId(conversation.conversationId)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={student.image} />
                        <AvatarFallback>
                          {student.firstName?.[0]}{student.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white bg-green-500"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 truncate">
                          {student.firstName} {student.lastName}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {conversation.lastMessage ? formatTimeAgo(conversation.lastMessage.createdAt) : 'N/A'}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-blue-500 text-white text-xs px-2 py-1">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conversation View */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedConversation.student.image} />
                      <AvatarFallback>
                        {selectedConversation.student.firstName?.[0]}
                        {selectedConversation.student.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white bg-green-500"></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {selectedConversation.student.firstName} {selectedConversation.student.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{selectedConversation.student.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" disabled>
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" disabled>
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg: Message) => {
                    const isAdmin = msg.senderModel === 'Admin';
                    return (
                      <div key={msg._id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isAdmin
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className={`text-xs ${
                              isAdmin ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true
                              })}
                            </p>
                            {isAdmin && (
                              <span className={`text-xs ${
                                msg.status === 'read' ? 'text-blue-200' : 'text-blue-300'
                              }`}>
                                {msg.status === 'read' ? '✓✓' : '✓'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-end space-x-2">
                  <Button variant="ghost" size="sm" disabled>
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[40px] max-h-32 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendMessageMutation.isPending}
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a conversation to view messages</p>
            </div>
          )}
        </div>

        {/* Conversation Info */}
        <div className="w-1/4 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="font-bold text-gray-900 mb-4">Conversation Info</h3>

          {selectedConversation ? (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Student Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <p className="font-medium">
                        {selectedConversation.student.firstName} {selectedConversation.student.lastName}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium">{selectedConversation.student.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Student ID:</span>
                      <p className="font-medium">{selectedConversation.student._id.slice(-6)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.href = `/students/${selectedConversation.student._id}`}
                    >
                      View Student Profile
                    </Button>
                    <Button className="w-full" size="sm" variant="outline" disabled>
                      Send Notification
                    </Button>
                    <Button className="w-full" size="sm" variant="outline" disabled>
                      Schedule Call
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Conversation Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Messages:</span>
                      <span className="font-medium">{messages.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Unread:</span>
                      <span className="font-medium">{selectedConversation.unreadCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Select a conversation to view details</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Messages;
