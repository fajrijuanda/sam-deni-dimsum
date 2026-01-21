"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle } from "lucide-react"

export function WhatsAppBubble() {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [message, setMessage] = useState("")

    const handleSend = () => {
        const phone = "6285117784817"
        const text = `Halo Admin Sam Deni Dimsum,\n\nSaya ${name}.\n${message}`
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
        window.open(url, '_blank')
        setOpen(false)
        setName("")
        setMessage("")
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl z-50 flex items-center justify-center animate-bounce duration-[2000ms]"
                    aria-label="Chat WhatsApp Admin"
                >
                    <MessageCircle className="w-8 h-8" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Chat WhatsApp</DialogTitle>
                    <DialogDescription>
                        Hubungi kami langsung via WhatsApp untuk pertanyaan lebih lanjut.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Nama Anda</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Masukkan nama..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Pesan / Pertanyaan</Label>
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Apa yang ingin Anda tanyakan?"
                        />
                    </div>
                    <Button
                        onClick={handleSend}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
                        disabled={!name || !message}
                    >
                        Kirium Pesan WA
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
