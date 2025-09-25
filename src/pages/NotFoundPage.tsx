import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
const GlitchText = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative inline-block ${className}`}>
    <span className="relative z-10">{children}</span>
    <span className="absolute top-0 left-0 z-0 text-cyan opacity-80 mix-blend-screen" aria-hidden="true" style={{ textShadow: '-2px 0 #FF00FF' }}>{children}</span>
    <span className="absolute top-0 left-0 z-0 text-magenta opacity-80 mix-blend-screen" aria-hidden="true" style={{ textShadow: '2px 0 #00FFFF' }}>{children}</span>
  </div>
);
export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 text-center">
      <GlitchText className="text-9xl font-black tracking-widest">404</GlitchText>
      <h1 className="text-3xl md:text-4xl font-semibold text-cyan-400 mt-4">SIGNAL LOST</h1>
      <p className="text-lg text-gray-400 mt-2 max-w-md">
        You've wandered off the network. The page you're looking for might have been moved, deleted, or never existed.
      </p>
      <Button asChild variant="outline" className="mt-8 text-lg px-8 py-6 border-2 border-yellow-300 text-yellow-300 hover:bg-yellow-300 hover:text-black transition-all duration-300">
        <Link to="/">RETURN TO BASE</Link>
      </Button>
    </div>
  );
}