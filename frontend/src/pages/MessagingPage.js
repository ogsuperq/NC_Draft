import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Send, User } from 'lucide-react';
import { previewMessages } from '../lib/previewData';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MessagingPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    if (!BACKEND_URL) {
      setMessages(previewMessages);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        id: `${Date.now()}`,
        from_user: 'Alexander Sterling',
        to_user: 'Victoria Chen',
        content: newMessage,
        timestamp: new Date().toISOString()
      };

      if (!BACKEND_URL) {
        setMessages([...messages, messageData]);
      } else {
        const response = await axios.post(`${API}/messages`, messageData);
        setMessages([...messages, response.data]);
      }
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-luxury-white/60 text-sm uppercase tracking-[0.2em]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="p-8 border-b" style={{ borderColor: 'rgba(198, 169, 107, 0.15)' }}>
        <h1 className="text-4xl font-heading font-light tracking-tight text-luxury-white">
          Secure Messaging
        </h1>
        <p className="text-sm uppercase tracking-[0.2em] text-luxury-white/60 mt-2">
          Private Communication
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length > 0 ? (
            messages.map((msg) => {
              const isFromCurrentUser = msg.from_user === 'Alexander Sterling';
              return (
                <div
                  key={msg.id}
                  data-testid={`message-${msg.id}`}
                  className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${
                    isFromCurrentUser ? 'order-2' : 'order-1'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {!isFromCurrentUser && (
                        <div className="w-8 h-8 rounded-full bg-luxury-gold flex items-center justify-center">
                          <span className="text-luxury-black text-xs font-medium">{msg.from_user.charAt(0)}</span>
                        </div>
                      )}
                      <span className="text-xs uppercase tracking-[0.2em] text-luxury-white/40">
                        {msg.from_user}
                      </span>
                    </div>
                    <div className={`p-4 rounded-sm ${
                      isFromCurrentUser
                        ? 'bg-luxury-gold text-luxury-black ml-10'
                        : 'bg-luxury-surface text-luxury-white border border-luxury-border-subtle'
                    }`}>
                      <p className="text-base font-light leading-relaxed">{msg.content}</p>
                      <p className="text-xs mt-2 opacity-60">
                        {new Date(msg.timestamp).toLocaleString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div data-testid="no-messages" className="text-center py-16">
              <p className="text-luxury-white/40 text-sm uppercase tracking-[0.2em]">No messages yet</p>
              <p className="text-luxury-white/30 text-xs mt-2">Start a conversation with your estate team</p>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-8 border-t" style={{ borderColor: 'rgba(198, 169, 107, 0.15)' }}>
        <div className="max-w-4xl mx-auto flex space-x-4">
          <input
            data-testid="message-input"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="luxury-input flex-1 py-3 px-4 text-base bg-luxury-surface rounded-sm"
          />
          <button
            data-testid="send-message-button"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="luxury-button-primary px-6 py-3 rounded-sm flex items-center space-x-2"
          >
            <Send size={18} strokeWidth={1.5} />
            <span className="text-xs uppercase tracking-[0.2em]">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
