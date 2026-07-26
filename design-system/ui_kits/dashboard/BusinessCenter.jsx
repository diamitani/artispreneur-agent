// Dashboard — Business Center Screen
function BusinessCenter() {
  const [activeTab, setActiveTab] = React.useState('overview');

  const services = [
    { id: 'ein', icon: 'file-text', title: 'EIN Registration', desc: 'Get your Employer Identification Number', status: 'action', badge: 'Start' },
    { id: 'llc', icon: 'briefcase', title: 'Form an LLC', desc: 'Create your own record label entity', status: 'pending', badge: 'Pending' },
    { id: 'ccorp', icon: 'briefcase', title: 'Form a C-Corp', desc: 'Incorporate for investor-ready structure', status: 'pending', badge: 'Pending' },
    { id: 'bank', icon: 'dollar-sign', title: 'Business Bank Account', desc: 'Get paid professionally via Mercury', status: 'pending', badge: 'Pending' },
    { id: 'pro', icon: 'music', title: 'P.R.O. Registration', desc: 'Register with ASCAP, BMI or SoundExchange', status: 'pending', badge: 'Pending' },
    { id: 'dsp', icon: 'trending-up', title: 'DSP Platforms', desc: 'Distribute to Spotify, Apple Music & more', status: 'pending', badge: 'Pending' },
    { id: 'copyright', icon: 'check-circle', title: 'Copyright Registration', desc: 'Protect your original works', status: 'pending', badge: 'Pending' },
    { id: 'catalogue', icon: 'book-open', title: 'Music Catalogue', desc: 'Master your track registry & royalties', status: 'pending', badge: 'Pending' },
  ];

  const tabs = ['overview', 'documents', 'tasks'];

  const statusStyle = {
    action: { bg: '#FEE3E3', color: '#CC0000', label: 'Action Required' },
    pending: { bg: '#F5F5F5', color: '#444', label: 'Not Started' },
    complete: { bg: '#D1FAE5', color: '#065F46', label: 'Complete' },
  };

  return React.createElement('div', { style: { padding: '28px', overflowY: 'auto', flex: 1, background: '#F5F5F5' } },
    // Header
    React.createElement('div', { style: { marginBottom: 24 } },
      React.createElement('div', { style: { fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#CC0000', marginBottom: 4 } }, 'Workspace'),
      React.createElement('div', { style: { fontFamily: "'Libre Baskerville', serif", fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 4 } }, 'Business Center'),
      React.createElement('div', { style: { fontSize: 13, color: '#777' } }, 'Legal formation, financial operations, and publishing administration.')
    ),

    // Tabs
    React.createElement('div', { style: { display: 'flex', gap: 0, borderBottom: '2px solid #eee', marginBottom: 20 } },
      tabs.map(tab =>
        React.createElement('div', {
          key: tab,
          style: { padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', borderBottom: `2px solid ${activeTab === tab ? '#CC0000' : 'transparent'}`, marginBottom: -2, color: activeTab === tab ? '#CC0000' : '#777', textTransform: 'capitalize', transition: '150ms ease' },
          onClick: () => setActiveTab(tab)
        }, tab)
      )
    ),

    // Services Grid
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 } },
      services.map(svc =>
        React.createElement('div', {
          key: svc.id,
          style: { background: '#fff', borderRadius: 8, padding: '18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', cursor: 'pointer', transition: '150ms ease', border: svc.status === 'action' ? '1.5px solid #CC0000' : '1.5px solid transparent' },
          onMouseEnter: e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; },
          onMouseLeave: e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = ''; }
        },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 } },
            React.createElement('div', { style: { width: 36, height: 36, borderRadius: 8, background: svc.status === 'action' ? '#FEE3E3' : '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
              React.createElement(Icon, { name: svc.icon, size: 18, color: svc.status === 'action' ? '#CC0000' : '#777' })
            ),
            React.createElement('span', {
              style: { fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: statusStyle[svc.status].bg, color: statusStyle[svc.status].color }
            }, svc.badge)
          ),
          React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 4 } }, svc.title),
          React.createElement('div', { style: { fontSize: 11, color: '#777', lineHeight: 1.5 } }, svc.desc),
          React.createElement('div', { style: { marginTop: 12, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: svc.status === 'action' ? '#CC0000' : '#aaa' } },
            svc.status === 'action' ? 'Get Started' : 'View Details',
            React.createElement(Icon, { name: 'chevron-right', size: 12, color: svc.status === 'action' ? '#CC0000' : '#aaa' })
          )
        )
      )
    )
  );
}

Object.assign(window, { BusinessCenter });
