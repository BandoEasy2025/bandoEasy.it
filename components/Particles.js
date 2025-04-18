import { useEffect, useRef } from 'react';

export default function Particles({ className }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let mousePosition = { x: null, y: null };
    
    // Set canvas size - important to match actual window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Re-initialize particles when canvas resizes
      initParticles();
    };
    
    // Initialize particles with more particles and better visibility
    const initParticles = () => {
      const particleCount = Math.floor(canvas.width * canvas.height / 8000); // More particles
      particles = [];
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1, // Larger radius
          speedX: Math.random() * 1 - 0.5, // Faster movement
          speedY: Math.random() * 1 - 0.5, // Faster movement
          opacity: Math.random() * 0.7 + 0.3 // Higher opacity
        });
      }
    };
    
    // Track mouse position for interactive effect
    const handleMouseMove = (event) => {
      mousePosition.x = event.clientX;
      mousePosition.y = event.clientY;
    };
    
    // Draw particles and connections with improved visibility
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      particles.forEach((particle, index) => {
        // Update particle position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY;
        }
        
        // Draw the particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        
        // Color based on position
        const isLeftSide = particle.x < canvas.width / 2;
        ctx.fillStyle = isLeftSide 
          ? `rgba(120, 120, 120, ${particle.opacity})` // Darker on left side
          : `rgba(36, 105, 92, ${particle.opacity})`;  // Brand color on right
        ctx.fill();
        
        // Interactive effect with mouse
        if (mousePosition.x && mousePosition.y) {
          const dx = particle.x - mousePosition.x;
          const dy = particle.y - mousePosition.y;
          const mouseDistance = Math.sqrt(dx * dx + dy * dy);
          
          // Particles move away from mouse
          if (mouseDistance < 100) {
            const force = (100 - mouseDistance) / 1000;
            particle.x += dx * force;
            particle.y += dy * force;
          }
        }
        
        // Draw connections to other particles (limited to improve performance)
        for (let j = index + 1; j < particles.length; j++) {
          const otherParticle = particles[j];
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Only connect particles that are close to each other
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            
            // Color based on which side the particles are on
            const isLeftSide = particle.x < canvas.width / 2 && otherParticle.x < canvas.width / 2;
            const isRightSide = particle.x >= canvas.width / 2 && otherParticle.x >= canvas.width / 2;
            
            if (isLeftSide) {
              ctx.strokeStyle = `rgba(120, 120, 120, ${0.3 * (1 - distance / 100)})`; // More visible lines
            } else if (isRightSide) {
              ctx.strokeStyle = `rgba(36, 105, 92, ${0.3 * (1 - distance / 100)})`; // More visible lines
            } else {
              // Crossing between sides
              ctx.strokeStyle = `rgba(80, 102, 100, ${0.2 * (1 - distance / 100)})`;
            }
            
            ctx.lineWidth = 0.8; // Thicker lines
            ctx.stroke();
          }
        }
      });
      
      animationFrameId = requestAnimationFrame(drawParticles);
    };
    
    // Initialize
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    resizeCanvas();
    drawParticles();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
} 