import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Hexagon, ShieldCheck } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Brand, OrbitArt } from '../components';
import { useApp } from '../store/useApp';

function WarpCanvas({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current, ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return;
    let raf = 0, width = innerWidth, height = innerHeight; let start = performance.now(); let hiddenAt = 0;
    const stars = Array.from({ length: 350 }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() + .05 }));
    const resize = () => { width = innerWidth; height = innerHeight; const dpr = Math.min(devicePixelRatio || 1, 2); canvas.width = width * dpr; canvas.height = height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      const seconds = (now - start) / 1000; const speed = seconds > .8 && seconds < 2.3 ? .016 + (seconds - .8) * .017 : .002;
      const scale = Math.min(width, height) * .3;
      stars.forEach(star => {
        const before = star.z; if (!reduced) star.z -= speed;
        if (star.z <= .025) star.z = 1;
        const x = width / 2 + star.x * scale / star.z; const y = height / 2 + star.y * scale / star.z;
        ctx.strokeStyle = `rgba(207,233,172,${Math.min(.7, 1 - star.z)})`; ctx.lineWidth = .6;
        ctx.beginPath(); ctx.moveTo(width / 2 + star.x * scale / before, height / 2 + star.y * scale / before); ctx.lineTo(x + 1, y + 1); ctx.stroke();
      });
      if (!reduced && !document.hidden) raf = requestAnimationFrame(draw);
    };
    const visibility = () => { cancelAnimationFrame(raf); if (document.hidden) hiddenAt = performance.now(); else { start += performance.now() - hiddenAt; raf = requestAnimationFrame(draw); } };
    resize(); draw(performance.now()); window.addEventListener('resize', resize); document.addEventListener('visibilitychange', visibility);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', visibility); };
  }, [reduced]);
  return <canvas ref={ref} className="launch-stars" aria-hidden="true" />;
}

export function StudioLaunch() {
  const nav = useNavigate(); const { boxId = '214' } = useParams(); const reduced = Boolean(useReducedMotion());
  const box = useApp(s => s.boxes.find(b => b.id === boxId)); const user = useApp(s => s.currentUser)!; const users = useApp(s => s.users);
  const join = useApp(s => s.joinBox); const [phase, setPhase] = useState(0); const finished = useRef(false);
  const finish = () => { if (finished.current) return; finished.current = true; join(boxId); nav(`/box/${boxId}`, { replace: true }); };
  useEffect(() => {
    finished.current = false;
    const times = reduced ? [0] : [850, 2200, 3600, 4400];
    const timers = times.map((t, i) => setTimeout(() => setPhase(reduced ? 3 : i + 1), t));
    const end = setTimeout(finish, reduced ? 850 : 5200);
    return () => { timers.forEach(clearTimeout); clearTimeout(end); };
  }, [boxId, reduced]);
  const members = box?.slots.filter(s => s.filledBy && s.filledBy !== user.id).map(s => users.find(u => u.id === s.filledBy)!).filter(Boolean).slice(0, 4) || [];
  const crew = [...members, user];
  return <div className={`signature-launch launch-phase-${phase}`}><WarpCanvas reduced={reduced} /><header><Brand />{phase > 0 && !reduced && <button onClick={finish}>Skip sequence <ArrowUpRight size={15} /></button>}</header><div className="launch-intro"><span className="eyebrow">{phase >= 3 ? 'FIVE PERSPECTIVES. ONE SHARED POSSIBILITY.' : 'SOMETHING GOOD IS ABOUT TO BEGIN.'}</span><motion.h1 key={phase >= 3 ? 'complete' : 'launch'} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{phase >= 3 ? <>Your people.<br /><span>Your possibility.</span></> : <>Launching into<br /><span>{box?.name || 'your next chapter'}.</span></>}</motion.h1></div><div className="launch-assembly"><motion.div className="assembly-sculpture" animate={phase >= 4 && !reduced ? { scale: 2.8, opacity: 0 } : { scale: phase >= 3 ? 1.1 : 1, opacity: .8 }} transition={{ duration: .7 }}><OrbitArt /></motion.div>{crew.map((u, i) => <motion.div key={`${u.id}-${i}`} className={`assembly-person assembly-person-${i}`} initial={reduced ? false : { opacity: 0, scale: .3, y: i % 2 ? -160 : 160 }} animate={{ opacity: reduced || phase >= (i === crew.length - 1 ? 3 : 2) ? 1 : 0, scale: 1, y: 0 }} transition={{ delay: reduced ? 0 : i * .1, type: 'spring', damping: 21 }}><Avatar user={u} size="lg" /><span>{u.id === user.id ? 'You' : u.name.split(' ')[0]}</span><small>{u.role}</small></motion.div>)}{phase >= 3 && <motion.div className="assembly-shockwave" initial={{ scale: .4, opacity: .7 }} animate={{ scale: reduced ? 1 : 2.1, opacity: 0 }} transition={{ duration: 1 }} />}</div><div className="launch-status"><span><Hexagon size={14} />{phase >= 3 ? 'CREW COMPLETE / ALL SEATS ALIGNED' : phase >= 2 ? 'ASSEMBLING YOUR CREW' : phase >= 1 ? 'FINDING YOUR SHARED ORBIT' : 'IGNITION / PREPARING YOUR NEXT CHAPTER'}</span><div><motion.i initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: reduced ? .8 : 5.2, ease: 'linear' }} /></div><small><ShieldCheck size={12} />Your profile never left this device.</small></div></div>;
}
