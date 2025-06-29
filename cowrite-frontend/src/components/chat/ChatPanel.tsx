import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Send, MessageCircle, X, Minimize2, Maximize2, Smile } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  username: string;
  firstName?: string;
  lastName?: string;
  timestamp: string;
}

interface TypingUser {
  userId: string;
  username: string;
  isTyping: boolean;
}

interface ChatPanelProps {
  socket: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  currentUser: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  socket,
  currentUser,
  isOpen,
  onToggle,
  className
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming chat messages
    socket.on('receive-chat-message', (message: ChatMessage) => {
      setMessages(prev => {
        // Check for duplicate messages by ID and timestamp
        const isDuplicate = prev.some(existingMessage => 
          existingMessage.id === message.id || 
          (existingMessage.userId === message.userId && 
           existingMessage.text === message.text && 
           Math.abs(new Date(existingMessage.timestamp).getTime() - new Date(message.timestamp).getTime()) < 1000)
        );
        
        if (isDuplicate) {
          return prev;
        }
        
        // Increment unread count if chat is minimized or closed and message is from another user
        if ((isMinimized || !isOpen) && message.userId !== currentUser?.id) {
          setUnreadCount(count => count + 1);
        }
        
        return [...prev, message];
      });
    });

    // Listen for typing status updates
    socket.on('user-typing-status', (typingData: TypingUser) => {
      setTypingUsers(prev => {
        const filtered = prev.filter(user => user.userId !== typingData.userId);
        if (typingData.isTyping) {
          return [...filtered, typingData];
        }
        return filtered;
      });
    });

    return () => {
      socket.off('receive-chat-message');
      socket.off('user-typing-status');
    };
  }, [socket, currentUser?.id, isMinimized, isOpen]);

  useEffect(() => {
    scrollToBottom();
    // Clear unread count when chat is open and not minimized
    if (isOpen && !isMinimized) {
      setUnreadCount(0);
    }
  }, [messages, typingUsers, isOpen, isMinimized]); // Also scroll when typing users change

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !socket || isSending) return;

    setIsSending(true);
    const messageData = {
      text: newMessage.trim()
    };

    try {
      socket.emit('send-chat-message', messageData);
      setNewMessage('');
      handleStopTyping();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim() && !isSending) {
        handleSendMessage();
      }
    }
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);
    
    if (!isTyping && socket) {
      setIsTyping(true);
      socket.emit('user-typing', true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    if (isTyping && socket) {
      setIsTyping(false);
      socket.emit('user-typing', false);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const getUserDisplayName = (message: ChatMessage) => {
    if (message.firstName && message.lastName) {
      return `${message.firstName} ${message.lastName}`;
    }
    return message.username;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        size="lg"
        className={cn(
          "fixed bottom-6 right-6 z-50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full p-2 chat-button",
          "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
          "border-2 border-white/20 backdrop-blur-sm",
          className
        )}
      >
        <div className="relative">
          <div className='flex items-center justify-center h-full w-full text-white text-sm font-semibold p-1 gap-1'>
            <MessageCircle className="h-6 w-6 text-white" /> Chat
          </div>
          {(messages.length > 0 || unreadCount > 0) && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs font-bold animate-pulse"
            >
              {unreadCount > 0 ? unreadCount : messages.length > 99 ? '99+' : messages.length}
            </Badge>
          )}
        </div>
      </Button>
    );
  }

  return (
    <Card className={cn(
      "fixed right-6 z-50 shadow-2xl border-0 overflow-hidden chat-panel-enter",
      "bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-xl",
      "dark:from-gray-900/95 dark:to-gray-800/90",
      "transition-all duration-300 ease-in-out transform py-1",
      isMinimized 
        ? "bottom-6 w-96 h-[50vh]" 
        : "top-6 bottom-6 w-96 h-[calc(100vh-3rem)]",
      className
    )}>
      <CardHeader className=
        "flex-shrink-0 p-4 pb-1 border-b border-border/50 bg-gradient-to-r from-blue-50/80 to-purple-50/80" style={{paddingBottom: "4px"}} >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-base font-semibold">
            <div className="flex items-center gap-2">
              <div className="relative">
                <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                Live Chat
              </span>
            </div>
            {(messages.length > 0 && !isMinimized) && (
              <Badge variant="secondary" className="text-xs font-medium px-2 py-1">
                {messages.length} {messages.length === 1 ? 'message' : 'messages'}
              </Badge>
            )}
            {isMinimized && unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs font-medium px-2 py-1 animate-pulse">
                {unreadCount} unread
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              onClick={() => setIsMinimized(!isMinimized)}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-white/60 dark:hover:bg-gray-700/60 rounded-full transition-colors"
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={onToggle}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/60 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="flex-1 p-4 pt-0 flex flex-col min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-modal space-y-4 mb-4 pr-2">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <MessageCircle className="h-16 w-16 mx-auto opacity-30" />
                    <div className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-base">Start the conversation!</p>
                    <p className="text-sm opacity-60 max-w-xs">Share ideas and collaborate in real-time with your team members</p>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message, index) => {
                const isOwn = message.userId === currentUser?.id;
                const prevMessage = messages[index - 1];
                const isFirstInGroup = !prevMessage || prevMessage.userId !== message.userId;
                const nextMessage = messages[index + 1];
                const isLastInGroup = !nextMessage || nextMessage.userId !== message.userId;
                
                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 group",
                      isOwn ? "flex-row-reverse" : "flex-row",
                      !isFirstInGroup && "mt-1"
                    )}
                  >
                    {/* Avatar - only show for first message in group */}
                    {isFirstInGroup && (
                      <Avatar className={cn(
                        "h-8 w-8 flex-shrink-0 border-2 border-white shadow-sm",
                        isOwn ? "border-blue-200" : "border-gray-200"
                      )}>
                        <AvatarFallback className={cn(
                          "text-xs font-semibold",
                          isOwn 
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white" 
                            : "bg-gradient-to-br from-gray-500 to-gray-600 text-white"
                        )}>
                          {getUserDisplayName(message).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    {/* Spacer for grouped messages */}
                    {!isFirstInGroup && <div className="w-8 flex-shrink-0" />}
                    
                    <div
                      className={cn(
                        "max-w-[75%] space-y-1",
                        isOwn ? "items-end" : "items-start"
                      )}
                    >
                      {/* Username - only show for first message in group and if not own */}
                      {isFirstInGroup && !isOwn && (
                        <div className="text-xs font-medium text-muted-foreground px-1">
                          {getUserDisplayName(message)}
                        </div>
                      )}
                      
                      {/* Message bubble */}
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2.5 text-sm shadow-sm relative group/message",
                          "transition-all duration-200 hover:shadow-md",
                          isOwn
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
                            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-md",
                          isFirstInGroup && isLastInGroup && (isOwn ? "rounded-br-2xl" : "rounded-bl-2xl"),
                          !isFirstInGroup && (isOwn ? "rounded-tr-md" : "rounded-tl-md"),
                          !isLastInGroup && (isOwn ? "rounded-br-md" : "rounded-bl-md")
                        )}
                      >
                        <div className="break-words leading-relaxed">{message.text}</div>
                        
                        {/* Timestamp - show on hover or for last message in group */}
                        {isLastInGroup && (
                          <div className={cn(
                            "text-xs mt-1.5 opacity-60 transition-opacity",
                            isOwn ? "text-blue-100" : "text-muted-foreground"
                          )}>
                            {formatTime(message.timestamp)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Indicators */}
          {typingUsers.length > 0 && (
            <div className="text-xs text-muted-foreground mb-3 flex items-center gap-2 px-1 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>
                <span className="font-medium">{typingUsers.map(user => user.username).join(', ')}</span>
                {' '}{typingUsers.length === 1 ? 'is' : 'are'} typing...
              </span>
            </div>
          )}

          {/* Message Input */}
          <div className={cn(
            "flex gap-3 items-end transition-all duration-200",
            isMinimized ? "mt-2" : "mt-0"
          )}>
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => handleTyping(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className={cn(
                  "text-sm border-2 rounded-xl px-4 py-3 pr-12 resize-none",
                  "focus:border-blue-300 dark:focus:border-blue-600 transition-colors",
                  "bg-white dark:bg-gray-800",
                  isSending && "opacity-50"
                )}
                disabled={isSending}
              />
              {/* Future: Emoji button */}
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                disabled
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              size="sm"
              disabled={!newMessage.trim() || isSending}
              className={cn(
                "h-10 w-10 p-0 rounded-full transition-all duration-200",
                "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "shadow-lg hover:shadow-xl"
              )}
            >
              {isSending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Send className="h-4 w-4 text-white" />
              )}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ChatPanel;
