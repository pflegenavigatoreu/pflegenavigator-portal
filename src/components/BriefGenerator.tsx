"use client";

import React, { useState, useRef } from 'react';
import { Download, Mic, FileText, Bot, Send, Loader2, User, Building2, AlertCircle } from 'lucide-react';

interface BriefGeneratorProps {
  typ: 'versorgungsamt' | 'em-rente' | 'allgemein';
  titel?: string;
}

export default function BriefGenerator({ typ, titel }: BriefGeneratorProps) {
  const [brief, setBrief] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [formData, setFormData] = useState({
    // Empfänger
    empfaengerName: '',
    empfaengerStrasse: '',
    empfaengerPlz: '',
    empfaengerOrt: '',
    
    // Absender
    absenderName: '',
    absenderStrasse: '',
    absenderPlz: '',
    absenderOrt: '',
    absenderTelefon: '',
    
    // Inhalt
    betreff: '',
    antragsgrund: '',
    dringlichkeit: 'normal',
    
    // EM-Rente spezifisch
    svNummer: '',
    diagnose: '',
    krankSeit: '',
  });

  const generateBrief = async () => {
    setLoading(true);
    setError('');

    try {
      const endpoint = typ === 'em-rente' ? '/api/briefe/em-rente' :
                      typ === 'versorgungsamt' ? '/api/briefe/versorgungsamt' :
                      '/api/briefe/generate';

      const payload = buildPayload();

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Generierung fehlgeschlagen');

      const data = await response.json();
      setBrief(data.brief);

      // Text-to-Speech
      if (voiceEnabled && 'speechSynthesis' in window) {
        speakText('Brief erfolgreich generiert. Sie können ihn jetzt herunterladen.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler bei der Generierung');
    } finally {
      setLoading(false);
    }
  };

  const buildPayload = () => {
    const base = {
      empfaenger: {
        name: formData.empfaengerName,
        strasse: formData.empfaengerStrasse,
        plz: formData.empfaengerPlz,
        ort: formData.empfaengerOrt,
      },
      absender: {
        name: formData.absenderName,
        strasse: formData.absenderStrasse,
        plz: formData.absenderPlz,
        ort: formData.absenderOrt,
        telefon: formData.absenderTelefon,
      },
    };

    if (typ === 'em-rente') {
      return {
        ...base,
        antragsteller: base.absender,
        krankheit: {
          diagnose: formData.diagnose,
          krank_seit: formData.krankSeit,
          behandelnder_arzt: 'Siehe Anlagen',
        },
        rentenart: 'teilweise',
        unterlagen: ['Ärztliche Bescheinigung', 'Lohnabrechnungen']
      };
    }

    return {
      ...base,
      inhalt: {
        betreff: formData.betreff,
        antragsgrund: formData.antragsgrund,
        dringlichkeit: formData.dringlichkeit,
      },
      anlagen: ['Personalausweis']
    };
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    window.speechSynthesis.speak(utterance);
  };

  const downloadBrief = () => {
    const blob = new Blob([brief], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brief-${typ}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const titelText = titel || (typ === 'em-rente' ? 'Erwerbsminderungsrente' : 
                              typ === 'versorgungsamt' ? 'Sozialamt/Versorgungsamt' : 
                              'Allgemeiner Brief');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Brief-Generator</h3>
          <p className="text-sm text-gray-500">{titelText}</p>
        </div>
        
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`ml-auto p-2 rounded-lg transition ${voiceEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}
          title={voiceEnabled ? 'Sprachausgabe an' : 'Sprachausgabe aus'}
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Empfänger */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Empfänger
          </h4>
          <input
            type="text"
            placeholder="Behördenname *"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={formData.empfaengerName}
            onChange={e => setFormData({...formData, empfaengerName: e.target.value})}
          />
          <input
            type="text"
            placeholder="Straße, Hausnr."
            className="w-full px-3 py-2 border rounded-lg"
            value={formData.empfaengerStrasse}
            onChange={e => setFormData({...formData, empfaengerStrasse: e.target.value})}
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="PLZ"
              className="w-24 px-3 py-2 border rounded-lg"
              value={formData.empfaengerPlz}
              onChange={e => setFormData({...formData, empfaengerPlz: e.target.value})}
            />
            <input
              type="text"
              placeholder="Ort"
              className="flex-1 px-3 py-2 border rounded-lg"
              value={formData.empfaengerOrt}
              onChange={e => setFormData({...formData, empfaengerOrt: e.target.value})}
            />
          </div>
        </div>

        {/* Absender */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4" /> Absender
          </h4>
          <input
            type="text"
            placeholder="Ihr Name *"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={formData.absenderName}
            onChange={e => setFormData({...formData, absenderName: e.target.value})}
          />
          <input
            type="text"
            placeholder="Straße, Hausnr."
            className="w-full px-3 py-2 border rounded-lg"
            value={formData.absenderStrasse}
            onChange={e => setFormData({...formData, absenderStrasse: e.target.value})}
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="PLZ"
              className="w-24 px-3 py-2 border rounded-lg"
              value={formData.absenderPlz}
              onChange={e => setFormData({...formData, absenderPlz: e.target.value})}
            />
            <input
              type="text"
              placeholder="Ort"
              className="flex-1 px-3 py-2 border rounded-lg"
              value={formData.absenderOrt}
              onChange={e => setFormData({...formData, absenderOrt: e.target.value})}
            />
          </div>
          <input
            type="tel"
            placeholder="Telefon (optional)"
            className="w-full px-3 py-2 border rounded-lg"
            value={formData.absenderTelefon}
            onChange={e => setFormData({...formData, absenderTelefon: e.target.value})}
          />
        </div>
      </div>

      {/* Inhalt */}
      <div className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Betreff *"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={formData.betreff}
          onChange={e => setFormData({...formData, betreff: e.target.value})}
        />
        <textarea
          placeholder="Ihr Anliegen/Antragsgrund *"
          rows={4}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={formData.antragsgrund}
          onChange={e => setFormData({...formData, antragsgrund: e.target.value})}
        />
        <select
          className="w-full px-3 py-2 border rounded-lg"
          value={formData.dringlichkeit}
          onChange={e => setFormData({...formData, dringlichkeit: e.target.value})}
        >
          <option value="normal">Normale Bearbeitung</option>
          <option value="hoch">Eilbedürftig</option>
          <option value="sehr_hoch">Sehr dringend (akut)</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={generateBrief}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Generiere...</>
          ) : (
            <><Send className="w-5 h-5" /> Brief generieren</>
          )}
        </button>
      </div>

      {/* Ergebnis */}
      {brief && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Vorschau</span>
            <button
              onClick={downloadBrief}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Download className="w-4 h-4" /> Herunterladen
            </button>
          </div>
          <pre className="p-4 text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap font-mono bg-white max-h-64 overflow-y-auto">
            {brief}
          </pre>
        </div>
      )}
    </div>
  );
}
