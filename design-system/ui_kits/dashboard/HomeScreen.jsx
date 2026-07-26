// Dashboard — Home Screen
function HomeScreen() {
  const tasks = [
    { id: 1, label: 'Complete Artist Onboarding', status: 'in-progress', priority: 'high' },
    { id: 2, label: 'Register EIN', status: 'pending', priority: 'high' },
    { id: 3, label: 'Set up Business Bank Account', status: 'pending', priority: 'medium' },
    { id: 4, label: 'Register with a P.R.O.', status: 'pending', priority: 'medium' },
    { id: 5, label: 'Upload music catalogue', status: 'pending', priority: 'low' },
  ];

  const quickLinks = [
    { label: 'Business Center', icon: 'briefcase', id: 'business', desc: 'Legal, finance & publishing' },
    { label: 'Brand Center', icon: 'palette', id: 'brand', desc: 'Social, press kits & design' },
    { label: 'Booking Center', icon: 'calendar', id: 'booking', desc: 'CRM, outreach & directory' },
    { label: 'Academy', icon: 'book-open', id: 'academy', desc: 'Courses & resources' },
  ];

  const outputs = [
    { label: 'Artist Business Plan Draft', date: 'Apr 18, 2026', type: 'Document' },
    { label: 'EIN Application Summary', date: 'Apr 17, 2026', type: 'Document' },
    { label: 'Social Media Strategy', date: 'Apr 15, 2026', type: 'Strategy' },
  ];

  const statusColors = {
    'in-progress': { bg: '#EFF6FF', text: '#1D4ED8', label: 'In Progress' },
    'pending': { bg: '#F5F5F5', text: '#444', label: 'Pending' },
    'complete': { bg: '#D1FAE5', text: '#065F46', label: 'Complete' },
  };

  const priorityColors = {
    'high': '#CC0000',
    'medium': '#D97706',
    'low': '#777',
  };

  return React.createElement('div', { style: { padding: '28px', overflowY: 'auto', flex: 1, background: '#F5F5F5' } },
    // Welcome banner
    React.createElement('div', {
      style: { background: '#111', borderRadius: 10, padding: '24px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', position: 'relative' }
    },
      React.createElement('div', { style: { position: 'absolute', right: -20, top: -20, width: 180, height: 180, borderRadius: '50%', background: 'rgba(204,0,0,0.15)' } }),
      React.createElement('div', { style: { position: 'absolute', right: 60, bottom: -40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(254,208,1,0.08)' } }),
      React.createElement('div', { style: { position: 'relative' } },
        React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#FED001', marginBottom: 6 } }, 'Welcome back'),
        React.createElement('div', { style: { fontFamily: "'Libre Baskerville', serif", fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 6 } }, 'Jay-Z\'s Dashboard'),
        React.createElement('div', { style: { fontSize: 13, color: 'rgba(255,255,255,0.55)' } }, 'Art Means Business. You have 2 tasks awaiting action.')
      ),
      React.createElement(Btn, { variant: 'secondary', style: { position: 'relative' } },
        React.createElement(Icon, { name: 'zap', size: 14, color: '#111' }),
        'Continue Onboarding'
      )
    ),

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 } },
      // Quick Links
      React.createElement('div', { style: { background: '#fff', borderRadius: 8, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' } },
        React.createElement('div', { style: { fontFamily: "'Libre Baskerville', serif", fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 14 } }, 'Quick Links'),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 } },
          quickLinks.map(ql =>
            React.createElement('div', {
              key: ql.id,
              style: { border: '1px solid #eee', borderRadius: 8, padding: '12px', cursor: 'pointer', transition: '150ms ease' },
              onMouseEnter: e => { e.currentTarget.style.borderColor = '#CC0000'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(204,0,0,0.08)'; },
              onMouseLeave: e => { e.currentTarget.style.borderColor = '#eee'; e.currentTarget.style.boxShadow = ''; }
            },
              React.createElement('div', { style: { width: 32, height: 32, borderRadius: 6, background: '#FEE55E', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 } },
                React.createElement(Icon, { name: ql.icon, size: 16, color: '#7A5C00' })
              ),
              React.createElement('div', { style: { fontSize: 12, fontWeight: 700, color: '#111', marginBottom: 2 } }, ql.label),
              React.createElement('div', { style: { fontSize: 11, color: '#777' } }, ql.desc)
            )
          )
        )
      ),

      // Recent Outputs
      React.createElement('div', { style: { background: '#fff', borderRadius: 8, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 } },
          React.createElement('div', { style: { fontFamily: "'Libre Baskerville', serif", fontSize: 15, fontWeight: 700, color: '#111' } }, 'Recent Outputs'),
          React.createElement('span', { style: { fontSize: 11, color: '#CC0000', fontWeight: 600, cursor: 'pointer' } }, 'View all')
        ),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
          outputs.map((o, i) =>
            React.createElement('div', {
              key: i,
              style: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < outputs.length - 1 ? '1px solid #eee' : 'none' }
            },
              React.createElement('div', { style: { width: 32, height: 32, borderRadius: 6, background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } },
                React.createElement(Icon, { name: 'file-text', size: 15, color: '#777' })
              ),
              React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                React.createElement('div', { style: { fontSize: 12, fontWeight: 600, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, o.label),
                React.createElement('div', { style: { fontSize: 10, color: '#aaa' } }, o.date)
              ),
              React.createElement(Badge, { variant: 'default' }, o.type)
            )
          )
        )
      )
    ),

    // Tasks / Roadmap
    React.createElement('div', { style: { background: '#fff', borderRadius: 8, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 } },
        React.createElement('div', { style: { fontFamily: "'Libre Baskerville', serif", fontSize: 15, fontWeight: 700, color: '#111' } }, 'Your Roadmap'),
        React.createElement(Badge, { variant: 'red' }, '2 Action Required')
      ),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 0 } },
        tasks.map((t, i) =>
          React.createElement('div', {
            key: t.id,
            style: { display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: i < tasks.length - 1 ? '1px solid #F5F5F5' : 'none' }
          },
            React.createElement('div', {
              style: { width: 18, height: 18, borderRadius: '50%', border: t.status === 'complete' ? '2px solid #1A7F4B' : '2px solid #DDD', background: t.status === 'complete' ? '#1A7F4B' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }
            },
              t.status === 'complete' && React.createElement(Icon, { name: 'check', size: 10, color: '#fff' })
            ),
            React.createElement('div', { style: { flex: 1, fontSize: 13, fontWeight: 500, color: t.status === 'complete' ? '#aaa' : '#111', textDecoration: t.status === 'complete' ? 'line-through' : 'none' } }, t.label),
            React.createElement('div', { style: { width: 6, height: 6, borderRadius: '50%', background: priorityColors[t.priority], flexShrink: 0 } }),
            React.createElement('div', {
              style: { fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: statusColors[t.status].bg, color: statusColors[t.status].text }
            }, statusColors[t.status].label),
            React.createElement(Icon, { name: 'chevron-right', size: 14, color: '#ccc' })
          )
        )
      )
    )
  );
}

Object.assign(window, { HomeScreen });
