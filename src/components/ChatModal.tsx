import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, User } from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  studentId?: number;
}

export default function ChatModal({
  isOpen,
  onClose,
  studentName = 'Student',
  studentId
}: ChatModalProps) {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would typically send the message to your chat service
      console.log('Sending message to student:', studentId, message);
      setMessage('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            Chat with {studentName}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Direct message with the student
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Student Status */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{studentName}</h4>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600">Online - Typically replies in minutes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto bg-gray-50 rounded-xl p-4 mb-4 min-h-[300px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-lg p-4 mb-3 max-w-[80%]"
            >
              <div className="flex items-start gap-2 mb-1">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-3 w-3 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">{studentName}</p>
                  <p className="text-sm text-gray-900">
                    Hello! I'm waiting for your guidance on my profile assessment.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="text-center text-sm text-gray-500 py-4">
              Start your conversation by sending a message below
            </div>
          </div>

          {/* Message Input */}
          <div className="border-t pt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message here..."
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
