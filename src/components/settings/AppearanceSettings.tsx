"use client"

import { Palette, Sun, Moon, Settings } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { THEME_OPTIONS } from "@/lib/constants"

interface AppearanceSettingsProps {
    appearance: string
    onAppearanceChange: (theme: string) => void
}

const themeConfig = [
    { value: "light", label: "Light", icon: Sun, iconColor: "text-amber-500" },
    { value: "dark", label: "Dark", icon: Moon, iconColor: "text-slate-600" },
    { value: "system", label: "System", icon: Settings, iconColor: "text-slate-500" },
] as const

export function AppearanceSettings({
    appearance,
    onAppearanceChange
}: AppearanceSettingsProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-semibold">Tampilan</h2>
            </div>

            <div className="space-y-4">
                {/* Theme Selection */}
                <div>
                    <Label className="mb-3 block">Tema Aplikasi</Label>
                    <div className="grid grid-cols-3 gap-4">
                        {themeConfig.map(({ value, label, icon: Icon, iconColor }) => (
                            <button
                                key={value}
                                onClick={() => onAppearanceChange(value)}
                                className={`p-4 rounded-lg border-2 transition-all ${appearance === value
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <Icon className={`w-8 h-8 mx-auto mb-2 ${iconColor}`} />
                                <p className="text-sm font-medium text-center">{label}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Language Selection */}
                <div className="space-y-2">
                    <Label>Bahasa</Label>
                    <Select defaultValue="id">
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="id">🇮🇩 Bahasa Indonesia</SelectItem>
                            <SelectItem value="en">🇬🇧 English</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
