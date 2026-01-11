'use client'

import { useState, useEffect } from 'react'
import { User, Shield, Award, TrendingUp, Clock, Edit2, Save, X } from 'lucide-react'
import GlassCard from '@/components/GlassCard'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    joinDate: '',
  })
  const [editForm, setEditForm] = useState(profile)
  const [stats, setStats] = useState({
    safetyScore: 0,
    lessonsCompleted: 0,
    simulatorSessions: 0,
    totalTrades: 0,
  })

  // Load profile and stats from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile)
      setProfile(parsed)
      setEditForm(parsed)
    }

    // Load stats from localStorage
    const savedStats = {
      safetyScore: parseInt(localStorage.getItem('safetyScore') || '0'),
      lessonsCompleted: parseInt(localStorage.getItem('lessonsCompleted') || '0'),
      simulatorSessions: parseInt(localStorage.getItem('simulatorSessions') || '0'),
      totalTrades: parseInt(localStorage.getItem('totalTrades') || '0'),
    }
    setStats(savedStats)
  }, [])

  const handleSave = () => {
    setProfile(editForm)
    localStorage.setItem('userProfile', JSON.stringify(editForm))
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm(profile)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-gray-400">Manage your account and track your learning progress</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <GlassCard className="p-6 lg:col-span-1">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-cyber-cyan to-cyber-neon-green rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-cyber-dark" />
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-cyber-navy/60 border border-white/10 rounded-lg px-4 py-2 text-center focus:outline-none focus:border-cyber-cyan"
                  placeholder="Your name"
                />
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full bg-cyber-navy/60 border border-white/10 rounded-lg px-4 py-2 text-center focus:outline-none focus:border-cyber-cyan"
                  placeholder="Your email"
                />
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-cyber-neon-green/20 border border-cyber-neon-green/50 rounded-lg hover:bg-cyber-neon-green/30 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-1">{profile.name || 'Set your name'}</h2>
                <p className="text-gray-400 mb-2">{profile.email || 'Set your email'}</p>
                {profile.joinDate && (
                  <p className="text-sm text-gray-500 mb-4">Member since {profile.joinDate}</p>
                )}
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 mx-auto bg-cyber-cyan/20 border border-cyber-cyan/50 rounded-lg hover:bg-cyber-cyan/30 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              </>
            )}
          </div>

          {/* Safety Score */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Safety Score</span>
              <span className="text-2xl font-bold text-cyber-neon-green">{stats.safetyScore}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-cyber-cyan to-cyber-neon-green h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(stats.safetyScore, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Keep learning to improve your score!</p>
          </div>
        </GlassCard>

        {/* Stats Grid */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/5 text-cyber-cyan">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.lessonsCompleted}</p>
                <p className="text-sm text-gray-400">Lessons Completed</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/5 text-cyber-neon-green">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.simulatorSessions}</p>
                <p className="text-sm text-gray-400">Simulator Sessions</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/5 text-cyber-orange">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalTrades}</p>
                <p className="text-sm text-gray-400">Total Trades</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/5 text-cyber-neon-green">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.safetyScore}</p>
                <p className="text-sm text-gray-400">Safety Score</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Info Message */}
      <GlassCard className="p-6 bg-cyber-cyan/5 border-cyber-cyan/20">
        <p className="text-center text-gray-400">
          Your stats will update as you complete lessons, use the simulator, and explore the app.
        </p>
      </GlassCard>
    </div>
  )
}
