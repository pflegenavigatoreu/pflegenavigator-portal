import { describe, it, expect } from 'vitest';
import { validateForm, ValidationResult } from './validation';

describe('validateForm', () => {
  it('sollte ein gueltiges Formular akzeptieren', () => {
    const data = {
      name: 'Max Mustermann',
      email: 'max@example.com',
      plz: '33607'
    };

    const rules = {
      name: [{ type: 'required' as const }, { type: 'min' as const, value: 2 }],
      email: [{ type: 'required' as const }, { type: 'email' as const }],
      plz: [{ type: 'required' as const }, { type: 'plz' as const }]
    };

    const result = validateForm(data, rules);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('sollte fehlende Pflichtfelder erkennen', () => {
    const data = {
      name: '',
      email: 'max@example.com'
    };

    const rules = {
      name: [{ type: 'required' as const }],
      email: [{ type: 'required' as const }]
    };

    const result = validateForm(data, rules);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe('name');
  });

  it('sollte ungueltige E-Mails erkennen', () => {
    const data = {
      email: 'keine-gueltige-email'
    };

    const rules = {
      email: [{ type: 'email' as const }]
    };

    const result = validateForm(data, rules);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].field).toBe('email');
  });

  it('sollte ungueltige PLZ erkennen', () => {
    const data = {
      plz: '1234' // Zu kurz
    };

    const rules = {
      plz: [{ type: 'plz' as const }]
    };

    const result = validateForm(data, rules);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].field).toBe('plz');
  });

  it('sollte min-Laenge ueberpruefen', () => {
    const data = {
      name: 'M' // Zu kurz
    };

    const rules = {
      name: [{ type: 'min' as const, value: 2 }]
    };

    const result = validateForm(data, rules);
    expect(result.isValid).toBe(false);
  });

  it('sollte max-Laenge ueberpruefen', () => {
    const data = {
      name: 'Dieser Name ist viel zu lang fuer das Feld'
    };

    const rules = {
      name: [{ type: 'max' as const, value: 20 }]
    };

    const result = validateForm(data, rules);
    expect(result.isValid).toBe(false);
  });

  it('sollte Pattern validieren', () => {
    const data = {
      phone: 'abc123'
    };

    const rules = {
      phone: [{ type: 'pattern' as const, value: /^[\d\s\-\+\(\)]+$/ }]
    };

    const result = validateForm(data, rules);
    expect(result.isValid).toBe(false);
  });

  it('sollte bei leeren Daten keine Fehler werfen wenn nicht required', () => {
    const data = {
      email: ''
    };

    const rules = {
      email: [{ type: 'email' as const }]
    };

    const result = validateForm(data, rules);
    expect(result.isValid).toBe(true);
  });
});
