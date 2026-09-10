import { useMemo, useState } from 'react'
import { ArrowRight, Check, ChevronDown, Copy, FileText, Gauge, LayoutDashboard, MessageCircle, MoreHorizontal, Plus, Search, Send, Sparkles, Users, Zap } from 'lucide-react'
import './App.css'

const leads = [
  { name: 'Marina Costa', vehicle: 'Jeep Compass Limited', time: 'há 12 min', initials: 'MC', color: 'coral' },
  { name: 'Rafael Moura', vehicle: 'Toyota Corolla XEi', time: 'há 38 min', initials: 'RM', color: 'blue' },
  { name: 'Bianca Nunes', vehicle: 'Honda HR-V Touring', time: 'ontem', initials: 'BN', color: 'yellow' },
  { name: 'Eduardo Lima', vehicle: 'Volkswagen T-Cross', time: 'ontem', initials: 'EL', color: 'green' },
]
const tones = ['Consultivo', 'Direto', 'Descontraído']
const templates = [
  { title: 'Primeiro contato', description: 'Uma abertura leve para leads que acabaram de chegar.', tone: 'Consultivo', uses: 18 },
  { title: 'Retorno do test-drive', description: 'Continue a conversa depois que o cliente conheceu o carro.', tone: 'Direto', uses: 12 },
  { title: 'Condição especial', description: 'Apresente uma oportunidade sem deixar a mensagem agressiva.', tone: 'Descontraído', uses: 9 },
]

function App() {
  const [screen, setScreen] = useState('compor')
  const [selectedLead, setSelectedLead] = useState(leads[0])
  const [tone, setTone] = useState('Consultivo')
  const [notes, setNotes] = useState('')
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState(false)
  const message = useMemo(() => {
    const firstName = selectedLead.name.split(' ')[0]
    const intro = tone === 'Direto' ? `Oi, ${firstName}! Tudo bem?` : tone === 'Descontraído' ? `Oi, ${firstName}! Como você está?` : `Olá, ${firstName}! Espero que esteja bem.`
    const ending = tone === 'Direto' ? 'Posso separar um horário para você conhecer o carro?' : tone === 'Descontraído' ? 'Quer passar aqui para dar uma volta nele?' : 'Se fizer sentido para você, posso organizar uma visita sem compromisso.'
    return `${intro}\n\nVi que você se interessou pelo ${selectedLead.vehicle}. Ele chegou recentemente e está em excelente estado, com histórico de revisões em dia.\n\n${notes ? `Anotei também: ${notes}\n\n` : ''}${ending}\n\nAbraço,\nLucas | Auto Forja Company`
  }, [selectedLead, tone, notes])
  function copyMessage() { navigator.clipboard?.writeText(message); setCopied(true); window.setTimeout(() => setCopied(false), 1800) }
  const navigate = (nextScreen) => setScreen(nextScreen)
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><Zap size={16} fill="currentColor" /></span>auto forja</div>
      <div className="workspace"><div className="workspace-avatar">AF</div><div><strong>Auto Forja Company</strong><small>Equipe comercial</small></div><ChevronDown size={15} /></div>
      <nav><button className={`nav-item ${screen === 'compor' ? 'active' : ''}`} onClick={() => navigate('compor')}><Sparkles size={17} />Compor contato</button><button className={`nav-item ${screen === 'leads' ? 'active' : ''}`} onClick={() => navigate('leads')}><Users size={17} />Meus leads <span className="count">24</span></button><button className={`nav-item ${screen === 'templates' ? 'active' : ''}`} onClick={() => navigate('templates')}><FileText size={17} />Templates</button></nav>
      <div className="rule" /><p className="recent-label">Recentes <MoreHorizontal size={15} /></p>
      <div className="recent-list">{leads.slice(0, 3).map((lead) => <button className="recent" key={lead.name} onClick={() => { setSelectedLead(lead); navigate('compor') }}><span className={`avatar ${lead.color}`}>{lead.initials}</span><span><strong>{lead.name}</strong><small>{lead.vehicle}</small></span></button>)}</div>
      <div className="sidebar-bottom"><button className="help">? <span>Central de ajuda</span></button><div className="profile"><div className="profile-avatar">LS</div><span><strong>Lucas Silva</strong><small>Vendedor</small></span><MoreHorizontal size={16} /></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div><p className="eyebrow">AUTO FORJA COMPANY · CENTRAL DE CONTATOS</p><h1>{screen === 'compor' ? 'Compor mensagem' : screen === 'leads' ? 'Meus leads' : 'Templates'}</h1></div><div className="top-actions"><button className="icon-button" aria-label="Buscar"><Search size={18} /></button>{screen === 'leads' && <button className="outline-button" onClick={() => navigate('compor')}><Plus size={16} /> Novo contato</button>}</div></header>
      {screen === 'compor' && <div className="grid">
        <section className="composer">
          <div className="section-title"><div className="title-wrap"><span className="step">01</span><div><h2>Contexto do lead</h2><p>Escolha para quem você quer escrever.</p></div></div><button className="link-button" onClick={() => navigate('leads')}>Ver todos <ArrowRight size={14} /></button></div>
          <div className="lead-picker"><div className="search"><Search size={17} /><input placeholder="Buscar lead ou veículo" /></div><div className="lead-list">{leads.map((lead) => <button className={`lead-row ${selectedLead.name === lead.name ? 'selected' : ''}`} key={lead.name} onClick={() => { setSelectedLead(lead); setSent(false) }}><span className={`avatar ${lead.color}`}>{lead.initials}</span><span className="lead-info"><strong>{lead.name}</strong><small>{lead.vehicle}</small></span><span className="lead-time">{lead.time}</span>{selectedLead.name === lead.name && <Check size={16} className="check" />}</button>)}</div></div>
          <div className="section-title second"><div className="title-wrap"><span className="step">02</span><div><h2>Como você quer falar?</h2><p>Ajuste o jeito da mensagem ao momento.</p></div></div></div>
          <div className="tone-control">{tones.map((item) => <button className={tone === item ? 'tone-active' : ''} key={item} onClick={() => setTone(item)}>{item}</button>)}</div>
          <label className="notes"><span>Algum detalhe para incluir? <em>Opcional</em></span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Ex.: comentou que precisa de espaço para os filhos..." /></label>
          <button className="generate" onClick={() => setTone(tone)}><Sparkles size={17} />Gerar mensagem <kbd>⌘ ↵</kbd></button>
        </section>
        <section className="preview">
          <div className="preview-heading"><div><span className="preview-kicker"><Sparkles size={14} /> PRÉVIA DA MENSAGEM</span><h2>Pronta para enviar</h2></div><button className="quiet-button" aria-label="Mais opções"><MoreHorizontal size={19} /></button></div>
          <div className="message-card"><div className="message-meta"><span className={`avatar ${selectedLead.color}`}>{selectedLead.initials}</span><span><strong>{selectedLead.name}</strong><small>WhatsApp · agora</small></span><span className="status" /></div><div className="message-text">{message.split('\n').map((line, index) => line ? <p key={index}>{line}</p> : <br key={index} />)}</div><div className="message-footer"><span><Gauge size={14} /> tom {tone.toLowerCase()}</span><span>{message.length} caracteres</span></div></div>
          <div className="preview-actions"><button className="copy" onClick={copyMessage}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copiado' : 'Copiar texto'}</button><button className="send" onClick={() => setSent(true)}><Send size={16} />{sent ? 'Enviado' : 'Enviar pelo WhatsApp'}</button></div>
          <div className="channel"><MessageCircle size={17} /><span><strong>Canal recomendado</strong><small>Este lead costuma responder mais rápido pelo WhatsApp.</small></span><ArrowRight size={15} /></div>
          <div className="tip"><span className="tip-icon">✦</span><span><strong>Dica de abordagem</strong><br />Pergunte sobre o uso do carro antes de falar em valores. Isso abre espaço para entender melhor a necessidade.</span></div>
        </section>
      </div>}
      {screen === 'leads' && <LeadsScreen leads={leads} selectedLead={selectedLead} setSelectedLead={setSelectedLead} navigate={navigate} />}
      {screen === 'templates' && <TemplatesScreen navigate={navigate} setTone={setTone} />}
    </main>
    {sent && <div className="toast"><Check size={16} />Mensagem enviada para {selectedLead.name.split(' ')[0]}</div>}
  </div>
}

function LeadsScreen({ leads, selectedLead, setSelectedLead, navigate }) {
  const [query, setQuery] = useState('')
  const filteredLeads = leads.filter((lead) => `${lead.name} ${lead.vehicle}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="content-panel leads-screen"><div className="screen-intro"><div><p className="eyebrow">ACOMPANHAMENTO</p><h2>Todos os contatos da equipe</h2><p>Encontre um lead e retome a conversa no momento certo.</p></div><div className="metric"><strong>24</strong><span>leads ativos</span></div></div><div className="toolbar"><div className="search wide"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome ou veículo" /></div><button className="filter-button">Todos os leads <ChevronDown size={15} /></button></div><div className="lead-table"><div className="table-head"><span>Lead</span><span>Veículo de interesse</span><span>Último contato</span><span /></div>{filteredLeads.map((lead) => <button className={`table-row ${selectedLead.name === lead.name ? 'row-selected' : ''}`} key={lead.name} onClick={() => setSelectedLead(lead)}><span className="table-person"><span className={`avatar ${lead.color}`}>{lead.initials}</span><strong>{lead.name}</strong></span><span>{lead.vehicle}</span><span>{lead.time}</span><span><ArrowRight size={16} /></span></button>)}</div><div className="empty-note"><LayoutDashboard size={18} /><span>Selecione um lead para revisar os detalhes ou abra o compositor para criar uma nova mensagem.</span><button className="link-button" onClick={() => navigate('compor')}>Compor agora <ArrowRight size={14} /></button></div></div>
}

function TemplatesScreen({ navigate, setTone }) {
  function handleUseTemplate(template) { setTone(template.tone); navigate('compor') }
  return <div className="content-panel templates-screen"><div className="screen-intro"><div><p className="eyebrow">BIBLIOTECA DA EQUIPE</p><h2>Mensagens que já funcionam</h2><p>Comece com uma estrutura pronta e adapte ao seu lead.</p></div><button className="outline-button"><Plus size={16} /> Novo template</button></div><div className="template-grid">{templates.map((template) => <article className="template-card" key={template.title}><div className="template-icon"><FileText size={18} /></div><div className="template-card-body"><div className="template-card-top"><span className="template-tag">{template.tone}</span><span className="template-uses">{template.uses} usos</span></div><h3>{template.title}</h3><p>{template.description}</p><button className="template-action" onClick={() => handleUseTemplate(template)}>Usar template <ArrowRight size={14} /></button></div></article>)}</div></div>
}

export default App
