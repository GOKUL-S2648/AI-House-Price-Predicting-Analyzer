import React, { useState, useRef, useEffect } from 'react';

const SUGGESTIONS = [
  "Explain the 30% budget rule",
  "Which area is best for professionals?",
  "Indian Rent Control highlights",
  "Budgeting for Pune vs Bangalore",
  "Check my income affordability"
];

const formatResponse = (text: string) => {
  return text.split('\n').map((line, i) => {
    let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-900 font-extrabold">$1</strong>');
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      return <li key={i} className="ml-5 list-disc mb-2" dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^[*-]\s/, '') }} />;
    }
    return <p key={i} className="mb-4 last:mb-0" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
  });
};

interface ChatAIProps {
  contextHouses?: any[];
  user: any;
}

const ChatAI: React.FC<ChatAIProps> = ({ contextHouses = [], user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Welcome, ${user?.name || 'there'}. I'm your AffordHome concierge. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Fix: customMessage is marked as optional (?) to allow calling handleSend() without arguments from the form onSubmit event.
  const handleSend = async (customMessage?: string) => {
    const userMessage = (customMessage || input).trim();
    if (!userMessage || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const houseContext = contextHouses.length > 0
        ? `I am currently looking at these listings: ${contextHouses.map(h => `${h.title} (₹${h.price} in ${h.district})`).join(', ')}.`
        : "I haven't picked a favorite house yet.";

      const userContext = user
        ? `My monthly income is ₹${user.income}. My name is ${user.name}.`
        : "I am browsing as a guest.";

      const systemPrompt = `You are a sophisticated real estate concierge for AffordHome. 
      TONE: Professional and helpful.
      CONTEXT: ${userContext} ${houseContext}
      RULES: Keep it concise. Reference their income of ₹${user?.income || 'N/A'}.`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices[0]?.message?.content || "I apologize, I missed that.";
      setMessages(prev => [...prev, { role: 'ai', text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Trouble connecting. Try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="mb-6 w-[400px] h-[600px] bg-white rounded-[32px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
          <div className="brand-gradient p-6 text-white flex items-center justify-between">
            <h3 className="text-lg font-bold">Concierge</h3>
            <button onClick={() => setIsOpen(false)}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-100'
                  }`}>
                  {msg.role === 'ai' ? formatResponse(msg.text) : msg.text}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-xs text-gray-400 italic">Concierge is typing...</div>}
          </div>

          <div className="p-6 bg-white border-t border-gray-100">
            <div className="flex flex-wrap gap-2 mb-4">
              {SUGGESTIONS.map((s, idx) => (
                <button key={idx} onClick={() => handleSend(s)} className="text-[10px] font-bold text-gray-400 border border-gray-200 px-3 py-1 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-all">{s}</button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border-transparent focus:bg-white focus:border-indigo-100 outline-none transition-all" />
              <button type="submit" disabled={!input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 p-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
            </form>
          </div>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className="w-16 h-16 rounded-full brand-gradient shadow-2xl flex items-center justify-center hover:scale-105 transition-all text-white">
        {isOpen ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
      </button>
    </div>
  );
};

export default ChatAI;