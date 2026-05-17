# 📚 KDP AMS Advisor

**Expert în publicitate Amazon pentru autori români**

O aplicație web care te ajută să configurezi, optimizezi și analizezi campaniile Amazon Ads (AMS) pentru cărțile tale Kindle și print.

---

## Ce face această aplicație

KDP AMS Advisor este un asistent AI specializat care:

- **Planifică structura campaniilor** — Auto, Manual Exact, Broad/Phrase, ASIN Targeting, Sponsored Brands, Lockscreen Ads
- **Calculează ACOS break-even** automat pe baza prețului și royalty-ului tău
- **Recomandă oferte de start** personalizate pentru fiecare tip de campanie
- **Sugerează strategii de cuvinte cheie** adaptate genului cărții tale
- **Explică cum să aloci bugetul** între tipurile de campanii

---

## Cum se folosește

1. **Completează detaliile cărții** în panoul din stânga:
   - Titlul și genul (obligatorii)
   - ASIN Kindle, prețul, rata royalty
   - Dacă ești înscrisă în Kindle Unlimited
   - Bugetul lunar pentru publicitate
   - Cititorul țintă și ACOS-ul curent (opțional)

2. **Apasă „Salvează detaliile cărții"**

3. **Folosește butoanele de întrebări rapide** sau scrie direct în câmpul de chat

4. Asistentul va răspunde **întotdeauna în română**, cu recomandări concrete și numere reale

---

## Stack tehnic

- **Frontend:** React + Vite
- **Backend:** Express.js (proxy securizat pentru API Anthropic)
- **AI:** Claude (claude-sonnet-4-20250514)
- **Deployment:** Render

---

## Instalare locală

```bash
# Clonează repo-ul
git clone https://github.com/YOUR_USERNAME/kdp-ams-advisor.git
cd kdp-ams-advisor

# Instalează dependențele
npm install

# Creează fișierul .env
echo "ANTHROPIC_API_KEY=your_key_here" > .env

# Pornește serverul de dezvoltare
npm run dev
```

Aplicația va fi disponibilă la `http://localhost:5173` (frontend) și `http://localhost:3001` (backend).

---

## Variabile de mediu necesare

| Variabilă | Descriere |
|-----------|-----------|
| `ANTHROPIC_API_KEY` | Cheia API Anthropic (obținută de pe console.anthropic.com) |

---

## Deployment pe Render

1. Creează un cont pe [render.com](https://render.com)
2. Conectează repo-ul GitHub
3. Render detectează automat `render.yaml` și configurează serviciul
4. Adaugă variabila de mediu `ANTHROPIC_API_KEY` din dashboard
5. Deploy automat la fiecare push pe `main`
