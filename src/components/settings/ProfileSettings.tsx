"use client"

import { User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UserProfile } from "@/lib/types"

interface ProfileSettingsProps {
    profile: UserProfile
    onProfileChange: (profile: UserProfile) => void
}

export function ProfileSettings({ profile, onProfileChange }: ProfileSettingsProps) {
    const handleChange = (field: keyof UserProfile, value: string) => {
        onProfileChange({ ...profile, [field]: value })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-semibold">Profil Pengguna</h2>
            </div>

            {/* Avatar Section */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-2xl font-bold">
                    {profile.name.charAt(0)}
                </div>
                <div>
                    <p className="font-semibold">{profile.name}</p>
                    <p className="text-sm text-slate-500">{profile.role}</p>
                </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Nama Lengkap</Label>
                    <Input
                        value={profile.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Nomor Telepon</Label>
                    <Input
                        value={profile.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Role</Label>
                    <Input value={profile.role} disabled className="bg-slate-100" />
                </div>
            </div>
        </div>
    )
}
