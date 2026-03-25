import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { TbMenu3 } from "react-icons/tb";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const container = useRef();
  const loaderRef = useRef();
  const realLogoRef = useRef();

  useGSAP(() => {
    // Get final native position of the logo
    const finalRect = realLogoRef.current.getBoundingClientRect();
    
    // We want to put the logo exactly in the center of the screen initially.
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    
    // The final center of the logo is:
    const finalCenterX = finalRect.left + finalRect.width / 2;
    const finalCenterY = finalRect.top + finalRect.height / 2;
    
    // Offset to apply to move it to the viewport center:
    const centerOffsetX = viewportCenterX - finalCenterX;
    const centerOffsetY = viewportCenterY - finalCenterY;

    // Initial reveal timeline
    const tl = gsap.timeline({ 
      defaults: { ease: 'expo.inOut' },
      onComplete: () => initBuildingScroll()
    });

    // Skip intro on first scroll/wheel
    const skipIntro = () => {
      if (tl.isActive()) {
        tl.progress(1);
        initBuildingScroll();
      }
      window.removeEventListener('wheel', skipIntro);
      window.removeEventListener('touchmove', skipIntro);
    };
    window.addEventListener('wheel', skipIntro);
    window.addEventListener('touchmove', skipIntro);

    // Initial state: perfectly centered on screen, scaled up, hidden
    gsap.set(realLogoRef.current, { 
       x: centerOffsetX, 
       y: centerOffsetY, 
       scale: 3, 
       opacity: 0 
    });

    // 1. Fade the logo in
    tl.to(realLogoRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.inOut'
    })
    // 2. Exact Logo sliding back to nav
    .to(realLogoRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: 'expo.inOut',
      force3D: true
    }) // immediate start after fade-in
    // 3. Slide the loader div up AFTER logo reaches destination
    .to(loaderRef.current, {
      yPercent: -100,
      duration: 1.6,
      ease: 'expo.inOut',
      force3D: true
    })
    .to('.nav-bg', {
      opacity: 1,
      duration: 0.8,
      ease: 'expo.inOut',
      force3D: true
    }, "<")
    .to('.hero-image', {
      y: 0,
      opacity: 1,
      duration: 2.8,
      ease: 'expo.inOut',
      force3D: true
    }, "-=2.2") // Start immediately with loader
    .from('.hero-text-block', {
      yPercent: 100,
      opacity: 0,
      duration: 2.6,
      ease: 'expo.inOut',
      force3D: true
    }, "<+=.3")
    .from('.cloud-1', {
      xPercent: -50,
      opacity: 0,
      duration: 3,
      ease: 'power2.out'
    }, "-=1.5")
    .from('.cloud-2', {
      xPercent: 50,
      opacity: 0,
      duration: 3.5,
      ease: 'power2.out'
    }, "<+=0.2")
    .from('.cloud-3', {
      xPercent: 50,
      opacity: 0,
      duration: 3.2,
      ease: 'power2.out'
    }, "<+=0.1")
    .from('.cloud-4', {
      xPercent: -50,
      opacity: 0,
      duration: 3.8,
      ease: 'power2.out'
    }, "<+=0.2");

    // Continuous floating for clouds
    gsap.to('.cloud-1', {
      y: -30,
      duration: 12,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });
    
    gsap.to('.cloud-2', {
      y: 40,
      duration: 15,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    gsap.to('.cloud-3', {
      y: -25,
      x: 20,
      duration: 14,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    gsap.to('.cloud-4', {
      y: 35,
      x: -25,
      duration: 16,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    const initBuildingScroll = () => {
      // Prevent double initialization
      if (gsap.getById('building-scroll')) return;

      gsap.to('.hero-image', {
        id: 'building-scroll',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          endTrigger: '#vision',
          end: 'bottom bottom',
          scrub: 2.2,
          immediateRender: false,
        },
        xPercent: -65,
        y: window.innerHeight,
        scale: 1.5,
        yPercent: 0,
        ease: 'power1.inOut',
      });
    };


    // Mouse movement micro-interaction
    const hero = document.querySelector('#hero');
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 30;
      const yPos = (clientY / window.innerHeight - 0.5) * 30;

      gsap.to('.hero-title', {
        x: xPos,
        y: yPos,
        duration: 1.5,
        ease: 'power2.out',
      });
    };

    hero?.addEventListener('mousemove', handleMouseMove);
    return () => hero?.removeEventListener('mousemove', handleMouseMove);

  }, { scope: container });

  return (
    <div ref={container} className="bg-[#050505] text-white overflow-hidden min-h-screen">
      {/* Loader Backdrop */}
      <div ref={loaderRef} className="loader-backdrop fixed inset-0 z-[45] bg-[#082f17] pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50">
        <div className="px-8 py-6 flex justify-between items-center w-full">
          <a href="#" ref={realLogoRef} className="text-2xl font-medium tracking-tight opacity-0">ESTATE</a>
          <button className="nav-items text-3xl hover:text-neutral-400 transition-colors">
            <TbMenu3 />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        id="hero" 
        className="relative min-h-screen flex items-center justify-center pt-20"
      >
        {/* Background Group (Clipped to Hero Height) */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <div className="absolute inset-0 w-full h-full bg-[url('/bg_mountain.png')] bg-cover bg-top scale-[1.15]"></div>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-start items-center pt-24 md:pt-32 select-none pointer-events-none z-[5]">
          <div className="overflow-hidden">
            <div className="hero-text-block uppercase tracking-tighter leading-none text-center -mt-.5">
              <div className="text-[clamp(2.5rem,6vw,5rem)] font-medium premium-text-gradient whitespace-nowrap">WE CONSTRUCT</div>
              <div className="text-[clamp(4.5rem,15vw,12rem)] font-semibold premium-text-gradient whitespace-nowrap -mt-[.1em]">YOUR VISION</div>
            </div>
          </div>
        </div>
        
        {/* Clouds */}
        <img 
          src="/cloude1.png" 
          alt="Atmospheric Cloud 1" 
          className="cloud-1 absolute top-20 -left-1/4 w-[60%] h-auto mix-blend-screen opacity-40 z-[8] pointer-events-none" 
        />
        <img 
          src="/cloude2.png" 
          alt="Atmospheric Cloud 2" 
          className="cloud-2 absolute bottom-20 -right-1/4 w-[50%] h-auto mix-blend-screen opacity-30 z-[15] pointer-events-none" 
        />
        <img 
          src="/cloude1.png" 
          alt="Atmospheric Cloud 3" 
          className="cloud-3 absolute top-1/2 -right-1/4 w-[45%] h-auto mix-blend-screen opacity-20 z-[7] pointer-events-none -scale-x-100 rotate-12" 
        />
        <img 
          src="/cloude2.png" 
          alt="Atmospheric Cloud 4" 
          className="cloud-4 absolute bottom-1/3 -left-1/4 w-[40%] h-auto mix-blend-screen opacity-25 z-[12] pointer-events-none rotate-[-15deg]" 
        />

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 w-full flex justify-center items-end px-6">
          <img 
            src="/Homepage.png" 
            alt="Estate Homepage Hero" 
            className="hero-image w-full max-w-5xl xl:max-w-6xl drop-shadow-2xl translate-z-0 block" 
          />
        </div>
      </section>

      {/* Second Section (Empty for building arrival) */}
      <section 
        id="vision" 
        className="relative h-[100vh] w-[100vw] bg-transparent z-20 flex items-end p-0"
      >
        {/* The building (hero-image) glides here into the bottom-left corner */}
      </section>
    </div>
  );
};

export default App;
