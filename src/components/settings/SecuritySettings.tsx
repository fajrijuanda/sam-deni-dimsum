"use client"

import { Shield, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SecuritySettings() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-semibold">Keamanan</h2>
            </div>

            <div className="space-y-4">
                {/* Change Password Section */}
                <div className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <Key className="w-5 h-5 text-slate-500" />
                        <div>
                            <p className="font-medium">Ubah Password</p>
                            <p className="text-sm text-slate-500">Perbarui password akun Anda</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label>Password Lama</Label>
                            <Input type="password" placeholder="••••••••" />
                        </div>
                        <div className="space-y-2">
                            <Label>Password Baru</Label>
                            <Input type="password" placeholder="••••••••" />
                        </div>
                        <div className="space-y-2">
                            <Label>Konfirmasi Password Baru</Label>
                            <Input type="password" placeholder="••••••••" />
                        </div>
                        <Button variant="outline" className="w-full">
                            Ubah Password
                        </Button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="font-medium text-red-700 mb-2">Zona Berbahaya</p>
                    <p className="text-sm text-red-600 mb-3">Tindakan ini tidak dapat dibatalkan.</p>
                    <Button variant="destructive" className="w-full">
                        Hapus Akun
                    </Button>
                </div>
            </div>
        </div>
    )
}
