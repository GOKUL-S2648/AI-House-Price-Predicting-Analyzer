import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'affordhome_v1_users';

const DEFAULT_USER = {
  id: '00000000-0000-0000-0000-000000000000',
  name: 'Admin Demo',
  email: 'admin@affordhome.ai',
  password: 'password123',
  income: 75000,
  role: 'admin'
};

interface AuthProps {
  onLogin: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    setError(null);
    setFormData({ name: '', email: '', password: '' });
  }, [isLogin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    let storedUsers = [DEFAULT_USER];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) storedUsers = [...storedUsers, ...parsed];
      }
    } catch (err) { }

    const emailInput = formData.email.trim().toLowerCase();
    const passwordInput = formData.password.trim();

    if (isLogin) {
      const foundUser = storedUsers.find(u => u.email.toLowerCase() === emailInput && u.password === passwordInput);
      if (foundUser) onLogin(foundUser);
      else setError('Invalid credentials.');
    } else {
      if (!formData.name.trim()) return setError('Name is required.');
      const newUser = {
        id: crypto.randomUUID ? crypto.randomUUID() : 'user_' + Math.random().toString(36).substr(2, 9),
        name: formData.name.trim(),
        email: emailInput,
        password: passwordInput,
        role: 'user'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...storedUsers.slice(1), newUser]));
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center font-sans overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Luxury living space"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-white/30"></div>
      </div>

      <div className="relative z-10 w-full max-w-[480px] px-6">
        <div className="bg-white rounded-[40px] border border-black/5 p-10 md:p-14 shadow-2xl space-y-10">
          
          {/* Properly Branding */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-[#0F172A] tracking-[0.2em]">PR</span>
              <div className="relative">
                <span className="text-3xl font-black text-[#0F172A] tracking-[0.2em] opacity-0">O</span>
                <svg className="absolute inset-0 w-full h-full text-[#00AEEF]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
              </div>
              <span className="text-3xl font-black text-[#0F172A] tracking-[0.2em]">PERLY</span>
            </div>
            <p className="text-[#00AEEF] text-[10px] font-black uppercase tracking-[0.4em]">modern. intelligent. real estate.</p>
          </div>

          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-black text-[#0F172A] tracking-tight">
              {isLogin ? 'Welcome Back' : 'Join Property'}
            </h1>
            <p className="text-gray-400 text-sm font-medium">
              Access premium investments and market analytics.
            </p>
          </div>

          <form onSubmit={handleAuthAction} className="space-y-6">
            {error && (
              <div className="bg-rose-50 text-rose-500 text-[12px] font-bold py-3 px-5 rounded-2xl border border-rose-100 text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {!isLogin && (
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full bg-[#F8FAFC] border border-black/5 rounded-2xl px-6 py-4 text-[#0F172A] focus:outline-none focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/5 transition-all placeholder:text-gray-400 font-semibold"
                />
              )}
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full bg-[#F8FAFC] border border-black/5 rounded-2xl px-6 py-4 text-[#0F172A] focus:outline-none focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/5 transition-all placeholder:text-gray-400 font-semibold"
              />
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full bg-[#F8FAFC] border border-black/5 rounded-2xl px-6 py-4 text-[#0F172A] focus:outline-none focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/5 transition-all placeholder:text-gray-400 font-semibold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-[#00AEEF] to-[#0077B6] text-white font-black rounded-2xl shadow-xl shadow-[#00AEEF]/10 hover:shadow-[#00AEEF]/30 hover:scale-[1.02] transition-all active:scale-95 uppercase tracking-widest text-sm"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>

            <div className="pt-4 flex flex-col items-center gap-4">
              <p className="text-gray-400 text-[13px] font-bold">
                {isLogin ? "New to Properly?" : "Member of Properly?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#00AEEF] font-black pl-2 hover:underline tracking-tight"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
              
              {isLogin && (
                <button 
                  type="button"
                  className="text-gray-300 text-[11px] font-black uppercase tracking-widest hover:text-[#0F172A] transition-colors"
                >
                  Forgot your password?
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Modern Edge Navigation Decor */}
      <div className="fixed top-10 right-10 hidden lg:flex items-center gap-8 z-20">
        {['Market', 'Intelligence', 'Analytics'].map(link => (
          <a key={link} href="#" className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-[#00AEEF] transition-colors">{link}</a>
        ))}
        <div className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>
    </div>
  );
};

export default Auth;