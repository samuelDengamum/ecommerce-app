'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  time: string;
};

export default function SupportAdmin() {
  const [activeChats, setActiveChats] = useState<Record<string, Message[]>>({});
  const [activeUsers, setActiveUsers] = useState<Record<string, {name: string, email: string, online: boolean, socketId?: string}>>({});
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socketRef.current = io('http://127.0.0.1:5000');

    socketRef.current.on('connect', () => {
      socketRef.current?.emit('join', { role: 'admin' });
    });

    socketRef.current.on('active_chats', (chats: Record<string, Message[]>) => {
      setActiveChats(chats);
    });

    socketRef.current.on('connected_users', (users: Record<string, { socketId: string; name: string; email: string; online: boolean }>) => {
      setActiveUsers(users);
    });

    socketRef.current.on('user_joined', ({ sessionId, profile, history }) => {
      setActiveUsers(prev => ({ ...prev, [sessionId]: profile }));
      setActiveChats(prev => {
        if (prev[sessionId] && prev[sessionId].length > 0) return prev;
        return { ...prev, [sessionId]: history || [] };
      });
    });

    socketRef.current.on('user_status', ({ sessionId, online }) => {
      setActiveUsers(prev => ({
        ...prev,
        [sessionId]: prev[sessionId] ? { ...prev[sessionId], online } : { name: 'Guest', email: '', online }
      }));
    });

    socketRef.current.on('receive_admin_msg', (msg: Message & { sessionId: string }) => {
      setActiveChats(prev => {
        const userChat = prev[msg.sessionId] || [];
        if (userChat.find(m => m.id === msg.id)) return prev;
        return {
          ...prev,
          [msg.sessionId]: [...userChat, msg]
        };
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChats, selectedUser]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedUser || !socketRef.current?.connected) return;

    socketRef.current.emit('admin_msg', {
      text: inputValue,
      targetSessionId: selectedUser
    });

    setInputValue('');
  };

  // Only show users who have actually sent a message (array length > 0)
  const users = Object.keys(activeChats).filter(id => activeChats[id] && activeChats[id].length > 0);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden flex h-[600px] mt-8">
      {/* Sidebar: Users List */}
      <div className="w-1/3 border-r border-white/10 bg-slate-900/50 flex flex-col">
        <div className="p-4 border-b border-white/10 shrink-0">
          <h2 className="font-bold text-lg text-white">Live Support Chats</h2>
          <p className="text-sm text-slate-400">{users.length} active sessions</p>
        </div>
            <div className="flex-1 overflow-y-auto w-full">
              {users.length === 0 ? (
                <p className="text-slate-500 text-sm text-center mt-10">No messages yet</p>
              ) : (
                users.map(sessionId => {
              const profile = activeUsers[sessionId] || { name: 'Guest', online: false };
              const isOnline = profile.online !== false;
              
              return (
              <button
                key={sessionId}
                onClick={() => setSelectedUser(sessionId)}
                className={`w-full text-left p-4 border-b border-white/5 transition-colors ${selectedUser === sessionId ? 'bg-blue-600/20 border-l-4 border-l-blue-500' : 'hover:bg-white/5 border-l-4 border-l-transparent'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-slate-300">
                      {profile.name.substring(0, 2).toUpperCase()}
                    </span>
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${isOnline ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                  </div>
                  <div className="truncate flex-1">
                    <p className="font-semibold text-slate-200 text-sm truncate">{profile.name}</p>
                    <p className="text-xs text-slate-400 truncate">
                      {activeChats[sessionId].length > 0 ? activeChats[sessionId][activeChats[sessionId].length - 1].text : 'No messages'}
                    </p>
                  </div>
                </div>
              </button>
            )})
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 flex flex-col bg-[#0b141a]/95 relative overflow-hidden" style={{ backgroundImage: "url('https://static.whatsapp.net/rsrc.php/v3/yl/r/1s1rM_qJ6bT.png')", backgroundSize: "cover", backgroundBlendMode: "overlay" }}>
        {!selectedUser ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 bg-slate-900/90 absolute inset-0 z-10">
            Select a user from the sidebar to chat
          </div>
        ) : (
          <div className="flex flex-col h-full z-20 bg-[#0b141a]/90 backdrop-blur-sm">
            <div className="p-3 border-b border-white/5 bg-[#202c33] shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                   <span className="text-sm font-bold text-slate-300">
                     {(activeUsers[selectedUser]?.name || 'Guest').substring(0, 2).toUpperCase()}
                   </span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                    {activeUsers[selectedUser]?.name || 'Guest'}
                    {activeUsers[selectedUser]?.online === false && <span className="text-[10px] text-slate-400 border border-slate-600 px-1.5 py-0.5 rounded uppercase tracking-wider">Offline</span>}
                  </h3>
                  {activeUsers[selectedUser]?.email && (
                    <p className="text-[11px] text-slate-400 leading-tight">{activeUsers[selectedUser].email}</p>
                  )}
                  <p className="text-[10px] text-blue-400/70 truncate w-32 mt-0.5">ID: {selectedUser}</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {activeChats[selectedUser]?.map(msg => (
                <div key={msg.id} className={`flex flex-col max-w-[75%] ${msg.sender === 'agent' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                  <div className={`relative px-3 py-2 text-[14.5px] rounded-lg shadow-sm ${msg.sender === 'agent' ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none' : 'bg-[#202c33] text-[#e9edef] rounded-tl-none'}`}>
                    {/* Small tail pointing to the speaker */}
                    <div className={`absolute top-0 w-3 h-3 ${msg.sender === 'agent' ? '-right-2 text-[#005c4b]' : '-left-2 text-[#202c33]'}`}>
                      <svg viewBox="0 0 8 13" fill="currentColor">
                        {msg.sender === 'agent' ? <path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"/> : <path d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"/>}
                      </svg>
                    </div>
                    {msg.text}
                    <div className="flex items-center justify-end gap-1 mt-1 -mb-1">
                      <span className="text-[10px] text-[#8696a0] leading-none">{msg.time}</span>
                      {msg.sender === 'agent' && (
                        <svg className="w-3.5 h-3.5 text-[#53bdeb] ml-0.5" viewBox="0 0 16 15" fill="none" stroke="currentColor">
                           <path d="M15.01 3.316L5.56 12.766L2 9.206M10.875 3.316l-5.315 5.315M2 5.5l2.5 2.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-[#202c33] shrink-0">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder="Type a message"
                  className="flex-1 bg-[#2a3942] border border-transparent text-[#e9edef] text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500/30 transition-all placeholder:text-[#8696a0]"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="bg-[#00a884] text-white rounded-lg w-12 h-[46px] flex items-center justify-center transition-all hover:bg-[#029777] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" className="text-white ml-1">
                    <path fill="currentColor" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"/>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
