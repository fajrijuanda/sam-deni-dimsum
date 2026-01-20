"use client"

import { Database, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { IntegrationSettings as IntegrationSettingsType } from "@/lib/types"

interface IntegrationSettingsProps {
    integrations: IntegrationSettingsType
    onIntegrationsChange: (integrations: IntegrationSettingsType) => void
}

export function IntegrationSettings({
    integrations,
    onIntegrationsChange
}: IntegrationSettingsProps) {
    const handleSpreadsheetIdChange = (value: string) => {
        onIntegrationsChange({ ...integrations, spreadsheetId: value })
    }

    const handleToggleConnection = () => {
        onIntegrationsChange({
            ...integrations,
            googleSheetsConnected: !integrations.googleSheetsConnected
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-semibold">Integrasi</h2>
            </div>

            {/* Google Sheets Integration */}
            <div className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <FileSpreadsheet className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="font-medium">Google Sheets</p>
                            <p className="text-sm text-slate-500">Sinkronisasi data ke spreadsheet</p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${integrations.googleSheetsConnected
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                        {integrations.googleSheetsConnected ? 'Terhubung' : 'Tidak Terhubung'}
                    </span>
                </div>

                <div className="space-y-3">
                    <div className="space-y-2">
                        <Label>Spreadsheet ID</Label>
                        <Input
                            placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                            value={integrations.spreadsheetId}
                            onChange={(e) => handleSpreadsheetIdChange(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleToggleConnection}>
                        {integrations.googleSheetsConnected ? 'Putuskan Koneksi' : 'Hubungkan Google Sheets'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
