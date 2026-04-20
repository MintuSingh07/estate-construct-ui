import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const LiquidMaskSection = () => {
  const containerRef = useRef(null);
  const maskRef = useRef(null);
  const turbulenceRef = useRef(null);
  const displacementRef = useRef(null);

  const images = {
    base: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=2000",
    reveal: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000"
  };

  useGSAP(() => {
    if (!containerRef.current || !maskRef.current) return;

    // Use a proxy object for smooth mouse tracking
    const mouse = { x: -100, y: -100 };
    const xTo = gsap.quickTo(mouse, "x", { duration: 1, ease: "power4.out" });
    const yTo = gsap.quickTo(mouse, "y", { duration: 1, ease: "power4.out" });
    
    // Water physics tracking
    const physics = { 
      slosh: 60,
      freq: 0.012
    };
    const sloshTo = gsap.quickTo(physics, "slosh", { duration: 1.5, ease: "elastic.out(1, 0.3)" });
    const freqTo = gsap.quickTo(physics, "freq", { duration: 1, ease: "sine.inOut" });

    // Sync the proxy values to the SVG attributes every frame
    const onTick = () => {
      if (maskRef.current) {
        maskRef.current.setAttribute('cx', mouse.x.toString());
        maskRef.current.setAttribute('cy', mouse.y.toString());
      }
      if (displacementRef.current) {
        displacementRef.current.setAttribute('scale', physics.slosh.toString());
      }
      if (turbulenceRef.current) {
        // Modulating frequency creates "flow" rather than "seed-jumping"
        turbulenceRef.current.setAttribute('baseFrequency', physics.freq.toString());
      }
    };

    gsap.ticker.add(onTick);

    let lastMouseX = 0;
    let lastMouseY = 0;

    const handleMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update proxy positions
      xTo(x);
      yTo(y);

      // Velocity calculation for dynamic slosh (water weight)
      const dx = x - lastMouseX;
      const dy = y - lastMouseY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      
      // Dynamic water behavior
      sloshTo(Math.min(130, 60 + speed * 1.5));
      freqTo(0.012 + (speed * 0.0003));

      lastMouseX = x;
      lastMouseY = y;
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);

    // Interaction feedback for enter/leave
    const onEnter = () => {
      gsap.to(maskRef.current, { attr: { r: 300 }, duration: 1.2, ease: "power4.out" });
      gsap.to(".liquid-instructions", { opacity: 0, y: -20, duration: 0.5 });
    };

    const onLeave = () => {
      gsap.to(maskRef.current, { attr: { r: 0 }, duration: 0.8, ease: "power4.in" });
      gsap.to(".liquid-instructions", { opacity: 1, y: 0, duration: 0.8 });
    };

    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);

    // Subtle idle "breathing" water effect
    gsap.to(physics, {
      freq: 0.015,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
      gsap.ticker.remove(onTick);
    };
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#050505] cursor-none"
    >
      {/* Base Layer */}
      <div 
        className="absolute inset-0 grayscale opacity-40 scale-105 blur-[2px]"
        style={{ backgroundImage: `url(${images.base})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      {/* Reveal Layer with SVG Mask */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: `url(${images.reveal})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          maskImage: 'url(#refined-liquid-mask)',
          WebkitMaskImage: 'url(#refined-liquid-mask)'
        }}
      />

      {/* SVG Asset Definitions */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="super-liquid-filter" x="-50%" y="-50%" width="200%" height="200%">
            {/* Liquid displacement */}
            <feTurbulence 
              ref={turbulenceRef}
              type="fractalNoise" 
              baseFrequency="0.015" 
              numOctaves="3" 
              result="noise" 
            />
            <feDisplacementMap 
              ref={displacementRef}
              in="SourceGraphic" 
              in2="noise" 
              scale="70" 
              xChannelSelector="R" 
              yChannelSelector="G" 
              result="distorted"
            />
            
            {/* Gooey / Metaball processing */}
            <feGaussianBlur in="distorted" stdDeviation="12" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -12" 
              result="goo" 
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>

          <mask id="refined-liquid-mask" maskUnits="userSpaceOnUse">
            <circle 
              ref={maskRef}
              cx="-100" 
              cy="-100" 
              r="0" 
              fill="white" 
              filter="url(#super-liquid-filter)"
            />
          </mask>
        </defs>
      </svg>

      {/* HUD & Overlay elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none text-center liquid-instructions">
        <span className="technical-monoscope text-[10px] text-white/40 tracking-[0.6em] uppercase animate-pulse">
           Move cursor to simulate <br /> architectural realization
        </span>
      </div>

      <div className="absolute top-12 left-12 z-20 pointer-events-none">
        <span className="technical-monoscope text-[10px] text-amber-500/60 tracking-[0.4em] uppercase">Phase: Construction &rarr; Vision</span>
      </div>

      <div className="absolute bottom-16 right-12 z-20 pointer-events-none text-right">
        <h2 className="title-serif text-[clamp(2.5rem,5vw,6rem)] leading-none italic mb-4">
          Unveiling <br />
          <span className="premium-text-gradient">Realities.</span>
        </h2>
        <p className="technical-monoscope text-xs text-white/30 max-w-xs ml-auto leading-relaxed">
          Proprietary GSAP-driven liquid reveal system. High fidelity simulation without WebGL overhead.
        </p>
      </div>
    </section>
  );
};

export default LiquidMaskSection;
