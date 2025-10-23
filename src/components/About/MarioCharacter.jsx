import React, { useEffect, useRef, useState } from 'react';
import './MarioCharacter.css';

const MarioCharacter = ({ isPushing }) => {
  const canvasRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, direction: 1 });
  const animationFrameRef = useRef(0);
  const positionRef = useRef({ x: 0, direction: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const scale = 2.5;
    
    // Mario sprite dimensions
    const spriteWidth = 16;
    const spriteHeight = 32;
    
    // Animation state
    let frameCount = 0;
    let walkFrame = 0;
    
    // Draw Mario using canvas rectangles to create pixel art
    const drawMario = (x, y, frame, isPush) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const pixelSize = scale;
      const offsetX = x;
      const offsetY = y;
      
      // Mario color palette
      const colors = {
        red: '#FF0000',
        blue: '#0000FF',
        skin: '#FFCC99',
        brown: '#8B4513',
        yellow: '#FFD700',
        white: '#FFFFFF',
        black: '#000000'
      };
      
      // Simple pixel art Mario (inspired by classic sprite)
      const marioPixels = [
        // Row 0-2: Hat
        [0,0,0,1,1,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,1,1,0,0],
        [0,0,2,2,2,3,3,0,0,0,0],
        // Row 3-5: Face
        [0,2,3,2,3,3,3,3,2,0,0],
        [0,2,3,2,3,3,3,3,3,2,0],
        [0,2,2,3,3,3,3,3,2,0,0],
        // Row 6-7: Eyes/Mustache
        [0,0,3,3,4,3,3,4,0,0,0],
        [0,0,3,3,3,3,3,3,0,0,0],
        // Row 8-11: Body
        [0,0,0,1,5,1,1,0,0,0,0],
        [0,0,1,1,5,1,1,1,0,0,0],
        [0,1,1,1,5,5,1,1,1,0,0],
        [0,2,1,5,6,5,6,1,2,0,0],
        // Row 12-13: Legs (walk animation)
        frame === 0 ? [0,2,2,5,5,5,5,2,2,0,0] : [0,0,2,2,5,5,2,2,0,0,0],
        frame === 0 ? [0,2,2,5,5,5,5,2,2,0,0] : [0,2,2,5,5,5,5,2,2,0,0],
        // Row 14-15: Feet
        frame === 0 ? [2,2,2,2,0,0,2,2,2,2,0] : [0,2,2,2,2,2,2,2,2,0,0],
        frame === 0 ? [2,2,2,0,0,0,0,2,2,2,0] : [2,2,2,2,0,0,2,2,2,2,0],
      ];
      
      // Color map
      const colorMap = {
        0: null,
        1: colors.red,
        2: colors.brown,
        3: colors.skin,
        4: colors.black,
        5: colors.blue,
        6: colors.yellow
      };
      
      // Draw Mario pixel by pixel
      marioPixels.forEach((row, rowIndex) => {
        row.forEach((pixel, colIndex) => {
          if (pixel !== 0) {
            const px = offsetX + colIndex * pixelSize;
            const py = offsetY + rowIndex * pixelSize;
            ctx.fillStyle = colorMap[pixel];
            ctx.fillRect(px, py, pixelSize, pixelSize);
          }
        });
      });
      
      // Add push effect (sweat drops)
      if (isPush) {
        ctx.fillStyle = colors.blue;
        ctx.beginPath();
        ctx.arc(offsetX - 5, offsetY + 10, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(offsetX - 3, offsetY + 15, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    
    // Animation loop
    const animate = () => {
      frameCount++;
      
      // Update walk animation every 10 frames
      if (frameCount % 10 === 0) {
        walkFrame = (walkFrame + 1) % 2;
      }
      
      // Move Mario left and right
      if (frameCount % 2 === 0) {
        positionRef.current.x += positionRef.current.direction * 0.5;
        
        // Bounce back at edges
        if (positionRef.current.x > 50) {
          positionRef.current.direction = -1;
        } else if (positionRef.current.x < -20) {
          positionRef.current.direction = 1;
        }
        
        setPosition({ ...positionRef.current });
      }
      
      // Draw Mario at current position
      const centerX = canvas.width / 2 + positionRef.current.x;
      const centerY = canvas.height - 50;
      drawMario(centerX - 15, centerY - 40, walkFrame, isPushing);
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPushing]);

  return (
    <div className="mario-canvas-wrapper">
      <canvas 
        ref={canvasRef} 
        width={200} 
        height={150}
        className="mario-canvas"
      />
    </div>
  );
};

export default MarioCharacter;
