"use client"

import { Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BusinessSettings as BusinessSettingsType } from "@/lib/types"

interface BusinessSettingsProps {
    business: BusinessSettingsType
    onBusinessChange: (business: BusinessSettingsType) => void
}

export function BusinessSettings({ business, onBusinessChange }: BusinessSettingsProps) {
    const handleChange = (field: keyof BusinessSettingsType, value: string) => {
        onBusinessChange({ ...business, [field]: value })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-semibold">Informasi Bisnis</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                    <Label>Nama Bisnis</Label>
                    <Input
                        value={business.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label>Alamat</Label>
                    <Input
                        value={business.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Telepon Bisnis</Label>
                    <Input
                        value={business.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Jam Buka</Label>
                        <Input
                            type="time"
                            value={business.openHours}
                            onChange={(e) => handleChange("openHours", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Jam Tutup</Label>
                        <Input
                            type="time"
                            value={business.closeHours}
                            onChange={(e) => handleChange("closeHours", e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
