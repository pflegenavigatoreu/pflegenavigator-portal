'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Mail, 
  Download, 
  Printer, 
  Smartphone, 
  CreditCard, 
  Share2,
  Check,
  Copy,
  Globe,
  Shield,
  Send,
  Loader2,
  QrCode
} from 'lucide-react';

interface QRCodeSenderProps {
  caseCode: string;
  defaultLanguage?: 'de' | 'en' | 'tr' | 'pl' | 'ru';
}

export function QRCodeSender({ caseCode, defaultLanguage = 'de' }: QRCodeSenderProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeMode, setActiveMode] = useState<'email' | 'download' | 'whatsapp' | 'print' | 'wallet'>('email');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    language: defaultLanguage
  });
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const t = {
    de: {
      title: 'QR-Code für Kunden',
      subtitle: 'Versand-Möglichkeiten',
      email: 'Per Email',
      download: 'Download',
      whatsapp: 'WhatsApp',
      wallet: 'Wallet-Karte',
      print: 'Drucken',
      sendButton: 'QR-Code senden',
      downloadButton: 'QR-Code herunterladen',
      printButton: 'Druckvorlage öffnen',
      walletButton: 'Wallet-Karte erstellen',
      successMessage: 'QR-Code erfolgreich gesendet!',
      errorMessage: 'Fehler beim Senden',
      placeholderEmail: 'kunde@email.de',
      placeholderName: 'Max Mustermann',
      placeholderPhone: '+49 123 456789',
      securityNote: 'Der QR-Code ermöglicht direkten Zugriff auf den Fall. Bewahren Sie ihn sicher auf.'
    },
    en: {
      title: 'QR-Code for Customer',
      subtitle: 'Delivery Options',
      email: 'By Email',
      download: 'Download',
      whatsapp: 'WhatsApp',
      wallet: 'Wallet Card',
      print: 'Print',
      sendButton: 'Send QR-Code',
      downloadButton: 'Download QR-Code',
      printButton: 'Open Print Template',
      walletButton: 'Create Wallet Card',
      successMessage: 'QR-Code sent successfully!',
      errorMessage: 'Error sending',
      placeholderEmail: 'customer@email.com',
      placeholderName: 'John Doe',
      placeholderPhone: '+1 234 567890',
      securityNote: 'The QR-Code enables direct access to the case. Keep it secure.'
    }
  };

  const currentT = t[formData.language as keyof typeof t] || t.de;

  const generateQR = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          caseCode, 
          type: activeMode === 'email' ? 'full' : activeMode === 'wallet' ? 'emergency' : 'full',
          ...(activeMode === 'email' && { recipientEmail: formData.email, recipientName: formData.name })
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || currentT.errorMessage);
      }
    } catch (err) {
      setError(currentT.errorMessage);
    }
    
    setLoading(false);
  };

  const copyCaseCode = () => {
    navigator.clipboard.writeText(caseCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-[#0f2744] to-[#20b2aa] rounded-xl">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle>{currentT.title}</CardTitle>
            <CardDescription>{currentT.subtitle}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">Fallnummer:</div>
            <div className="flex items-center gap-2">
              <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">{caseCode}</code>
              <Button size="sm" variant="ghost" onClick={copyCaseCode}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {result?.success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            ✓ {currentT.successMessage}
          </div>
        )}

        {/* Sprachauswahl */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sprache:</span>
          <div className="flex gap-2">
            {['de', 'en', 'tr', 'pl'].map((lang) => (
              <Button
                key={lang}
                size="sm"
                variant={formData.language === lang ? 'default' : 'outline'}
                onClick={() => setFormData({ ...formData, language: lang as any })}
                className="text-xs"
              >
                <Globe className="w-3 h-3 mr-1" />
                {lang.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Modus Auswahl */}
        <div className="grid grid-cols-5 gap-2">
          {[
            { id: 'email', icon: Mail, label: currentT.email },
            { id: 'download', icon: Download, label: currentT.download },
            { id: 'whatsapp', icon: Share2, label: 'WhatsApp' },
            { id: 'print', icon: Printer, label: currentT.print },
            { id: 'wallet', icon: CreditCard, label: currentT.wallet },
          ].map((mode) => (
            <Button
              key={mode.id}
              variant={activeMode === mode.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveMode(mode.id as any)}
              className="flex flex-col items-center h-auto py-2"
            >
              <mode.icon className="w-4 h-4 mb-1" />
              <span className="text-xs">{mode.label}</span>
            </Button>
          ))}
        </div>

        {/* Email Formular */}
        {activeMode === 'email' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name:</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={currentT.placeholderName}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email:</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={currentT.placeholderEmail}
              />
            </div>

            <Button 
              className="w-full" 
              onClick={generateQR}
              disabled={loading || !formData.email || !formData.name}
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              {currentT.sendButton}
            </Button>
          </div>
        )}

        {/* Download / andere Modi */}
        {activeMode !== 'email' && (
          <div className="space-y-4">
            <Button 
              className="w-full" 
              onClick={generateQR}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              {activeMode === 'download' && currentT.downloadButton}
              {activeMode === 'print' && currentT.printButton}
              {activeMode === 'wallet' && currentT.walletButton}
              {activeMode === 'whatsapp' && 'WhatsApp Link erstellen'}
            </Button>

            {result?.qrCode && activeMode === 'download' && (
              <div className="flex justify-center">
                <img 
                  src={result.qrCode} 
                  alt="QR-Code" 
                  className="w-48 h-48 rounded-lg shadow-md"
                />
              </div>
            )}

            {result?.magicLink && (
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Portal Link:</p>
                <code className="text-xs break-all">{result.magicLink}</code>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="text-xs text-slate-500">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>{currentT.securityNote}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
