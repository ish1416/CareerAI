import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function OceanEffects() {
  const { theme } = useTheme();
  const [bubbles, setBubbles] = useState([]);
  const [fish, setFish] = useState([]);
  const [particles, setParticles] = useState([]);
  const [mouseTrail, setMouseTrail] = useState([]);

  useEffect(() => {
    if (theme !== 'ocean') return;

    // Create floating bubbles
    const createBubbles = () => {
      const newBubbles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 8 + 4,
        delay: Math.random() * 15,
        duration: Math.random() * 10 + 15
      }));
      setBubbles(newBubbles);
    };

    // Create swimming fish
    const createFish = () => {
      const newFish = Array.from({ length: 3 }, (_, i) => ({
        id: i,
        delay: i * 8,
        duration: 25 + Math.random() * 10
      }));
      setFish(newFish);
    };

    // Create floating particles
    const createParticles = () => {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 30,
        duration: 30 + Math.random() * 20
      }));
      setParticles(newParticles);
    };

    createBubbles();
    createFish();
    createParticles();
    
    const bubbleInterval = setInterval(createBubbles, 25000);
    const fishInterval = setInterval(createFish, 60000);
    const particleInterval = setInterval(createParticles, 45000);

    return () => {
      clearInterval(bubbleInterval);
      clearInterval(fishInterval);
      clearInterval(particleInterval);
    };
  }, [theme]);

  // Mouse trail effect
  useEffect(() => {
    if (theme !== 'ocean') return;

    const handleMouseMove = (e) => {
      const newBubble = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY
      };
      
      setMouseTrail(prev => [...prev.slice(-5), newBubble]);
      
      setTimeout(() => {
        setMouseTrail(prev => prev.filter(b => b.id !== newBubble.id));
      }, 1000);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [theme]);

  if (theme !== 'ocean') return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: -1,
      overflow: 'hidden'
    }}>
      {/* Floating Bubbles */}
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="floating-bubble"
          style={{
            position: 'absolute',
            left: `${bubble.left}%`,
            bottom: '-20px',
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            background: `radial-gradient(circle, rgba(255, 255, 255, ${0.6 + Math.random() * 0.4}) 0%, rgba(0, 255, 255, ${0.4 + Math.random() * 0.4}) 100%)`,
            borderRadius: '50%',
            animation: `bubble-rise ${bubble.duration}s linear infinite`,
            animationDelay: `${bubble.delay}s`,
            boxShadow: `0 0 ${bubble.size * 3}px rgba(0, 255, 255, 0.6)`
          }}
        />
      ))}

      {/* Swimming Fish */}
      {fish.map(f => (
        <div
          key={f.id}
          className="ocean-fish"
          style={{
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
            top: `${20 + f.id * 15}%`,
            zIndex: 1000
          }}
        />
      ))}

      {/* Large Floating Elements */}
      <div style={{
        position: 'fixed',
        top: '10%',
        right: '10%',
        width: '100px',
        height: '100px',
        background: 'radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'ocean-bubble-float 12s ease-in-out infinite',
        zIndex: -1
      }} />
      
      <div style={{
        position: 'fixed',
        bottom: '20%',
        left: '15%',
        width: '80px',
        height: '80px',
        background: 'radial-gradient(circle, rgba(64, 224, 208, 0.4) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'ocean-bubble-float 15s ease-in-out infinite reverse',
        zIndex: -1
      }} />

      {/* Floating Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="ocean-particles"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}

      {/* Mouse Trail Bubbles */}
      {mouseTrail.map(bubble => (
        <div
          key={bubble.id}
          className="mouse-bubble"
          style={{
            left: bubble.x,
            top: bubble.y
          }}
        />
      ))}

      {/* Ocean Tide Effect */}
      <div className="ocean-tide" />

      {/* Ocean Floor Pattern */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '200px',
        background: `
          linear-gradient(0deg, rgba(0, 34, 68, 0.8) 0%, transparent 100%),
          repeating-linear-gradient(
            90deg,
            transparent 0px,
            rgba(0, 255, 255, 0.1) 1px,
            transparent 2px,
            transparent 40px
          )
        `,
        animation: 'ocean-floor 20s linear infinite',
        zIndex: -1
      }} />

      {/* Coral Reef Elements */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '15%',
        width: '8px',
        height: '40px',
        background: 'linear-gradient(0deg, rgba(255, 107, 107, 0.4) 0%, rgba(255, 107, 107, 0.1) 100%)',
        borderRadius: '4px 4px 0 0',
        animation: 'seaweed-sway 4s ease-in-out infinite',
        transformOrigin: 'bottom center'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '20%',
        width: '6px',
        height: '30px',
        background: 'linear-gradient(0deg, rgba(76, 175, 80, 0.4) 0%, rgba(76, 175, 80, 0.1) 100%)',
        borderRadius: '3px 3px 0 0',
        animation: 'seaweed-sway 3s ease-in-out infinite reverse',
        animationDelay: '1s',
        transformOrigin: 'bottom center'
      }} />

      {/* Light Rays */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        width: '2px',
        height: '100%',
        background: 'linear-gradient(180deg, rgba(0, 229, 255, 0.3) 0%, transparent 70%)',
        animation: 'light-ray 8s ease-in-out infinite',
        transformOrigin: 'top center'
      }} />

      <div style={{
        position: 'absolute',
        top: 0,
        right: '30%',
        width: '1px',
        height: '100%',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 60%)',
        animation: 'light-ray 6s ease-in-out infinite reverse',
        animationDelay: '2s',
        transformOrigin: 'top center'
      }} />

      <style jsx>{`
        @keyframes seaweed-sway {
          0%, 100% { transform: rotate(-3deg) translateX(0); }
          50% { transform: rotate(3deg) translateX(2px); }
        }

        @keyframes light-ray {
          0%, 100% { 
            opacity: 0.3;
            transform: rotate(-1deg);
          }
          50% { 
            opacity: 0.6;
            transform: rotate(1deg);
          }
        }

        @keyframes ocean-floor {
          0% { transform: translateX(0); }
          100% { transform: translateX(-30px); }
        }
      `}</style>
    </div>
  );
}