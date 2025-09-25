import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlusSquare, HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AudioPlayer } from './AudioPlayer';
const GlitchText = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("relative inline-block", className)}>
    <span className="relative z-10">{children}</span>
    <span className="absolute top-0 left-0 z-0 text-cyan opacity-80 mix-blend-screen" aria-hidden="true" style={{ textShadow: '-1px 0 #FF00FF' }}>{children}</span>
    <span className="absolute top-0 left-0 z-0 text-magenta opacity-80 mix-blend-screen" aria-hidden="true" style={{ textShadow: '1px 0 #00FFFF' }}>{children}</span>
  </div>
);
const SidebarNavLink = ({ to, icon, children }: { to: string, icon: React.ReactNode, children: React.ReactNode }) => (
  <NavLink
    to={to}
    end={to === "/"}
    className={({ isActive }) =>
      cn(
        "flex items-center space-x-4 p-3 text-lg transition-colors duration-200 hover:bg-cyan/10 hover:text-cyan",
        isActive ? "text-cyan border-r-4 border-cyan bg-cyan/10" : "text-gray-300"
      )
    }
  >
    {icon}
    <span>{children}</span>
  </NavLink>
);
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <aside className="fixed top-0 left-0 h-full w-64 bg-black/50 border-r border-cyan/20 flex flex-col z-20">
          <div className="p-6 border-b border-cyan/20">
            <NavLink to="/" className="text-3xl font-bold tracking-widest hover:animate-glitch">
              <GlitchText>ECHOWAVE</GlitchText>
            </NavLink>
          </div>
          <nav className="flex-grow mt-8 space-y-4">
            <SidebarNavLink to="/" icon={<Home className="h-6 w-6" />}>Dashboard</SidebarNavLink>
            <SidebarNavLink to="/create-channel" icon={<PlusSquare className="h-6 w-6" />}>Create Channel</SidebarNavLink>
          </nav>
          <div className="p-3">
            <div className="border-t border-cyan/20 pt-4">
              <h2 className="px-3 mb-2 text-lg font-semibold tracking-tight text-yellow-300/80">
                Admin
              </h2>
              <div className="space-y-1">
                <SidebarNavLink to="/health-check" icon={<HeartPulse className="h-6 w-6" />}>Health Check</SidebarNavLink>
              </div>
            </div>
          </div>
          <footer className="p-6 text-center text-gray-500 text-sm">
            <p>Built with <span className="text-magenta">❤</span> at Cloudflare</p>
          </footer>
        </aside>
        <main className="ml-64 w-[calc(100%-16rem)] p-4 sm:p-6 lg:p-8 mb-24">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <AudioPlayer />
    </div>
  );
}