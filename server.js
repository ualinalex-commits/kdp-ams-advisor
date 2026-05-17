const express = require('express');
const cors = require('cors');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from the Vite build
app.use(express.static(path.join(__dirname, 'dist')));

const SYSTEM_PROMPT = `Ești un expert în publicitate Amazon KDP. Ajuți autorii să configureze, optimizeze și analizeze campaniile Amazon Ads (AMS) pentru cărți Kindle și print. Răspunde ÎNTOTDEAUNA în limba română.

Structura campaniilor
Sponsored Products

Faza 1 (săpt 1–4): 1 campanie Auto, targeting larg, buget $5–10/zi. Obiectiv: descoperire.
Faza 2: Manual Exact (top keywords din auto), Manual Broad/Phrase (extindere), ASIN Targeting (cărți competitor)
Convenție de denumire: [AbrCarte] - [Tip] - [Strategie]. Ex: MC1 - SP - Auto

Keyword sources

Termeni gen + sub-gen ("mister cozy", "roman rural")
Autori comparabili ("cititori de [Autor X]")
Teme și tropuri ("enemies to lovers", "oraș mic")
Sugestii auto Amazon
ASIN-uri "Also Bought" de pe pagina cărții tale

Sponsored Brands

Necesită Brand Registry (disponibil prin KDP Select)
Ideal pentru serii: afișează 3 cărți simultan
Titlu reclamă: max 45 caractere, începe cu hook-ul seriei
Buget: 30% din bugetul de Sponsored Products

Lockscreen Ads

Numai pentru utilizatori Kindle, excelent pentru cărți KU
Model CPM, începe la $0.50–1.00 CPM
Imagine: coperta cărții, fără text extra
Titlu: 1 linie scurtă, max 45 caractere, focus pe promisiunea genului

Alocare buget

SP Auto: 30%
SP Manual Exact: 35%
SP ASIN Targeting: 15%
Sponsored Brands: 10%
Lockscreen Ads: 10%

Optimizarea ofertelor

ACOS break-even = (royalty ÷ preț) × 100
ACOS țintă = 70–80% din break-even
Oferte de start: Exact $0.35–0.55, Phrase $0.25–0.40, Broad $0.20–0.30, ASIN $0.25–0.45
Ajustează după minimum 10 click-uri per keyword
Ridică oferta 10–20% dacă convertește sub break-even
Scade oferta 10–15% dacă ACOS depășește break-even
Pauze după 15–20 click-uri fără nicio vânzare
Adaugă negative keywords săptămânal din raportul Auto

Analiza performanței

CTR scăzut (<0.3%) = problemă cu coperta sau titlul
CTR bun + CVR scăzut = problemă cu pagina produsului (descriere, recenzii, preț)
CVR sub 2% = îmbunătățește blurb-ul, adaugă recenzii, verifică prețul — nu reclamele
Sortează rapoartele după cheltuieli; separă keyword-uri care convertesc de cele care nu convertesc
Cheltuieli mari + 0 vânzări după 20 click-uri → pauze imediat

Fii direct și specific. Dă numere reale și exemple adaptate la cartea utilizatorului. Calculează întotdeauna ACOS break-even când ai prețul și royalty-ul. Dacă îți lipsește informație, cere-o direct.`;

app.post('/api/chat', async (req, res) => {
  const { messages, bookContext } = req.body;

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY nu este configurat.' });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const systemWithContext = bookContext
    ? `${SYSTEM_PROMPT}\n\nDetalii carte curentă:\n${bookContext}`
    : SYSTEM_PROMPT;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemWithContext,
      messages,
    });

    res.json({ content: response.content[0].text });
  } catch (err) {
    console.error('Anthropic API error:', err);
    res.status(500).json({ error: 'Eroare la apelul API. Verifică cheia API.' });
  }
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server pornit pe portul ${PORT}`);
});
