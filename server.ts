import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { getFallbackScenariosForTopic } from './src/data/scenarioFallbacks';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Google Gen AI Client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

/**
 * Generate programmatic SVG fallback when API key is unconfigured or rate limited
 * Ensures UI remains functional, responsive, and visually appealing at all times.
 */
function generateFallbackMnemonicSvg(concept: string, category?: string): string {
  const escapedConcept = concept.replace(/[<>&"]/g, '');
  const cat = (category || 'Cybersecurity Concept').replace(/[<>&"]/g, '');
  
  // Choose accent colors based on hash of concept
  const colors = [
    ['#10b981', '#064e3b', '#34d399'], // emerald
    ['#06b6d4', '#164e63', '#22d3ee'], // cyan
    ['#8b5cf6', '#4c1d95', '#a78bfa'], // purple
    ['#f59e0b', '#78350f', '#fbbf24'], // amber
    ['#ec4899', '#831843', '#f472b6'], // pink
  ];
  let hash = 0;
  for (let i = 0; i < concept.length; i++) hash = (hash << 5) - hash + concept.charCodeAt(i);
  const [accent, bgDark, accentLight] = colors[Math.abs(hash) % colors.length];

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#020617"/>
        <stop offset="50%" stop-color="${bgDark}"/>
        <stop offset="100%" stop-color="#090d16"/>
      </linearGradient>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${accent}"/>
        <stop offset="100%" stop-color="${accentLight}"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="15" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
      </pattern>
    </defs>

    <!-- Background -->
    <rect width="600" height="600" rx="24" fill="url(#bgGrad)"/>
    <rect width="600" height="600" rx="24" fill="url(#grid)"/>

    <!-- Orbital Energy Rings -->
    <circle cx="300" cy="270" r="180" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="8 8" opacity="0.4"/>
    <circle cx="300" cy="270" r="130" fill="none" stroke="${accentLight}" stroke-width="2" stroke-dasharray="14 10" opacity="0.6"/>
    <circle cx="300" cy="270" r="85" fill="${accent}" opacity="0.1" filter="url(#glow)"/>

    <!-- Central Mnemonic Badge Icon -->
    <g transform="translate(300, 270) scale(1.1)">
      <!-- Hexagonal Shield -->
      <polygon points="0,-70 60,-35 60,35 0,70 -60,35 -60,-35" fill="none" stroke="url(#shieldGrad)" stroke-width="4" filter="url(#glow)"/>
      <polygon points="0,-56 48,-28 48,28 0,56 -48,28 -48,-28" fill="#0f172a" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
      
      <!-- Binary & Keynodes Motif -->
      <circle cx="0" cy="0" r="18" fill="url(#shieldGrad)"/>
      <line x1="-36" y1="-20" x2="-14" y2="-8" stroke="${accentLight}" stroke-width="2"/>
      <line x1="36" y1="-20" x2="14" y2="-8" stroke="${accentLight}" stroke-width="2"/>
      <line x1="0" y1="20" x2="0" y2="44" stroke="${accentLight}" stroke-width="2"/>
      <circle cx="-36" cy="-20" r="5" fill="#ffffff"/>
      <circle cx="36" cy="-20" r="5" fill="#ffffff"/>
      <circle cx="0" cy="44" r="5" fill="#ffffff"/>
    </g>

    <!-- Category Pill -->
    <g transform="translate(300, 430)">
      <rect x="-140" y="-16" width="280" height="32" rx="16" fill="rgba(15, 23, 42, 0.85)" stroke="${accent}" stroke-width="1.5"/>
      <text x="0" y="5" fill="${accentLight}" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" letter-spacing="1.5" text-anchor="middle">
        ${cat.toUpperCase()}
      </text>
    </g>

    <!-- Concept Heading -->
    <text x="300" y="495" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="800" text-anchor="middle">
      ${escapedConcept.slice(0, 36)}${escapedConcept.length > 36 ? '...' : ''}
    </text>

    <!-- Mnemonic Visual Indicator -->
    <text x="300" y="525" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="12" text-anchor="middle">
      Visual Cognitive Anchor • CEH Exam Blueprint
    </text>
  </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Endpoint: POST /api/generate-mnemonic-image
 * Uses Imagen (imagen-3.0-generate-002) or gemini-3.1-flash-lite-image
 * to generate mnemonic visual aids for complex security concepts.
 */
app.post('/api/generate-mnemonic-image', async (req, res) => {
  try {
    const { concept, category, question, answer } = req.body;

    if (!concept || typeof concept !== 'string' || !concept.trim()) {
      return res.status(400).json({ error: 'Concept text is required to generate a mnemonic visual aid.' });
    }

    const trimmedConcept = concept.trim();
    const domainCat = category || 'Cybersecurity / CEH';
    
    // Construct rich, evocative prompt specifically designed for memory retention
    const mnemonicPrompt = [
      `A striking, vivid mnemonic educational visual aid illustrating the cybersecurity concept: "${trimmedConcept}".`,
      `Context: ${domainCat}. Question focus: "${question || trimmedConcept}". Key mechanism: "${answer || trimmedConcept}".`,
      `Style: High-contrast digital art, educational conceptual diagram, isometric or 3D technological metaphor on a dark cybernetic slate background.`,
      `Emphasize memorable visual symbolism (e.g. locks, shields, packet streams, disguised trojans, digital keys, or firewall citadels).`,
      `Visually distinct, clean composition, no garbled text.`
    ].join(' ');

    const ai = getAIClient();

    if (!ai) {
      // Return high-quality SVG mnemonic visual if GEMINI_API_KEY is not configured
      const fallbackUrl = generateFallbackMnemonicSvg(trimmedConcept, domainCat);
      return res.json({
        success: true,
        imageUrl: fallbackUrl,
        prompt: mnemonicPrompt,
        model: 'mnemonic-vector-generator',
        isSimulated: true,
        note: 'Generated high-contrast cognitive vector anchor (connect GEMINI_API_KEY for Imagen generative raster).'
      });
    }

    // Try Imagen model: imagen-3.0-generate-002
    try {
      const imagenResponse = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: mnemonicPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1'
        }
      });

      const generatedImage = imagenResponse.generatedImages?.[0]?.image?.imageBytes;
      if (generatedImage) {
        return res.json({
          success: true,
          imageUrl: `data:image/jpeg;base64,${generatedImage}`,
          prompt: mnemonicPrompt,
          model: 'imagen-3.0-generate-002'
        });
      }
    } catch (imagenErr) {
      console.warn('Imagen 3.0 generation attempt:', (imagenErr as Error).message);
      
      // Fallback to gemini-3.1-flash-lite-image
      try {
        const flashImageResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [{ text: mnemonicPrompt }]
          },
          config: {
            imageConfig: {
              aspectRatio: '1:1'
            }
          }
        });

        const parts = flashImageResponse.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            return res.json({
              success: true,
              imageUrl: `data:${mime};base64,${part.inlineData.data}`,
              prompt: mnemonicPrompt,
              model: 'gemini-3.1-flash-lite-image'
            });
          }
        }
      } catch (flashErr) {
        console.warn('Gemini flash-lite-image fallback attempt:', (flashErr as Error).message);
      }
    }

    // If both models threw or were quota-limited, provide the vector visual aid
    const fallbackUrl = generateFallbackMnemonicSvg(trimmedConcept, domainCat);
    return res.json({
      success: true,
      imageUrl: fallbackUrl,
      prompt: mnemonicPrompt,
      model: 'mnemonic-vector-fallback',
      isSimulated: true,
      note: 'Rendered visual mnemonic diagram (AI generation model was temporarily unavailable).'
    });

  } catch (error) {
    console.error('Mnemonic image generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate visual aid',
      details: (error as Error).message
    });
  }
});

/**
 * Endpoint: POST /api/generate-scenario-questions
 * Uses Gemini (gemini-3.8-flash) to generate complex, scenario-based practice questions
 * tailored to the current flashcard deck's topic and concepts.
 */
app.post('/api/generate-scenario-questions', async (req, res) => {
  try {
    const { 
      domainId = 'all', 
      categoryName = 'General CEH Exam Topics', 
      count = 3, 
      difficulty = 'standard', 
      customFocus = '', 
      sampleDeckCards = [] 
    } = req.body || {};
    
    const requestedCount = Math.min(Math.max(Number(count) || 3, 1), 6);
    const ai = getAIClient();

    if (!ai) {
      // Return curated fallback questions when GEMINI_API_KEY is not configured
      const fallbacks = getFallbackScenariosForTopic(domainId, categoryName, requestedCount);
      return res.json({
        success: true,
        questions: fallbacks,
        model: 'curated-ceh-scenario-bank',
        isSimulated: true,
        topic: categoryName,
        note: 'Generated from CEH v13 vetted scenario blueprint bank (connect GEMINI_API_KEY in Settings for dynamic AI variations).'
      });
    }

    const cardsContext = Array.isArray(sampleDeckCards) && sampleDeckCards.length > 0
      ? `Recent flashcard questions in this active deck include: ${sampleDeckCards.slice(0, 5).map((c: any) => c.question || c).join(' | ')}.`
      : '';

    const prompt = `Generate exactly ${requestedCount} unique, complex, scenario-based cybersecurity examination practice questions for candidates preparing for the Certified Ethical Hacker (CEH v13) certification.

Topic / Exam Domain: "${categoryName}" (Domain ID: "${domainId}").
Difficulty Tier: ${difficulty === 'advanced' ? 'Advanced Enterprise Red Team / Multi-Stage Attack Simulation' : 'Standard CEH Practical / Scenario Exam Depth'}.
${customFocus ? `Candidate Focus Request: "${customFocus}".` : ''}
${cardsContext}

EACH QUESTION MUST ADHERE TO THESE STRICT CRITERIA:
1. "scenario": A rich, 2 to 4 sentence realistic enterprise environment, penetration testing engagement, incident response ticket, SIEM log alert, network packet capture snippet, or tool execution scenario.
2. "question": A precise, critical-thinking question requiring the candidate to analyze the scenario and select the optimal command, flag, exploit technique, forensic root cause, or remediation strategy.
3. "options": An array of exactly 4 distinct, plausible options (one unquestionably correct answer and three realistic distractors).
4. "correctIndex": An integer (0, 1, 2, or 3) representing the zero-based index of the correct option.
5. "explanation": A detailed, technical breakdown explaining WHY the chosen option is correct and why the other options are either incorrect, noisy, or insecure.
6. "keyTakeaway": A concise one-sentence core rule of thumb for the CEH exam.
7. "mitreTechnique": The relevant MITRE ATT&CK technique ID and name (e.g. "T1046: Network Service Discovery" or "T1190: Exploit Public-Facing Application").
8. "suggestedFlashcardAnswer": A concise 1-2 sentence summary of the scenario and solution, ideal for front-to-back flashcard memorization.
9. "domainId": "${domainId}".
10. "category": "${categoryName}".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a senior offensive security architect and EC-Council certified instructor creating rigorous, scenario-based exam questions for CEH v13.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              domainId: { type: Type.STRING },
              category: { type: Type.STRING },
              scenario: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              keyTakeaway: { type: Type.STRING },
              mitreTechnique: { type: Type.STRING },
              suggestedFlashcardAnswer: { type: Type.STRING }
            },
            required: ['id', 'scenario', 'question', 'options', 'correctIndex', 'explanation', 'keyTakeaway', 'suggestedFlashcardAnswer']
          }
        }
      }
    });

    let questions: any[] = [];
    try {
      const responseText = response.text || '[]';
      questions = JSON.parse(responseText);
    } catch (parseErr) {
      console.warn('Failed to parse Gemini JSON response, falling back:', parseErr);
      questions = getFallbackScenariosForTopic(domainId, categoryName, requestedCount);
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      questions = getFallbackScenariosForTopic(domainId, categoryName, requestedCount);
    } else {
      questions = questions.map((q: any, idx: number) => ({
        ...q,
        id: q.id || `gemini-sc-${Date.now()}-${idx}`,
        domainId: q.domainId || domainId,
        category: q.category || categoryName,
        difficulty: difficulty === 'advanced' ? 'Advanced Red Team' : 'Standard CEH'
      }));
    }

    return res.json({
      success: true,
      questions,
      model: 'gemini-3.8-flash',
      topic: categoryName,
      difficulty
    });
  } catch (error) {
    console.error('Scenario question generation error:', error);
    const { domainId = 'all', categoryName = 'General CEH Exam Topics', count = 3 } = req.body || {};
    const fallbackQuestions = getFallbackScenariosForTopic(domainId, categoryName, Number(count) || 3);
    return res.json({
      success: true,
      questions: fallbackQuestions,
      model: 'curated-ceh-scenario-bank',
      isSimulated: true,
      topic: categoryName,
      note: 'Returned high-yield CEH scenario bank (AI model encountered temporary error).'
    });
  }
});

// Vite Middleware for development vs Static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
