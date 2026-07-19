// Dashboard — Chat Workspace (shared sidebar + chat UI)
function ChatWorkspace({ title, placeholder = 'Ask your AI manager anything...' }) {
  const [messages, setMessages] = React.useState([
    { role: 'assistant', text: `Hi! I'm your ${title} AI manager. Art means business — let's get to work. What do you need today?` }
  ]);
  const [input, setInput] = React.useState('');

  function send() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(m => [...m, { role: 'user', text: userMsg }]);
    setInput('');
    setTimeout(() => {
      setMessages(m => [...m, { role: 'assistant', text: `Great question about "${userMsg}". I'm analyzing your profile to give you a customized recommendation. Give me a moment...` }]);
    }, 800);
  }

  return React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', background: '#F5F5F5' } },
    // Messages
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 } },
      messages.map((msg, i) =>
        React.createElement('div', {
          key: i,
          style: { display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 10, alignItems: 'flex-end' }
        },
          msg.role === 'assistant' && React.createElement('div', {
            style: { width: 28, height: 28, borderRadius: '50%', background: '#CC0000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: 2 }
          }, React.createElement('img', { src: '../assets/logo.png', style: { width: 18, height: 18 } })),
          React.createElement('div', {
            style: {
              maxWidth: '70%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
              background: msg.role === 'user' ? '#CC0000' : '#fff',
              color: msg.role === 'user' ? '#fff' : '#111',
              fontSize: 13, lineHeight: 1.6,
              boxShadow: '0 1px 3px rgba(0,0,0,0.07)'
            }
          }, msg.text)
        )
      )
    ),
    // Input
    React.createElement('div', { style: { padding: '16px 24px', background: '#fff', borderTop: '1px solid #eee' } },
      React.createElement('div', { style: { display: 'flex', gap: 10, alignItems: 'center', background: '#F5F5F5', borderRadius: 8, padding: '8px 12px' } },
        React.createElement('input', {
          type: 'text',
          placeholder,
          value: input,
          onChange: e => setInput(e.target.value),
          onKeyDown: e => e.key === 'Enter' && send(),
          style: { flex: 1, border: 'none', background: 'transparent', fontSize: 14, color: '#111', outline: 'none', fontFamily: "'Inter', sans-serif" }
        }),
        React.createElement('button', {
          onClick: send,
          style: { background: '#CC0000', border: 'none', borderRadius: 6, padding: '6px 14px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }
        }, 'Send')
      )
    )
  );
}

Object.assign(window, { ChatWorkspace });
