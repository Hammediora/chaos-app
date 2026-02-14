'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { href: '/daily', label: 'Daily', icon: DailyIcon },
  { href: '/excuses', label: 'Excuses', icon: ExcuseIcon },
  { href: '/roast', label: 'Roast', icon: RoastIcon },
  { href: '/memes', label: 'Memes', icon: MemeIcon },
  { href: '/facts', label: 'Facts', icon: FactIcon },
  { href: '/vault', label: 'Vault', icon: VaultIcon },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col bg-surface border-r border-walnut z-50" aria-label="Main navigation">
        <div className="p-6 border-b border-walnut">
          <Link href="/daily" className="block">
            <h1 className="heading-display text-2xl text-brass">ChaosHub</h1>
            <p className="text-xs text-mocha mt-1 tracking-wider uppercase">Curated Chaos Since 2026</p>
          </Link>
        </div>
        <nav className="flex-1 py-4 px-3">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                      transition-colors duration-150
                      ${isActive
                        ? 'bg-brass/10 text-brass border border-brass/20'
                        : 'text-linen hover:bg-surface-overlay hover:text-parchment border border-transparent'
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon active={isActive} />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-brass"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-walnut">
          <p className="text-[10px] text-mocha leading-relaxed">
            Content may be offensive. Use responsibly. Not affiliated with any API providers.
          </p>
        </div>
      </aside>

      {/* ── Mobile Bottom Tab Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-walnut z-50 safe-area-bottom" aria-label="Main navigation">
        <ul className="flex justify-around items-center h-16 px-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg
                    transition-colors duration-150 min-w-[3rem]
                    ${isActive ? 'text-brass' : 'text-mocha hover:text-linen'}
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon active={isActive} />
                  <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brass rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Mobile Header ── */}
      <header className="md:hidden sticky top-0 bg-surface/95 backdrop-blur-md border-b border-walnut z-40 px-4 py-3">
        <Link href="/daily">
          <h1 className="heading-display text-lg text-brass">ChaosHub</h1>
        </Link>
      </header>
    </>
  );
}

/* ═══════════════════════════════════════════
   Nav Icons — Custom SVG for retro feel
   ═══════════════════════════════════════════ */

function DailyIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function ExcuseIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function RoastIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c.5 2 2 4 2 6a4 4 0 1 1-4 0c0-2 1.5-4 2-6z" />
      <path d="M12 22v-4" />
    </svg>
  );
}

function MemeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <circle cx="15" cy="10" r="1.5" />
      <path d="M8 15c1.5 2 6.5 2 8 0" />
    </svg>
  );
}

function FactIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
    </svg>
  );
}

function VaultIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}
