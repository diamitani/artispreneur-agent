// Artispreneur Dashboard — Shared Components
// Sidebar, TopNav, common UI primitives

const COLORS = {
  crimson: '#CC0000',
  crimsonDark: '#A30000',
  gold: '#FED001',
  goldLight: '#FEE55E',
  black: '#111111',
  charcoal: '#1A1A1A',
  gray: '#444444',
  muted: '#777777',
  border: '#EEEEEE',
  surface: '#F5F5F5',
  white: '#FFFFFF',
};

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'business', label: 'Business Center', icon: 'briefcase' },
  { id: 'brand', label: 'Brand Center', icon: 'palette' },
  { id: 'booking', label: 'Booking Center', icon: 'calendar' },
  { id: 'academy', label: 'Academy', icon: 'graduation-cap' },
  { id: 'profile', label: 'Profile', icon: 'user' },
];

function Icon({ name, size = 16, color = 'currentColor' }) {
  const icons = {
    home: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
    briefcase: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2',
    palette: 'M12 2a10 10 0 100 20c1.1 0 2-.9 2-2v-.5c0-.3.2-.5.5-.5H17a3 3 0 000-6h-1.4A10 10 0 0012 2z',
    calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z',
    'graduation-cap': 'M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5',
    user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z',
    bell: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',
    search: 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35',
    settings: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
    'chevron-right': 'M9 18l6-6-6-6',
    'arrow-right': 'M5 12h14M12 5l7 7-7 7',
    check: 'M20 6L9 17l-5-5',
    'check-circle': 'M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3',
    clock: 'M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2',
    'file-text': 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
    'plus-circle': 'M12 22a10 10 0 100-20 10 10 0 000 20z M12 8v8 M8 12h8',
    'music': 'M9 18V5l12-2v13 M6 21a3 3 0 100-6 3 3 0 000 6z M18 19a3 3 0 100-6 3 3 0 000 6z',
    'trending-up': 'M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6',
    'dollar-sign': 'M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
    'book-open': 'M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z',
    'zap': 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    'x': 'M18 6L6 18 M6 6l12 12',
    'menu': 'M3 12h18 M3 6h18 M3 18h18',
    'external-link': 'M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6 M15 3h6v6 M10 14L21 3',
  };
  const d = icons[name] || icons['zap'];
  return React.createElement('svg', {
    width: size, height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.75,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    style: { flexShrink: 0 }
  },
    ...d.split(' M').map((seg, i) =>
      React.createElement('path', { key: i, d: (i === 0 ? seg : 'M' + seg) })
    )
  );
}

function Sidebar({ activeId, onNavigate }) {
  const sidebarStyles = {
    sidebar: { width: 220, background: '#111111', height: '100%', display: 'flex', flexDirection: 'column', flexShrink: 0 },
    logo: { padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 },
    logoImg: { width: 32, height: 32 },
    logoText: { fontFamily: "'Libre Baskerville', serif", fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' },
    nav: { flex: 1, padding: '12px 10px', overflowY: 'auto' },
    item: { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 6, cursor: 'pointer', marginBottom: 2, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.5)', transition: '150ms ease' },
    itemActive: { background: 'rgba(204,0,0,0.25)', color: '#fff' },
    footer: { padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.08)' },
    footerItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)' },
    section: { fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', padding: '12px 12px 4px' },
  };

  return React.createElement('div', { style: sidebarStyles.sidebar },
    React.createElement('div', { style: sidebarStyles.logo },
      React.createElement('img', { src: '../assets/logo.png', alt: 'A', style: sidebarStyles.logoImg }),
      React.createElement('span', { style: sidebarStyles.logoText }, 'Artispreneur')
    ),
    React.createElement('nav', { style: sidebarStyles.nav },
      React.createElement('div', { style: sidebarStyles.section }, 'Workspace'),
      NAV_ITEMS.map(item =>
        React.createElement('div', {
          key: item.id,
          style: { ...sidebarStyles.item, ...(activeId === item.id ? sidebarStyles.itemActive : {}) },
          onClick: () => onNavigate(item.id),
          onMouseEnter: e => { if (activeId !== item.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; } },
          onMouseLeave: e => { if (activeId !== item.id) { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; } },
        },
          React.createElement(Icon, { name: item.icon, size: 16, color: activeId === item.id ? '#fff' : 'rgba(255,255,255,0.45)' }),
          item.label
        )
      )
    ),
    React.createElement('div', { style: sidebarStyles.footer },
      React.createElement('div', { style: sidebarStyles.footerItem },
        React.createElement(Icon, { name: 'settings', size: 14, color: 'rgba(255,255,255,0.4)' }),
        'Settings'
      )
    )
  );
}

function TopBar({ title, subtitle }) {
  return React.createElement('div', {
    style: { height: 60, background: '#fff', borderBottom: '1px solid #EEEEEE', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', flexShrink: 0 }
  },
    React.createElement('div', null,
      React.createElement('div', { style: { fontFamily: "'Libre Baskerville', serif", fontSize: 18, fontWeight: 700, color: '#111', lineHeight: 1.2 } }, title),
      subtitle && React.createElement('div', { style: { fontSize: 12, color: '#777', marginTop: 1 } }, subtitle)
    ),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, background: '#F5F5F5', borderRadius: 6, padding: '7px 12px', cursor: 'pointer' } },
        React.createElement(Icon, { name: 'search', size: 14, color: '#777' }),
        React.createElement('span', { style: { fontSize: 13, color: '#aaa', userSelect: 'none' } }, 'Search...')
      ),
      React.createElement('div', { style: { width: 34, height: 34, borderRadius: '50%', background: '#CC0000', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' } },
        React.createElement('span', { style: { color: '#fff', fontWeight: 700, fontSize: 13 } }, 'JZ')
      )
    )
  );
}

function Badge({ children, variant = 'default' }) {
  const variants = {
    default: { background: '#F5F5F5', color: '#444' },
    gold: { background: '#FEE55E', color: '#7A5C00' },
    red: { background: '#FEE3E3', color: '#CC0000' },
    green: { background: '#D1FAE5', color: '#065F46' },
    dark: { background: '#111', color: '#fff' },
  };
  const v = variants[variant] || variants.default;
  return React.createElement('span', {
    style: { display: 'inline-flex', alignItems: 'center', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, letterSpacing: '0.03em', ...v }
  }, children);
}

function Btn({ children, variant = 'primary', onClick, style = {} }) {
  const base = { display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'Inter', sans-serif", fontWeight: 600, borderRadius: 6, border: 'none', cursor: 'pointer', padding: '9px 18px', fontSize: 13, transition: '150ms ease', ...style };
  const variants = {
    primary: { background: '#CC0000', color: '#fff' },
    secondary: { background: '#FED001', color: '#111' },
    ghost: { background: 'transparent', color: '#444', border: '1px solid #EEEEEE' },
  };
  return React.createElement('button', { style: { ...base, ...variants[variant] }, onClick }, children);
}

Object.assign(window, { Icon, Sidebar, TopBar, Badge, Btn, NAV_ITEMS, COLORS });
