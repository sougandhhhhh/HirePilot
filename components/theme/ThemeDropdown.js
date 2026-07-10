'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';

const THEME_OPTIONS = [
  {
    id: 'light',
    icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
    title: 'Light',
    desc: 'Bright and airy',
  },
  {
    id: 'dark',
    icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
    title: 'Dark',
    desc: 'Easy on the eyes',
  },
  {
    id: 'system',
    icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><path d="M8 21h8M12 17v4"/></svg>,
    title: 'System',
    desc: 'Follows your OS',
  },
];

const spring = { type: 'spring', stiffness: 400, damping: 30 };

const menuVariants = {
  hidden: { opacity: 0, scale: 0.92, y: -8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 30, staggerChildren: 0.04 } },
  exit: { opacity: 0, scale: 0.92, y: -8, transition: { duration: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
};

export default function ThemeDropdown() {
  const { theme, setTheme, resolved } = useTheme();
  const [open, setOpen] = useState(false);
  const [ripples, setRipples] = useState([]);
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && btnRef.current && !btnRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
    setOpen(!open);
  };

  const currentIcon = THEME_OPTIONS.find((o) => o.id === theme)?.icon || THEME_OPTIONS[1].icon;
  const resolvedIcon = THEME_OPTIONS.find((o) => o.id === resolved)?.icon || THEME_OPTIONS[1].icon;

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleClick}
        className="theme-trigger"
        aria-label={`Theme: ${theme}. Click to change.`}
        aria-haspopup="true"
        aria-expanded={open}
        title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
      >
        <motion.span
          key={resolved}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={spring}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {resolvedIcon}
        </motion.span>
        {ripples.map((r) => (
          <span key={r.id} className="ripple" style={{ left: r.x, top: r.y }} />
        ))}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            role="menu"
            aria-label="Theme selection"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="theme-dropdown"
          >
            <div className="theme-dropdown-header">
              <span className="theme-dropdown-title">Appearance</span>
              <span className="theme-dropdown-subtitle">Choose your theme</span>
            </div>
            {THEME_OPTIONS.map((opt) => {
              const active = theme === opt.id;
              return (
                <motion.button
                  key={opt.id}
                  role="menuitemradio"
                  aria-checked={active}
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setTheme(opt.id); setOpen(false); }}
                  className={`theme-option${active ? ' active' : ''}`}
                >
                  <motion.span
                    className="theme-option-icon"
                    animate={active ? { scale: 1.1, rotate: [0, 5, -5, 0] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {opt.icon}
                  </motion.span>
                  <div className="theme-option-text">
                    <span className="theme-option-title">{opt.title}</span>
                    <span className="theme-option-desc">{opt.desc}</span>
                  </div>
                  {active && (
                    <motion.span
                      layoutId="theme-check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={spring}
                      className="theme-check"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}