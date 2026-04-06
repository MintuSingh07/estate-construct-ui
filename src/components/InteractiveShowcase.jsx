import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TbArrowUpRight } from "react-icons/tb";
import { AmbientLights } from './AmbientLights';

export const InteractiveShowcase = () => {
  const cursorVideoRef = useRef();
  const showcaseContainerRef = useRef();
  
  const [activeVideo, setActiveVideo] = useState(null);
  const [loadedVideos, setLoadedVideos] = useState(new Set());

  const showcaseItems = [
    { 
      id: 1, 
      title: 'Build and Develop', 
      description: 'It is construction of new building on open plots, developing an area.',
      bullets: ['Greenfield Construction', 'Master Planning & Zoning', 'Core Foundation to Finish', 'Sustainable Development'],
      videoUrl: 'https://www.youtube.com/embed/l6EzZafb1Pk?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&playsinline=1&playlist=l6EzZafb1Pk' 
    },
    { 
      id: 2, 
      title: 'Architectural Design', 
      description: 'Comprehensive drafting, 3D modeling, and conceptualization for modern luxury spaces.',
      bullets: ['Parametric Modeling', 'Spatial Optimization', 'Material Selection', 'Facade Engineering'],
      videoUrl: 'https://www.youtube.com/embed/W4JkmpRjQH8?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&playsinline=1&playlist=W4JkmpRjQH8' 
    },
    { 
      id: 3, 
      title: 'Interior Curation', 
      description: 'Bespoke interior design focusing on high-end materiality and ambient lighting.',
      bullets: ['Custom Millwork', 'Acoustic Treatments', 'Smart Home Integration', 'Procurement'],
      videoUrl: 'https://www.youtube.com/embed/xJG7CtJLMIo?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&playsinline=1&playlist=xJG7CtJLMIo' 
    },
    { 
      id: 4, 
      title: 'Estate Management', 
      description: 'Post-construction lifecycle management and premium structural maintenance.',
      bullets: ['Asset Preservation', 'Preventative Maintenance', 'Energy Auditing', 'Concierge Services'],
      videoUrl: 'https://www.youtube.com/embed/gB2_xBz3_QQ?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&playsinline=1&playlist=gB2_xBz3_QQ' 
    }
  ];

  // Optimize: Defer heavy iframe loading until strip is specifically interacted with natively
  useEffect(() => {
    if (activeVideo !== null && !loadedVideos.has(activeVideo)) {
      setLoadedVideos(prev => new Set([...prev, activeVideo]));
    }
  }, [activeVideo, loadedVideos]);

  // Isolate GSAP cursor math out of the main App root
  useGSAP(() => {
    if (!cursorVideoRef.current) return;
    const xTo = gsap.quickTo(cursorVideoRef.current, "x", { duration: 0.8, ease: "power3" });
    const yTo = gsap.quickTo(cursorVideoRef.current, "y", { duration: 0.8, ease: "power3" });

    const handleMouseMove = (e) => {
      xTo(e.clientX - 200); 
      yTo(e.clientY - 112.5);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, { scope: showcaseContainerRef });

  return (
    <div ref={showcaseContainerRef} className="contents">
      {/* Floating Video Cursor Element */}
      <div 
        ref={cursorVideoRef}
        className={`fixed top-0 left-0 w-[400px] aspect-video pointer-events-none z-[100] rounded-sm overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${activeVideo !== null ? 'opacity-100 scale-100 shadow-[0_0_50px_rgba(0,0,0,0.5)]' : 'opacity-0 scale-50'}
        `}
      >
        {showcaseItems.map((item, idx) => {
          // Explicit network deference. Return absolutely nothing until marked as active for the first time.
          if (!loadedVideos.has(idx)) return null;

          return (
            <iframe 
              key={item.id}
              src={item.videoUrl}
              title={item.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className={`absolute inset-0 w-[400px] aspect-video object-cover transition-opacity duration-700 pointer-events-none scale-150 transform-origin-center ${activeVideo === idx ? 'opacity-100' : 'opacity-0'}`}
            />
          );
        })}
        {/* Subtle inner shadow overlay */}
        <div className="absolute inset-0 border border-white/20 z-10 pointer-events-none" />
      </div>

      {/* Fourth Section (Interactive Showcase) */}
      <section 
        id="showcase" 
        className="relative min-h-[100vh] w-full flex flex-col items-center justify-center bg-[#050505] overflow-hidden z-50 pt-32 pb-48"
      >
        <div className="absolute inset-0 bg-[#050505] pointer-events-none z-0"></div>

        <AmbientLights type="showcase" />

        <div className="relative z-10 w-[95%] max-w-[1800px] flex flex-col items-center">
          
          <div className="w-full flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24">
            <h2 className="text-[clamp(3rem,6vw,5rem)] title-serif leading-none uppercase tracking-tighter flex flex-col">
              <span className="premium-text-gradient">Featured</span>
              <span className="premium-text-gradient italic font-light opacity-60">Developments</span>
            </h2>
            <p className="text-white/40 max-w-xs text-xs tracking-widest uppercase mt-6 md:mt-0 technical-monoscope hidden md:block text-right">
               A curated selection of our most distinguished architectural projects.
            </p>
          </div>

          <div 
            className="w-full flex flex-col cursor-crosshair"
            onMouseLeave={() => setActiveVideo(null)}
          >
            <div className="h-[1px] w-full bg-white/10"></div>
            
            {showcaseItems.map((item, idx) => (
              <div 
                key={item.id}
                onMouseEnter={() => setActiveVideo(idx)}
                className={`group relative flex flex-col py-4 md:py-5 cursor-pointer border-b border-white/10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                  ${activeVideo !== null && activeVideo !== idx ? 'opacity-20' : 'opacity-100'}
                  ${activeVideo === idx ? 'md:px-8 bg-white/[0.03]' : ''}
                `}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="text-[clamp(1.5rem,3vw,2.5rem)] title-serif font-light text-white transition-transform duration-700 group-hover:translate-x-4">
                    {item.title}
                  </div>
                  
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 flex justify-center items-center backdrop-blur-sm transition-all duration-700 group-hover:bg-white group-hover:text-black group-hover:border-transparent group-hover:rotate-45">
                    <TbArrowUpRight className="text-xl md:text-2xl" />
                  </div>
                </div>

                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <div className="pt-6 pb-2 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 opacity-0 translate-y-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-y-0 text-white/70">
                      
                      <p className="text-sm md:text-base font-light leading-relaxed max-w-sm">
                        {item.description}
                      </p>
                      
                      <ul className="flex flex-col gap-2 border-l border-white/10 pl-6 md:pl-8">
                        {item.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="text-xs md:text-sm font-sans tracking-wide uppercase flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E5D3B3] opacity-60"></span>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                      
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};
