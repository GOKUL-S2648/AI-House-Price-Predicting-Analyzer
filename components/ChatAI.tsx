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
    let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#00AEEF] font-black">$1</strong>');
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      return <li key={i} className="ml-5 list-disc mb-2 text-gray-500" dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^[*-]\s/, '') }} />;
    }
    return <p key={i} className="mb-4 last:mb-0 text-gray-500" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
  });
};

interface ChatAIProps {
  contextHouses?: any[];
  user: any;
}

const ChatAI: React.FC<ChatAIProps> = ({ contextHouses = [], user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Welcome, ${user?.name || 'there'}. I'm your Properly Intelligence Navigator. How can I assist with your manifest search today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

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

      const systemPrompt = `You are a sophisticated real estate intelligence navigator for PROPERLY. 
      TONE: High-end, analytical, and professional. Use terms like 'Holding', 'Manifest', 'Units', and 'Intelligence'.
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
      const text = data.choices[0]?.message?.content || "I apologize, my neural link dropped.";
      setMessages(prev => [...prev, { role: 'ai', text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Neural link timeout. Reconnect later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="mb-8 w-[450px] h-[700px] bg-white rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-black/5 flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 duration-700">
          <div className="bg-white p-8 text-[#0F172A] flex items-center justify-between border-b border-black/5">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-black tracking-[0.2em] text-[#0F172A]">PR</span>
                    <div className="w-2.5 h-2.5 bg-[#00AEEF] rounded-full animate-pulse"></div>
                </div>
              <p className="text-[9px] text-[#00AEEF] font-black uppercase tracking-[0.4em]">Navigator Layer</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-3 bg-[#F8FAFC] hover:bg-gray-100 rounded-2xl transition-all border border-black/5 text-gray-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[90%] px-6 py-4 rounded-[28px] text-[13px] font-black tracking-wide leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-[#00AEEF] text-white rounded-tr-none' : 'bg-[#F8FAFC] text-gray-500 rounded-tl-none border border-black/5'
                   }`}>
                  {msg.role === 'ai' ? formatResponse(msg.text) : msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-3 pl-4">
                <div className="w-2 h-2 bg-[#00AEEF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[#00AEEF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[#00AEEF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
          </div>

          <div className="p-10 bg-[#F1F5F9]/30 border-t border-black/5">
            <div className="flex flex-wrap gap-3 mb-8">
              {SUGGESTIONS.map((s, idx) => (
                <button key={idx} onClick={() => handleSend(s)} className="text-[8px] font-black text-gray-400 border border-black/5 px-4 py-2 rounded-xl hover:bg-[#00AEEF]/10 hover:text-[#00AEEF] hover:border-[#00AEEF]/20 transition-all uppercase tracking-widest bg-white">{s}</button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Inquire with PROPERLY..." className="w-full bg-[#F8FAFC] rounded-2xl px-6 py-5 text-sm font-black border border-black/5 focus:border-[#00AEEF]/40 outline-none transition-all text-[#0F172A] placeholder:text-gray-300 uppercase tracking-widest shadow-inner" />
              <button type="submit" disabled={!input.trim()} className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${input.trim() ? 'bg-[#00AEEF] text-white shadow-lg shadow-[#00AEEF]/20' : 'text-gray-300 bg-gray-50'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
            </form>
          </div>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className="group relative w-24 h-24 rounded-[32px] bg-[#00AEEF] shadow-[0_20px_50px_rgba(0,174,239,0.25)] flex items-center justify-center hover:scale-110 active:scale-90 transition-all text-white border-4 border-white">
        {isOpen ? <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg> : (
          <div className="flex flex-col items-center">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
        )}
        <div className="absolute inset-0 rounded-[32px] border-2 border-white/20 scale-90 group-hover:scale-100 transition-transform"></div>
      </button>
    </div>
  );
};

export default ChatAI;