'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, QrCode, Link, Copy, Check, Printer, Shield, Users, Globe, Ambulance } from 'lucide-react';

interface MagicLinkGeneratorProps {
  caseCode: string;
}

export function MagicLinkGenerator({ caseCode }: MagicLinkGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [activeMode, setActiveMode] = useState<'full' | 'guest' | 'emergency'>('full');

  const generateLink = async (type: string, options?: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseCode, type, ...options }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data);
      }
    } catch (error) {
      console.error('Fehler:', error);
    }
    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    if (!result?.qrCode) return;
    
    const link = document.createElement('a');
    link.href = result.qrCode;
    link.download = `PflegeNavigator-${caseCode}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Link className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle>Magic Link</CardTitle>
            <CardDescription>Permanenter Zugriff auf Ihre Daten</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Modus Auswahl */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button
            variant={activeMode === 'full' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveMode('full')}
          >
            <QrCode className="w-4 h-4 mr-1" />
            Vollzugriff
          </Button>
          <Button
            variant={activeMode === 'guest' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveMode('guest')}
          >
            <Users className="w-4 h-4 mr-1" />
            Gast
          </Button>
          <Button
            variant={activeMode === 'emergency' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveMode('emergency')}
          >
            <Ambulance className="w-4 h-4 mr-1" />
            Notfall
          </Button>
        </div>

        {/* Vollzugriff */}
        {activeMode === 'full' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Erstellen Sie einen QR-Code für permanenten Zugriff.
              Speichern oder drucken Sie den QR-Code aus.
            </p>
            
            {!result?.qrCode ? (
              <Button 
                onClick={() => generateLink('full')} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Wird erstellt...' : 'QR-Code + Link erstellen'}
              </Button>
            ) : (
              <div className="space-y-4">
                {result.qrCode && (
                  <div className="flex justify-center">
                    <img 
                      src={result.qrCode} 
                      alt="QR-Code" 
                      className="w-48 h-48 rounded-lg shadow-md"
                    />
                  </div>
                )}

                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Magic Link:</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={result.magicLink}
                      readOnly
                      className="flex-1 text-xs bg-white border rounded px-2 py-1"
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(result.magicLink)}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={downloadQR}>
                    <Download className="w-4 h-4 mr-2" />
                    QR speichern
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => window.print()}>
                    <Printer className="w-4 h-4 mr-2" />
                    Drucken
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Gast */}
        {activeMode === 'guest' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Link für Angehörige oder Pflegekräfte mit eingeschränktem Zugriff.
            </p>
            
            {!result?.guestLink ? (
              <Button 
                onClick={() => generateLink('guest', { permissions: ['view_results'] })} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Wird erstellt...' : 'Gast-Link erstellen'}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Gast-Link erstellt!</strong><br />
                    Nur: Ergebnisse anzeigen
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Gast-Link:</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={result.guestLink}
                      readOnly
                      className="flex-1 text-xs bg-white border rounded px-2 py-1"
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(result.guestLink)}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'PflegeNavigator Zugriff',
                        text: `Zugriff auf Fall ${caseCode}`,
                        url: result.guestLink,
                      });
                    }
                  }}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Teilen (WhatsApp, etc.)
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Notfall */}
        {activeMode === 'emergency' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Notfall-Link für Ärzte, Rettungsdienst oder Pflegedienst.
            </p>
            
            {!result?.emergencyLink ? (
              <Button 
                onClick={() => generateLink('emergency')} 
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Ambulance className="w-4 h-4 mr-2" />
                {loading ? 'Wird erstellt...' : 'Notfall-Link erstellen'}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800">
                    <strong>⚠️ Notfall-Link</strong><br />
                    Für medizinisches Personal.
                    Ausdrucken und griffbereit halten.
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Notfall-Link:</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={result.emergencyLink}
                      readOnly
                      className="flex-1 text-xs bg-white border rounded px-2 py-1"
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(result.emergencyLink)}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.print()}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Notfallkarte drucken
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="text-xs text-slate-500">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 flex-shrink-0" />
          <p>
            Diese Links enthalten einen eindeutigen Token.
            Wer den Link hat, kann auf die Daten zugreifen.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
