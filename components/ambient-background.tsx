'use client';

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Top Left Violet Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/15 blur-[120px] orb-float-base" />
      
      {/* Center Right Fuchsia Glow */}
      <div className="absolute top-[20%] right-[-15%] w-[40vw] h-[60vw] rounded-full bg-fuchsia-600/10 blur-[130px] orb-float-delayed" />
      
      {/* Bottom Center Deep Purple Glow */}
      <div 
        className="absolute bottom-[-20%] left-[10%] w-[60vw] h-[50vw] rounded-full bg-purple-700/15 blur-[140px] orb-float-base" 
        style={{ animationDelay: '4s' }} 
      />
    </div>
  );
}
