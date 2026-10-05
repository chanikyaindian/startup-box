import React, { useEffect, useId, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, Bell, Bot, Check, ChevronRight, Compass, Hexagon, Home, Plus, Settings, ShieldCheck, Sparkles, UserRound, Users, X, Zap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Role, User } from './types';
import { useApp } from './store/useApp';

export const roleColor = (role: Role | string) => ({ PM: '#B0A0F8', Developer: '#7CA9EF', Designer: '#F598B1', Marketing: '#ECCC8C' }[role] || '#C6EE9C');

export function StarfieldBackground({ dense = false }: { dense?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const node = canvas.current;
    const ctx = node?.getContext('2d');
    if (!node || !ctx) return;
    let raf = 0;
    let width = 0;
    let height = 0;
    const stars = Array.from({ length: dense ? 120 : 50 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.1 + .2 }));
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      width = innerWidth; height = innerHeight;
      node.width = width * dpr; node.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach(s => {
        if (!reduced) s.y = (s.y + .000018) % 1;
        ctx.fillStyle = `rgba(217,225,203,${.15 + s.r / 5})`;
        ctx.beginPath(); ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2); ctx.fill();
      });
      if (!reduced && !document.hidden) raf = requestAnimationFrame(draw);
    };
    const visibility = () => { cancelAnimationFrame(raf); if (!document.hidden) draw(); };
    resize(); draw();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', visibility);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', visibility); };
  }, [dense, reduced]);
  return <canvas aria-hidden="true" className={`starfield ${dense ? 'starfield-dense' : ''}`} ref={canvas} />;
}

/** Original vector sculpture: five interlocking rings, one shared centre. */
export function OrbitArt({ variant = 'lime', className = '' }: { variant?: 'lime' | 'lavender' | 'coral'; className?: string }) {
  const id = useId().replace(/:/g, '');
  const colors = { lime: ['#DEFF9E', '#637B3F'], lavender: ['#C9BAFF', '#514077'], coral: ['#FFCCB3', '#94555D'] }[variant];
  return <svg viewBox="0 0 500 500" className={`orbit-art ${className}`} aria-hidden="true">
    <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop stopColor={colors[0]} /><stop offset=".45" stopColor={colors[1]} /><stop offset=".65" stopColor={colors[0]} /><stop offset="1" stopColor={colors[1]} /></linearGradient></defs>
    <g fill="none" stroke={`url(#${id})`} strokeWidth="19">
      {[0, 36, 72, 108, 144].map((angle, i) => <ellipse key={angle} cx="250" cy="250" rx="177" ry="62" transform={`rotate(${angle} 250 250)`} opacity={1 - i * .035} />)}
    </g>
    <g fill="none" stroke={colors[0]} strokeWidth=".6" opacity=".5"><circle cx="250" cy="250" r="218" strokeDasharray="2 10" /><path d="M250 12V46M250 454V488M12 250H46M454 250H488" /></g>
    <circle cx="250" cy="250" r="11" fill={colors[0]} />
  </svg>;
}
export function Brand({ small = false }: { small?: boolean }) { return <Link to="/home" className={`brand ${small ? 'small' : ''}`} aria-label="Startup Box home"><span className="brand-mark"><Hexagon size={22} strokeWidth={2.4} /><span /></span><span>startupbox<span className="brand-period">.</span></span></Link>; }
export function OnDeviceBadge() { return <span className="device-badge"><i />Running on this device</span>; }
export function Button({ children, variant = 'primary', className = '', ...props }: { children: React.ReactNode; variant?: 'primary' | 'ghost' | 'soft' | 'danger'; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) { return <button className={`btn btn-${variant} ${className}`} {...props}>{children}</button>; }
export function Card({ children, className = '', ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) { return <section className={`card ${className}`} {...props}>{children}</section>; }
export function Chip({ children, active = false, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) { return <button aria-pressed={active} className={`chip ${active ? 'chip-active' : ''}`} onClick={onClick}>{children}</button>; }
export function Avatar({ user, size = 'md' }: { user: Pick<User, 'name' | 'avatarColor' | 'role'>; size?: 'sm' | 'md' | 'lg' }) { return <div className={`avatar avatar-${size}`} style={{ '--avatar': roleColor(user.role) } as React.CSSProperties} aria-label={user.name}><span>{user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span></div>; }
export function LevelBadge({ level }: { level: string }) { return <span className={`level level-${level.toLowerCase()}`}>{level}</span>; }
export function XPBar({ user }: { user: User }) { const next = [100, 250, 500, 900, 1500].find(x => x > user.xp) || 1500; const prev = [...[0, 100, 250, 500, 900]].reverse().find(x => x <= user.xp) || 0; return <div className="xp-wrap"><div className="xp-label"><span><Zap size={13} /> {user.xp} XP</span><b>{Math.max(0, next - user.xp)} to next rank</b></div><div className="xp-track"><div style={{ width: `${Math.min(100, ((user.xp - prev) / (next - prev)) * 100)}%` }} /></div></div>; }
export function ProgressRing({ value, size = 72, label = '' }: { value: number; size?: number; label?: string }) { return <div className="ring" style={{ '--value': `${value * 3.6}deg`, '--size': `${size}px` } as React.CSSProperties} aria-label={`${label || 'Score'} ${value}`}><strong>{value}</strong>{label && <small>{label}</small>}</div>; }
export function SlotTile({ role, filledBy, users }: { role: Role; filledBy?: string; users: User[] }) { const user = users.find(u => u.id === filledBy); return <div className={`slot-tile ${user ? 'slot-filled' : ''}`}>{user ? <><Avatar user={user} size="sm" /><span>{user.name.split(' ')[0]}</span></> : <><Plus size={15} /><span>{role} open</span></>}</div>; }
export function BoxCard({ box, users, onClick }: { box: Box; users: User[]; onClick?: () => void }) {
  const filled = box.slots.filter(s => s.filledBy).length;
  const variant = box.type === 'Hackathon' ? 'coral' : box.type === 'Agency' || box.level === 'Founder' ? 'lavender' : 'lime';
  const body = <><div className={`box-cover cover-${variant}`}><span className="box-coordinate">SB / {box.id}</span><OrbitArt variant={variant} /><span className="cover-status"><i />{box.status === 'Open' ? 'Recruiting crew' : box.status}</span><ArrowUpRight className="cover-arrow" size={23} /></div><div className="box-body"><div className="box-card-top"><span className="eyebrow">{box.type}</span><LevelBadge level={box.level} /></div><h3>{box.name}</h3><p className="muted">{box.idea}</p><div className="box-crew">{box.slots.filter(s => s.filledBy).slice(0, 4).map((s, i) => { const u = users.find(u => u.id === s.filledBy); return u ? <Avatar key={`${s.filledBy}-${i}`} user={u} size="sm" /> : null; })}<span>{filled}/{box.slots.length} seats filled</span></div><div className="box-card-foot"><span><Users size={14} /> {box.slots.length - filled} open seats</span><span className="fit"><ArrowDownLeft size={14} /> {box.health}% momentum</span></div></div></>;
  return onClick ? <button className="box-card" onClick={onClick} aria-label={`Preview ${box.name}`}>{body}</button> : <Link className="box-card" to="/explore">{body}</Link>;
}
const navigation = [{ to: '/home', label: 'Mission control', short: 'Home', Icon: Home }, { to: '/explore', label: 'Discover boxes', short: 'Explore', Icon: Compass }, { to: '/box/', label: 'My crew', short: 'My Box', Icon: Hexagon }, { to: '/profile', label: 'Your passport', short: 'Profile', Icon: UserRound }];
export function BottomNav() { const loc = useLocation(); const boxId = useApp(s => s.currentBoxId); return <nav className="bottom-nav" aria-label="Mobile navigation">{navigation.map(({ to, short, Icon }) => { const href = to === '/box/' ? `/box/${boxId}` : to; return <Link key={to} aria-current={loc.pathname.startsWith(to) ? 'page' : undefined} className={loc.pathname.startsWith(to) ? 'nav-active' : ''} to={href}><Icon size={21} />{short}</Link>; })}</nav>; }
function Sidebar() {
  const loc = useLocation(); const user = useApp(s => s.currentUser); const boxId = useApp(s => s.currentBoxId);
  return <aside className="sidebar"><Brand /><span className="sidebar-label">YOUR FLIGHT DECK</span><nav aria-label="Main navigation">{navigation.map(({ to, label, Icon }, i) => <Link key={to} to={to === '/box/' ? `/box/${boxId}` : to} aria-current={loc.pathname.startsWith(to) ? 'page' : undefined} className={loc.pathname.startsWith(to) ? 'active' : ''}><Icon size={19} /><span>{label}</span><small>0{i + 1}</small></Link>)}</nav><div className="sidebar-note"><div className="note-symbol">✳</div><h3>Good things happen<br />with the right people.</h3><p>One crew. One small bet.<br />Fourteen days to find out.</p><Link to="/explore">Find your people <ArrowUpRight size={16} /></Link></div><div className="sidebar-footer"><Link to="/settings"><Settings size={17} /> Settings</Link><div className="privacy-mini"><ShieldCheck size={14} /> Local by design</div>{user && <Link to="/profile" className="sidebar-user"><Avatar user={user} size="sm" /><span><b>{user.name}</b><small>{user.level} / {user.xp} XP</small></span><ChevronRight size={15} /></Link>}</div></aside>;
}
export function AppHeader({ title, action }: { title?: string; action?: React.ReactNode }) { return <header className="app-header"><div className="mobile-brand"><Brand small /></div><div className="header-breadcrumb"><span>YOUR WORKSPACE</span><i>/</i><strong>{title || 'Mission control'}</strong></div><div className="header-actions"><span className="header-local"><i />ALL SYSTEMS LOCAL</span>{action || <Link to="/settings" aria-label="Open settings" className="icon-btn"><Settings size={18} /></Link>}</div></header>; }
export function Shell({ children, title, action }: { children: React.ReactNode; title?: string; action?: React.ReactNode }) {
  const loc = useLocation(); const reduced = useReducedMotion();
  const type = loc.pathname.split('/')[1];
  return <div className="app-shell"><StarfieldBackground /><Sidebar /><div className="workspace"><AppHeader title={title} action={action} /><motion.main key={loc.pathname} initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }} className={`page page-${type}`}>{children}</motion.main><footer className="workspace-footer"><span>STARTUP BOX / BUILT FOR PEOPLE WHO BUILD</span><span>LET'S MAKE SOMETHING MATTER. <ArrowUpRight size={12} /></span></footer></div><BottomNav /></div>;
}
export function Toast({ message, onClose }: { message: string; onClose: () => void }) { return <AnimatePresence><motion.div role="status" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="toast"><Check size={18} /><span>{message}</span><button aria-label="Dismiss notification" onClick={onClose}><X size={16} /></button></motion.div></AnimatePresence>; }
export function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) { return <div className="section-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2></div>{action}</div>; }
export function UserRow({ user, onClick }: { user: User; onClick?: () => void }) { return <button className="user-row" onClick={onClick}><Avatar user={user} /><span><b>{user.name}</b><small>{user.role} · {user.reputation} rep</small></span><ChevronRight size={16} /></button>; }
export function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null); const reduced = useReducedMotion();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; ref.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const items = ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input,select,textarea,[tabindex="0"]');
        if (!items?.length) return;
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('keydown', key); document.body.style.overflow = previousOverflow; previous?.focus(); };
  }, [onClose]);
  return <div className="modal-backdrop" onClick={onClose}><motion.div role="dialog" aria-modal="true" aria-label="Crew details" tabIndex={-1} ref={ref} initial={{ y: reduced ? 0 : 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="modal" onClick={e => e.stopPropagation()}><button aria-label="Close dialog" className="modal-close" onClick={onClose}><X size={18} /></button>{children}</motion.div></div>;
}
export function EmptyState({ icon = <Bot size={30} />, title, body, children }: { icon?: React.ReactNode; title: string; body: string; children?: React.ReactNode }) { return <div className="empty-state">{icon}<h3>{title}</h3><p>{body}</p>{children}</div>; }
