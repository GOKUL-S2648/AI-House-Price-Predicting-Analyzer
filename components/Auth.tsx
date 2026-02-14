import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'affordhome_v1_users';

const DEFAULT_USER = {
  id: 'admin_001',
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
        id: 'user_' + Math.random().toString(36).substr(2, 9),
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F1F5F9] p-6 font-['Plus_Jakarta_Sans']">
      <div className="w-full max-w-[440px]">
        <div className="bg-white rounded-[54px] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] p-12 md:p-14 animate-in fade-in zoom-in-95 duration-500">

          {/* Logo Header */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-[#4338CA] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold text-[#1E1B4B] tracking-tight">AffordHome</span>
          </div>

          <form onSubmit={handleAuthAction} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 text-xs font-bold py-3 px-4 rounded-xl text-center animate-shake">
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="space-y-1">
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full bg-[#F8FAFC] border-none rounded-[20px] px-7 py-5 text-sm font-semibold text-[#1E1B4B] placeholder:text-gray-300 outline-none ring-2 ring-transparent focus:ring-indigo-500/10 transition-all"
                />
              </div>
            )}

            <div className="space-y-1">
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full bg-[#F8FAFC] border-none rounded-[20px] px-7 py-5 text-sm font-semibold text-[#1E1B4B] placeholder:text-gray-300 outline-none ring-2 ring-transparent focus:ring-indigo-500/10 transition-all"
              />
            </div>

            <div className="space-y-1">
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full bg-[#F8FAFC] border-none rounded-[20px] px-7 py-5 text-sm font-semibold text-[#1E1B4B] placeholder:text-gray-300 outline-none ring-2 ring-transparent focus:ring-indigo-500/10 transition-all"
              />
            </div>


            <button
              type="submit"
              className="w-full bg-[#3730A3] hover:bg-[#312E81] text-white font-extrabold py-5 rounded-[22px] mt-6 shadow-xl shadow-indigo-100 hover:scale-[1.01] active:scale-95 transition-all text-base tracking-tight"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>

            <div className="pt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-[11px] font-extrabold text-gray-400 uppercase tracking-[0.15em] hover:text-indigo-600 transition-colors"
              >
                {isLogin ? "Need an account?" : "Have an account?"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;