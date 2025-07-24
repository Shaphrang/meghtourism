'use client'

import { useState, useEffect } from 'react'
import { Phone, MessageCircle, Copy } from 'lucide-react'
import { toast } from 'react-hot-toast'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ContactRevealProps {
  phone: string
  whatsapp?: string
  message?: string
  className?: string
}

export default function ContactReveal({
  phone,
  whatsapp,
  message = 'Want direct owner contact? No brokers, save money!',
  className,
}: ContactRevealProps) {
  const [revealed, setRevealed] = useState(false)

  // restore reveal state from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    const key = `contact-revealed-${phone}`
    if (localStorage.getItem(key) === 'true') {
      setRevealed(true)
    }
  }, [phone])

  const handleReveal = () => {
    setRevealed(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem(`contact-revealed-${phone}`, 'true')
    }
  }

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(phone).then(() => toast.success('📋 Number copied!'))
    }
  }

  const whatsappNumber = (whatsapp || phone).replace(/\D/g, '')

  return (
    <div className={cn('rounded-md border p-4 text-center bg-white shadow-sm', className)}>
      {!revealed ? (
        <div className="space-y-3">
          <h3 className="text-base font-semibold">📞 Contact Owner</h3>
          {message && <p className="text-sm text-gray-700">{message}</p>}
          <Button onClick={handleReveal} className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
            🔓 Reveal Contact
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold text-lg">
            <Phone size={18} />
            <span>{phone}</span>
            <button onClick={handleCopy} aria-label="Copy number" className="text-gray-600 hover:text-gray-800">
              <Copy size={16} />
            </button>
          </div>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-green-600 font-medium text-sm hover:underline"
          >
            <MessageCircle size={16} /> WhatsApp
          </a>
        </div>
      )}
    </div>
  )
}