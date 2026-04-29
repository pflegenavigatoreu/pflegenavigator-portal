import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface AvatarChatRequest {
  message: string;
  pflegegrad?: number | null;
  module?: string[];
  sessionId?: string;
  context?: {
    previousMessages?: Array<{ role: 'user' | 'assistant'; content: string }>;
    userProfile?: {
      age?: number;
      careSituation?: string;
      federalState?: string;
    };
  };
}

interface AvatarChatResponse {
  text: string;
  action?: {
    type: 'show_module' | 'open_calculator' | 'start_assessment' | 'generate_pdf' | 'navigate';
    payload?: Record<string, unknown>;
  };
  suggestions?: string[];
  sources?: Array<{
    title: string;
    url?: string;
    sgb?: string;
    paragraph?: string;
  }>;
}

const AVATAR_RESPONSES: Record<string, AvatarChatResponse> = {
  default: {
    text: 'Ich bin Ihr PflegeNavigator-Assistent. Wie kann ich Ihnen bei der Pflegeunterstützung helfen?',
    suggestions: ['Pflegegrad berechnen', 'Leistungen anzeigen', 'Widerspruch einlegen']
  },
  pflegegrad: {
    text: 'Der Pflegegrad wird durch den Medizinischen Dienst (MD) festgelegt. Es gibt 5 Pflegegrade von 1 (gering) bis 5 (schwerst). Möchten Sie den Pflegegrad-Rechner nutzen?',
    action: { type: 'open_calculator', payload: { calculator: 'pflegegrad' } },
    sources: [{ title: '§ 15 SGB XI', sgb: 'XI', paragraph: '15' }]
  },
  leistungen: {
    text: 'Pflegebedürftige haben Anspruch auf verschiedene Leistungen: Pflegegeld, Pflegesachleistungen, Kombinationsleistungen, Tages- und Nachtpflege, sowie Verhinderungspflege.',
    suggestions: ['Pflegegeld beantragen', 'Sachleistungen erklären', 'Häufige Fragen']
  },
  widerspruch: {
    text: 'Falls Sie mit einem Bescheid des MD nicht einverstanden sind, können Sie Widerspruch einlegen. Ich kann Ihnen dabei helfen, einen Widerspruch zu formulieren.',
    action: { type: 'navigate', payload: { path: '/widerspruch' } }
  }
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: AvatarChatRequest = await request.json();
    const { message, pflegegrad, module: userModules, context } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400, headers: getCorsHeaders() }
      );
    }

    const lowerMessage = message.toLowerCase();
    let response: AvatarChatResponse;

    // Einfache Intent-Erkennung
    if (lowerMessage.includes('pflegegrad') || lowerMessage.includes('grad')) {
      response = AVATAR_RESPONSES.pflegegrad;
    } else if (lowerMessage.includes('leistung') || lowerMessage.includes('geld') || lowerMessage.includes('geldleistung')) {
      response = AVATAR_RESPONSES.leistungen;
    } else if (lowerMessage.includes('widerspruch') || lowerMessage.includes('einspruch') || lowerMessage.includes('beschwerde')) {
      response = AVATAR_RESPONSES.widerspruch;
    } else {
      response = {
        text: generateContextualResponse(message, pflegegrad, userModules, context),
        suggestions: generateSuggestions(pflegegrad, userModules)
      };
    }

    return NextResponse.json(response, {
      status: 200,
      headers: getCorsHeaders()
    });

  } catch (error) {
    console.error('Avatar chat error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        text: 'Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
      },
      { status: 500, headers: getCorsHeaders() }
    );
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders()
  });
}

function generateContextualResponse(
  message: string,
  pflegegrad?: number | null,
  modules?: string[],
  context?: AvatarChatRequest['context']
): string {
  let response = 'Ich verstehe Ihre Frage. ';
  
  if (pflegegrad) {
    response += `Bei Pflegegrad ${pflegegrad} stehen Ihnen spezifische Leistungen zu. `;
  }
  
  if (modules && modules.length > 0) {
    response += `Ich sehe, Sie interessieren sich für: ${modules.join(', ')}. `;
  }
  
  response += 'Kann ich Ihnen bei einem bestimmten Thema genauer helfen? Ich beherrsche die Bereiche Pflegegrad, Leistungen, Widersprüche und Antragsstellung.';
  
  return response;
}

function generateSuggestions(pflegegrad?: number | null, modules?: string[]): string[] {
  const suggestions: string[] = [];
  
  if (!pflegegrad) {
    suggestions.push('Pflegegrad ermitteln');
  }
  
  suggestions.push('Leistungen anzeigen', 'Antrag ausfüllen');
  
  if (modules?.includes('widerspruch')) {
    suggestions.push('Widerspruch erstellen');
  }
  
  return suggestions.slice(0, 3);
}

function getCorsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };
}
