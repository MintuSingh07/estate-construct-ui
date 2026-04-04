import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { TbMenu3 } from "react-icons/tb";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const container = useRef();
  const loaderRef = useRef();
  const realLogoRef = useRef();
  const visionContentRef = useRef();
  const spotlightRef = useRef();
  const gridRef = useRef();

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

      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        // Desktop Settings
        gsap.to('.hero-image', {
          id: 'building-scroll',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            endTrigger: '#vision',
            end: 'top top', 
            scrub: .5,
            immediateRender: false,
          },
          xPercent: -65,
          y: 0,
          scale: 1.5,
          filter: 'grayscale(1)',
          WebkitFilter: 'grayscale(1)',
        });
      });

      mm.add("(max-width: 768px)", () => {
        // Mobile Settings: Keep building in frame
        gsap.to('.hero-image', {
          id: 'building-mobile',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            endTrigger: '#vision',
            end: 'top top', 
            scrub: .5,
            immediateRender: false,
          },
          xPercent: -30, // Less aggressive shift
          y: -80, // Move up to stay in view
          scale: 1.3, // Slightly smaller scale
          filter: 'grayscale(1)',
          WebkitFilter: 'grayscale(1)',
        });
      });

      // 2. Pin Vision: Let Portfolio overlay it after a "hold" duration
      ScrollTrigger.create({
        trigger: '#vision',
        start: 'top top',
        end: '+=250%', // Increased duration for cinematic "hold" time
        pin: true,
        pinSpacing: false, 
        scrub: true,
      });

      // Vision Content Reveal
      gsap.from('.vision-detail-item', {
        scrollTrigger: {
          trigger: '#vision',
          start: 'top 20%', 
          toggleActions: 'play none none reverse',
        },
        x: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power2.out',
      });

      // Vision Floating Effect
      gsap.to('.vision-detail-item', {
        y: -15,
        duration: 4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });

      // 3. Core Principles Animations (Section 3)
      const principles = gsap.utils.toArray('.principle-item');

      // Centerline growth & Bullet progress
      gsap.fromTo('.principles-line', 
        { scaleY: 0 },
        {
          scaleY: 1,
          scrollTrigger: {
            trigger: '#portfolio',
            start: 'top 40%',
            end: 'bottom 80%',
            scrub: true,
          }
        }
      );

      // Vertical Spark with Sync'd Spotlight and Parallax Grid
      gsap.fromTo('.principles-spark-head',
        { top: '0%' },
        {
          top: '100%',
          scrollTrigger: {
            trigger: '#portfolio',
            start: 'top 40%',
            end: 'bottom 80%',
            scrub: true,
            onUpdate: (self) => {
              if (spotlightRef.current) {
                spotlightRef.current.style.setProperty('--spark-y', `${self.progress * 100}%`);
              }
              if (gridRef.current) {
                gsap.set(gridRef.current, { y: -self.progress * 80 });
              }
            }
          }
        }
      );

      gsap.fromTo('.principles-spark-tail',
        { height: 0, top: '0%' }, // Start collapsed
        {
          height: 150, // Length of the glowing trail
          top: '100%',
          scrollTrigger: {
            trigger: '#portfolio',
            start: 'top 40%',
            end: 'bottom 80%',
            scrub: true,
          }
        }
      );

      // Active Principle Highlight: Focus text as spark passes
      principles.forEach((item) => {
        const title = item.querySelector('h3');
        const detail = item.querySelector('p');

        gsap.to([title, detail], {
          opacity: 1,
          color: '#ffffff',
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 75%',
            once: true,
            toggleActions: 'play none none none',
          }
        });
      });

      // Staggered reveals for each principle block
      principles.forEach((item) => {
        const text = item.querySelector('.principle-text');

        // Text and Technical Ornaments (Permanent)
        gsap.from([text, text.querySelector('.technical-monoscope')], {
          y: 20,
          opacity: 0,
          duration: 1.5,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            once: true,
            toggleActions: 'play none none none',
          }
        });

        // Box and Brackets Reveal (Permanent)
        const brackets = item.querySelectorAll('.corner-bracket');
        const boxContainer = item.querySelector('.box-reveal-container');
        
        gsap.from(brackets, {
          scale: 1.2,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            once: true,
            toggleActions: 'play none none none',
          }
        });

        gsap.to(boxContainer, {
          height: '100%',
          duration: 2,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%', 
            once: true,
            toggleActions: 'play none none none',
          }
        });

        // Scale bar growth
        const scaleBar = item.querySelector('.scale-bar');
        if (scaleBar) {
          gsap.from(scaleBar, {
            width: 0,
            duration: 1.5,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              once: true,
            }
          });
        }
      });
    };

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Mouse movement micro-interaction
    const hero = document.querySelector('#hero');
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 30;
      const yPos = (clientY / window.innerHeight - 0.5) * 30;

      gsap.to('.hero-text-block', {
        x: xPos,
        y: yPos,
        duration: 2.5,
        ease: 'power2.out',
      });
    };

    hero?.addEventListener('mousemove', handleMouseMove);

    return () => {
      hero?.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', skipIntro);
      window.removeEventListener('touchmove', skipIntro);
      lenis.destroy();
    };
  }, { scope: container });

  return (
    <div ref={container} className="bg-[#050505] text-white overflow-hidden min-h-screen">
      <div className="fixed-noise-overlay" />
      {/* Loader Backdrop */}
      <div ref={loaderRef} className="loader-backdrop fixed inset-0 z-[45] bg-[#050505] pointer-events-none" />

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
        className="relative h-screen flex items-center justify-center pt-20 snap-start"
      >
        {/* Background Group (Clipped to Hero Height) */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <div className="absolute inset-0 w-full h-full bg-[url('/bg_mountain.png')] bg-cover bg-top scale-[1.15]"></div>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center md:justify-start items-center pt-0 md:pt-32 select-none pointer-events-none z-[5] px-4 -translate-y-28 md:translate-y-0">
          <div className="overflow-hidden w-full">
            <div className="hero-text-block uppercase tracking-tighter leading-none text-center -mt-.5 w-full">
              <div className="text-[clamp(1.5rem,8vw,5rem)] font-medium premium-text-gradient">WE CONSTRUCT</div>
              <div className="text-[clamp(2.5rem,10vw,8rem)] font-semibold premium-text-gradient -mt-[.1em]">YOUR VISION</div>
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

      </section>

      {/* Second Section (Pinned Vision) */}
      <section 
        id="vision" 
        className="relative h-screen w-full bg-[#050505] z-20 flex flex-col md:flex-row items-center justify-start md:justify-end pl-8 md:pl-24 pr-8 md:pr-12 pt-24 md:pt-0"
      >
        <div ref={visionContentRef} className="max-w-4xl w-full text-center md:text-right pointer-events-none z-30 px-4 md:px-0">
          <div className="vision-detail-item">
            <h2 className="text-[clamp(1.4rem,3vw,2.6rem)] title-serif tracking-tight leading-relaxed premium-text-gradient italic">
              "WE DO NOT JUST BUILD STRUCTURES;<br className="hidden md:block" /> WE ARCHITECT LEGACIES."
            </h2>
          </div>
        </div>
      </section>

      <section 
        id="portfolio" 
        className="relative min-h-[110vh] w-full z-40 px-8 md:px-24 py-24 flex flex-col items-center bg-[#1c1c1c] overflow-hidden"
      >
        {/* Decorative Foundations */}
        <div ref={gridRef} className="principles-line::after absolute inset-0 opacity-10 pointer-events-none" />
        <div ref={spotlightRef} className="spotlight-overlay" />
        
        {/* Hero Heading for Section 3 */}
        <div className="w-full max-w-7xl text-center mb-16 md:mb-20 relative z-10 px-4">
          <h2 className="text-[clamp(1.5rem,3.2vw,2.8rem)] title-serif tracking-normal md:tracking-tight premium-text-gradient uppercase leading-snug md:leading-none opacity-90 md:whitespace-nowrap">
            Architecting The Future Through Core Principles
          </h2>
        </div>

        <div className="w-full max-w-7xl relative flex flex-col gap-12 md:gap-16">
          {/* Vertical Centerline with Glowing Tail Spark */}
          <div className="principles-line hidden md:block">
            <div className="principles-spark-tail" />
            <div className="principles-spark-head" />
          </div>

          {/* Principle 1: WHO WE ARE */}
          <div className="principle-item relative flex flex-col w-full md:w-1/2">
            <div className="principle-text mb-8 relative z-20 text-center md:text-left">
              <div className="technical-monoscope text-white/50 mb-2 flex items-center justify-center md:justify-start gap-4">
                <span>01</span>
                <div className="scale-bar w-12" />
                <span className="opacity-70">34° 3' 8" N / 118° 14' 37" W</span>
              </div>
              <h3 className="text-[clamp(1.8rem,3.5vw,2.8rem)] title-serif uppercase tracking-tight mb-2">Who We Are</h3>
              <p className="text-stone-300 text-sm tracking-widest uppercase">Pioneers of architectural legacy and innovation.</p>
            </div>
            <div className="box-reveal-wrapper w-full max-w-lg aspect-video relative mx-auto md:mx-0">
              <div className="corner-bracket bracket-tl" />
              <div className="corner-bracket bracket-tr" />
              <div className="corner-bracket bracket-bl" />
              <div className="corner-bracket bracket-br" />
              <div className="box-reveal-container w-full bg-black/90 relative border border-white/10">
                 <div className="absolute inset-0 border-l border-white/10" />
              </div>
            </div>
          </div>

          {/* Principle 2: WHAT WE DO */}
          <div className="principle-item relative flex flex-col w-full md:w-1/2">
            <div className="principle-text mb-8 relative z-20 text-center md:text-left">
              <div className="technical-monoscope text-white/50 mb-2 flex items-center justify-center md:justify-start gap-4">
                <span>02</span>
                <div className="scale-bar w-12" />
                <span className="opacity-70">52° 31' 12" N / 13° 24' 18" E</span>
              </div>
              <h3 className="text-[clamp(1.8rem,3.5vw,2.8rem)] title-serif uppercase tracking-tight mb-2">What We Do</h3>
              <p className="text-stone-300 text-sm tracking-widest uppercase">Transforming raw vision into reality.</p>
            </div>
            <div className="box-reveal-wrapper w-full max-w-lg aspect-video relative mx-auto md:mx-0">
              <div className="corner-bracket bracket-tl" />
              <div className="corner-bracket bracket-tr" />
              <div className="corner-bracket bracket-bl" />
              <div className="corner-bracket bracket-br" />
              <div className="box-reveal-container w-full bg-black/90 relative border border-white/10">
                 <div className="absolute inset-0 border-r border-white/10" />
              </div>
            </div>
          </div>

          {/* Principle 3: MISSION & VALUES */}
          <div className="principle-item relative flex flex-col w-full md:w-1/2">
            <div className="principle-text mb-8 relative z-20 text-center md:text-left">
              <div className="technical-monoscope text-white/50 mb-2 flex items-center justify-center md:justify-start gap-4">
                <span>03</span>
                <div className="scale-bar w-12" />
                <span className="opacity-70">25° 11' 50" N / 55° 16' 26" E</span>
              </div>
              <h3 className="text-[clamp(1.8rem,3.5vw,2.8rem)] title-serif uppercase tracking-tight mb-2">Mission & Values</h3>
              <p className="text-stone-300 text-sm tracking-widest uppercase">Building with integrity and timeless intent.</p>
            </div>
            <div className="box-reveal-wrapper w-full max-w-lg aspect-video relative mx-auto md:mx-0">
              <div className="corner-bracket bracket-tl" />
              <div className="corner-bracket bracket-tr" />
              <div className="corner-bracket bracket-bl" />
              <div className="corner-bracket bracket-br" />
              <div className="box-reveal-container w-full bg-black/90 relative border border-white/10">
                 <div className="absolute inset-0 border-l border-white/10" />
              </div>
            </div>
          </div>

          {/* Principle 4: OUR APPROACH */}
          <div className="principle-item relative flex flex-col w-full md:w-1/2">
            <div className="principle-text mb-8 relative z-20 text-center md:text-left">
              <div className="technical-monoscope text-white/50 mb-2 flex items-center justify-center md:justify-start gap-4">
                <span>04</span>
                <div className="scale-bar w-12" />
                <span className="opacity-70">40° 42' 46" N / 74° 0' 21" W</span>
              </div>
              <h3 className="text-[clamp(1.8rem,3.5vw,2.8rem)] title-serif uppercase tracking-tight mb-2">Our Approach</h3>
              <p className="text-stone-300 text-sm tracking-widest uppercase">Combining cinematic aesthetics with engineering.</p>
            </div>
            <div className="box-reveal-wrapper w-full max-w-lg aspect-video relative mx-auto md:mx-0">
              <div className="corner-bracket bracket-tl" />
              <div className="corner-bracket bracket-tr" />
              <div className="corner-bracket bracket-bl" />
              <div className="corner-bracket bracket-br" />
              <div className="box-reveal-container w-full bg-black/90 relative border border-white/10">
                 <div className="absolute inset-0 border-r border-white/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Building Layer (Above standard sections, below Portfolio overlay) */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[150vw] md:w-full flex justify-center items-end px-0 md:px-6 pointer-events-none hero-image-container">
        <img 
          src="/Homepage.png" 
          alt="Estate Homepage Hero" 
          className="hero-image w-full max-w-5xl xl:max-w-6xl drop-shadow-2xl translate-z-0 block opacity-0" 
        />
      </div>
    </div>
  );
};

export default App;
