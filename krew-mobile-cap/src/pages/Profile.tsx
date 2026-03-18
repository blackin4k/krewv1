import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, User, Mail, Lock, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Profile = () => {
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    const handleSave = () => {
        // Implement password change logic here
        console.log('Update password', passwords);
    };

    return (
        <div className="min-h-screen bg-[#0A0A0C] pb-[120px] pt-safe px-6 font-sans">
            {/* 1. Header & Actions */}
            <div className="flex items-center justify-between py-6">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full bg-[#151518] text-white hover:bg-[#222]">
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <div className="flex gap-3">
                    <Button variant="ghost" className="bg-[#151518] text-white rounded-full hover:bg-[#222] px-6 text-[14px]">Edit</Button>
                    <Button
                        variant="destructive"
                        size="icon"
                        className="rounded-full bg-[#151518] text-[#FF4444] hover:bg-[#222]"
                        onClick={() => {
                            useAuthStore.getState().logout();
                            navigate('/login');
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    </Button>
                </div>
            </div>

            {/* 2. User Info */}
            <div className="flex flex-col items-center mb-8">
                <div className="h-32 w-32 rounded-full p-[3px] bg-gradient-to-br from-[#6F8CFF] to-[#A478FF] mb-4 shadow-xl shadow-[#6F8CFF]/20">
                    <div className="h-full w-full rounded-full bg-[#121212] flex items-center justify-center overflow-hidden border-4 border-[#121212]">
                        {user?.avatar ? ( // Mock avatar check, assuming user object structure
                            <img src={user.avatar} className="w-full h-full object-cover" />
                        ) : (
                            <User className="h-12 w-12 text-[#9CA3AF]" />
                        )}
                    </div>
                </div>
                <h2 className="text-[28px] font-bold text-white tracking-tight leading-none mb-1">{user?.username || 'User'}</h2>
                <div className="px-3 py-1 rounded-full bg-[#1DB954]/10 text-[#1DB954] text-[12px] font-bold uppercase tracking-wider border border-[#1DB954]/20">
                    Premium
                </div>
            </div>

            {/* 3. Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-[#151518] rounded-[24px] p-5 flex flex-col justify-between h-[110px] border border-white/5">
                    <div className="p-2 rounded-full bg-[#6F8CFF]/10 w-fit">
                        <Clock className="w-5 h-5 text-[#6F8CFF]" />
                    </div>
                    <div>
                        <div className="text-[22px] font-bold text-white leading-none">1,240</div>
                        <div className="text-[12px] text-[#9CA3AF] mt-1 font-medium">Minutes Listened</div>
                    </div>
                </div>
                <div className="bg-[#151518] rounded-[24px] p-5 flex flex-col justify-between h-[110px] border border-white/5">
                    <div className="p-2 rounded-full bg-[#A478FF]/10 w-fit">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A478FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                    </div>
                    <div>
                        <div className="text-[18px] font-bold text-white leading-none truncate">Indie Rock</div>
                        <div className="text-[12px] text-[#9CA3AF] mt-1 font-medium">Top Genre</div>
                    </div>
                </div>
            </div>

            {/* 4. Settings Form (Simplified/Hidden visually for design port, or kept as 'Account Details') */}
            <div className="space-y-6">
                <h3 className="text-[18px] font-bold text-white">Account Details</h3>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[13px] font-medium text-[#9CA3AF] uppercase tracking-wider ml-1">Username</label>
                        <div className="flex items-center gap-3 h-14 px-5 rounded-[20px] bg-[#151518] border border-white/5">
                            <User className="h-5 w-5 text-[#9CA3AF]" />
                            <span className="text-white font-medium">{user?.username}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[13px] font-medium text-[#9CA3AF] uppercase tracking-wider ml-1">Email</label>
                        <div className="flex items-center gap-3 h-14 px-5 rounded-[20px] bg-[#151518] border border-white/5">
                            <Mail className="h-5 w-5 text-[#9CA3AF]" />
                            <span className="text-white font-medium">{user?.email || 'No email linked'}</span>
                        </div>
                    </div>
                </div>

                {/* Password Change - Collapsed/Link */}
                <div className="pt-4">
                    <Button variant="outline" className="w-full h-14 rounded-[20px] bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white justify-between px-6">
                        Change Password
                        <ChevronLeft className="w-5 h-5 rotate-180 opacity-50" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
