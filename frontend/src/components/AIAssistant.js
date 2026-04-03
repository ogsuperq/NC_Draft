import React, { useState } from 'react';
import axios from 'axios';
import { X, Sparkles, Send } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AIAssistant = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: 'Good evening. I am Neapolitan Intelligence, your discreet estate management assistant. How may I assist you today?'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API}/ai/command`, { command: input });
      setMessages(prev => [...prev, { type: 'ai', content: response.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'ai', content: 'I apologize for the inconvenience. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div 
      data-testid="ai-assistant-panel"
      className="fixed right-0 top-0 h-full w-96 luxury-card border-l shadow-2xl flex flex-col fade-in"
      style={{ background: '#0A0A0A', borderColor: 'rgba(198, 169, 107, 0.4)' }}
    >
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'rgba(198, 169, 107, 0.15)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles size={20} strokeWidth={1.5} className="text-luxury-gold" />
            <h3 className="text-lg font-heading font-normal text-luxury-white">Neapolitan Intelligence</h3>
          </div>
          <button
            data-testid="ai-assistant-close"
            onClick={onClose}
            className="p-1 rounded-sm hover:bg-luxury-surface luxury-transition"
          >
            <X size={20} strokeWidth={1.5} className="text-luxury-white/60" />
          </button>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-luxury-white/40 mt-2">Discreet AI Assistant</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            data-testid={`ai-message-${idx}`}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-sm ${
                msg.type === 'user'
                  ? 'bg-luxury-gold text-luxury-black'
                  : 'bg-luxury-surface text-luxury-white border border-luxury-border-subtle'
              }`}
            >
              <p className="text-sm font-light leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-luxury-surface text-luxury-white border border-luxury-border-subtle p-4 rounded-sm">
              <p className="text-sm font-light">Processing...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t" style={{ borderColor: 'rgba(198, 169, 107, 0.15)' }}>
        <div className="flex space-x-2">
          <input
            data-testid="ai-assistant-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask or command..."
            className="luxury-input flex-1 py-2 px-3 text-sm bg-luxury-surface rounded-sm"
            disabled={loading}
          />
          <button
            data-testid="ai-assistant-send"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="luxury-button-primary px-4 py-2 rounded-sm"
          >
            <Send size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;