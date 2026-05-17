import { useState, useRef, useEffect, useCallback } from 'react';

const QUICK_QUESTIONS = [
  'Configurează structura completă de campanii',
  'Recomandă oferte de start pentru fiecare tip',
  'Calculează ACOS-ul meu de break-even',
  'Strategie de cuvinte cheie pentru genul meu',
  'Cum să împart bugetul între campanii',
];

const EMPTY_FORM = {
  title: '',
  genre: '',
  asin: '',
  price: '',
  royalty: '70',
  ku: 'Nu',
  budget: '',
  audience: '',
  acos: '',
};

function buildBookContext(book) {
  const lines = [
    `Titlu: ${book.title}`,
    `Gen/sub-gen: ${book.genre}`,
    book.asin ? `ASIN Kindle: ${book.asin}` : null,
    book.price ? `Preț ebook: $${book.price}` : null,
    `Rata royalty: ${book.royalty}%`,
    `Înscrisă în Kindle Unlimited: ${book.ku}`,
    book.budget ? `Buget lunar publicitate: $${book.budget}` : null,
    book.audience ? `Cititor țintă: ${book.audience}` : null,
    book.acos ? `ACOS curent: ${book.acos}%` : null,
  ];
  return lines.filter(Boolean).join('\n');
}

function BookForm({ initial, onSave }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Câmp obligatoriu';
    if (!form.genre.trim()) e.genre = 'Câmp obligatoriu';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    onSave(form);
  };

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label>Titlul cărții <span className="req">*</span></label>
        <input value={form.title} onChange={set('title')} placeholder="ex. Misterul din Brașov" />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>
      <div className="form-group">
        <label>Gen / Sub-gen <span className="req">*</span></label>
        <input value={form.genre} onChange={set('genre')} placeholder="ex. Mister Cozy, Romance Rural" />
        {errors.genre && <span className="form-error">{errors.genre}</span>}
      </div>
      <div className="form-group">
        <label>ASIN (Kindle)</label>
        <input value={form.asin} onChange={set('asin')} placeholder="ex. B0XXXXXXX" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Preț ebook ($)</label>
          <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} placeholder="4.99" />
        </div>
        <div className="form-group">
          <label>Rata royalty</label>
          <select value={form.royalty} onChange={set('royalty')}>
            <option value="35">35%</option>
            <option value="70">70%</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Kindle Unlimited?</label>
          <select value={form.ku} onChange={set('ku')}>
            <option value="Da">Da</option>
            <option value="Nu">Nu</option>
          </select>
        </div>
        <div className="form-group">
          <label>Buget lunar ($)</label>
          <input type="number" min="0" step="1" value={form.budget} onChange={set('budget')} placeholder="150" />
        </div>
      </div>
      <div className="form-group">
        <label>Cititorul țintă</label>
        <input value={form.audience} onChange={set('audience')} placeholder="ex. femei 30–55 ani, iubitori de mistere" />
      </div>
      <div className="form-group">
        <label>ACOS curent % (dacă rulezi deja reclame)</label>
        <input type="number" min="0" step="0.1" value={form.acos} onChange={set('acos')} placeholder="ex. 45" />
      </div>
      <button type="submit" className="btn-primary btn-full">
        Salvează detaliile cărții
      </button>
    </form>
  );
}

function BookCard({ book, onEdit }) {
  const royaltyValue = parseFloat(book.price) * (parseFloat(book.royalty) / 100);
  const breakEven = book.price ? ((royaltyValue / parseFloat(book.price)) * 100).toFixed(1) : null;

  return (
    <div className="book-card">
      <div className="book-card-header">
        <div>
          <h3 className="book-title">{book.title}</h3>
          <p className="book-genre">{book.genre}</p>
        </div>
        <button className="btn-edit" onClick={onEdit}>Editează</button>
      </div>
      <div className="book-stats">
        {book.price && (
          <div className="stat">
            <span className="stat-label">Preț</span>
            <span className="stat-value">${book.price}</span>
          </div>
        )}
        <div className="stat">
          <span className="stat-label">Royalty</span>
          <span className="stat-value">{book.royalty}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">KU</span>
          <span className="stat-value">{book.ku}</span>
        </div>
        {book.budget && (
          <div className="stat">
            <span className="stat-label">Buget/lună</span>
            <span className="stat-value">${book.budget}</span>
          </div>
        )}
        {breakEven && book.price && (
          <div className="stat stat-accent">
            <span className="stat-label">Break-even ACOS</span>
            <span className="stat-value">{book.royalty}%</span>
          </div>
        )}
        {book.acos && (
          <div className="stat">
            <span className="stat-label">ACOS curent</span>
            <span className="stat-value">{book.acos}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatMessage({ role, content }) {
  return (
    <div className={`message message-${role}`}>
      <div className="message-bubble">
        {content.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < content.split('\n').length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [book, setBook] = useState(null);
  const [editing, setEditing] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSaveBook = (formData) => {
    setBook(formData);
    setEditing(false);
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: `Bun venit! Am salvat detaliile pentru „${formData.title}". Poți folosi butoanele de mai jos sau scrie direct întrebarea ta. Cum te pot ajuta?`,
        },
      ]);
    }
  };

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return;
    setError(null);

    const userMsg = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const apiMessages = newMessages.map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          bookContext: book ? buildBookContext(book) : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Eroare necunoscută');

      setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, book]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">📚</span>
            <span className="logo-text">KDP <strong>AMS Advisor</strong></span>
          </div>
          <span className="header-tagline">Expert în publicitate Amazon pentru autori</span>
        </div>
      </header>

      <main className="app-body">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <h2 className="sidebar-title">
              {editing ? 'Detalii carte' : 'Cartea ta'}
            </h2>

            {editing ? (
              <BookForm initial={book} onSave={handleSaveBook} />
            ) : (
              <>
                <BookCard book={book} onEdit={() => setEditing(true)} />

                <div className="quick-questions">
                  <h3 className="quick-title">Întrebări rapide</h3>
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      className="btn-quick"
                      onClick={() => sendMessage(q)}
                      disabled={loading}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </aside>

        {/* CHAT */}
        <section className="chat-panel">
          {messages.length === 0 && !editing && (
            <div className="chat-empty">
              <p>👋 Bun venit! Salvează detaliile cărții pentru a începe.</p>
            </div>
          )}
          {messages.length === 0 && editing && (
            <div className="chat-empty">
              <div className="chat-empty-icon">💡</div>
              <h2>Completează detaliile cărții tale</h2>
              <p>Introdu informațiile din sidebar pentru a primi recomandări personalizate despre campaniile Amazon Ads.</p>
            </div>
          )}

          <div className="messages-list">
            {messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} />
            ))}
            {loading && (
              <div className="message message-assistant">
                <div className="message-bubble thinking">
                  <span className="dot" /><span className="dot" /><span className="dot" />
                  <span className="thinking-text">Se gândește…</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="chat-error">
              ⚠️ {error}
            </div>
          )}

          <div className="chat-input-area">
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={book ? 'Scrie întrebarea ta… (Enter pentru trimite, Shift+Enter pentru rând nou)' : 'Salvează detaliile cărții pentru a putea conversa'}
              rows={2}
              disabled={!book || loading}
            />
            <button
              className="btn-send"
              onClick={() => sendMessage(input)}
              disabled={!book || loading || !input.trim()}
            >
              Trimite
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
