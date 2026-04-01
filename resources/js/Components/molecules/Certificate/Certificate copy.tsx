import React, { useEffect, useRef } from 'react';
import { useWindowScroll } from '@mantine/hooks';

const Certificate = ({ name, exam_level }: { name: string; exam_level: string }) => {
  const [scroll, _] = useWindowScroll();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    //@ts-ignore
    const ctx = canvas.getContext('2d');

    // Create image element the browser way
    const img = document.createElement('img');
    img.src = '/shradhawan.jpg'; // Replace with your certificate background image
    
    // Handle errors
    img.onerror = () => {
      console.error('Error loading certificate background image');
      // Draw fallback background
      ctx.fillStyle = '#ffffff';
      //@ts-ignore
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //@ts-ignore
      drawCertificateContent(ctx, canvas.width, canvas.height, name, exam_level);
    };
    
    // When image loads, draw everything
    img.onload = () => {
      // Clear canvas
      //@ts-ignore
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background image
      //@ts-ignore
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      //@ts-ignore
      drawCertificateContent(ctx, canvas.width, canvas.height, name, exam_level);
    };
  }, [name, exam_level]);

  // Separate function to draw certificate content
  //@ts-ignore
  const drawCertificateContent = (ctx, width, height, name, exam_level) => {
    // Set font styles for title
   ctx.font = 'bold 60px Arial';
   ctx.fillStyle = 'black';
   ctx.textAlign = 'center';
    // ctx.fillText('Certificate Sraddhavan', width / 2, 300);

    // Draw "THIS CERTIFICATE IS AWARDED TO"
    ctx.font = 'bold 40px Arial';
   // ctx.fillText('THIS CERTIFICATE IS AWARDED TO', width / 2, 600);
    
    // Draw name
    ctx.font = 'bold 50px Arial';
    const centerX = width / 2;
    ctx.fillText(name, centerX, 700);
    
    // Draw exam level
    //ctx.font = '40px Arial';
    //ctx.fillText(`who has successfully completed the Shiksha Level "${exam_level}"`, centerX, 800);
    
    // Add signatures
    const signatureY = 1000;
    const spacing = width / 4;
    
    // Left signature
    // ctx.font = '30px Arial';
    // ctx.fillText('Sri Gaur Das', spacing, signatureY);
    // ctx.font = '25px Arial';
    // ctx.fillText('Vice President', spacing, signatureY + 40);
    // ctx.fillText('ISKCON Dwarka, Delhi', spacing, signatureY + 80);
    
    // // Middle signature
    ctx.font = '30px Arial';
    ctx.fillText('Pradyumna Priya Das', spacing * 2, signatureY);
    ctx.font = '25px Arial';
    ctx.fillText('President', spacing * 2, signatureY + 40);
    ctx.fillText('ISKCON Dwarka, Delhi', spacing * 2, signatureY + 80);
    
    // // Right signature
    // ctx.font = '30px Arial';
    // ctx.fillText('Amogh Lila Das', spacing * 3, signatureY);
    // ctx.font = '25px Arial';
    // ctx.fillText('Vice President', spacing * 3, signatureY + 40);
    // ctx.fillText('ISKCON Dwarka, Delhi', spacing * 3, signatureY + 80);
  };

    // Add download functionality
    const handleDownload = () => {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.download = `certificate-${name}.png`;
      //@ts-ignore
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4" ref={containerRef}>
      <button 
        onClick={handleDownload}
        className="self-end mb-2 px-6  py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
      >
        Download
      </button>
      
      <div className="relative w-full max-w-6xl">
        <canvas
          ref={canvasRef}
          width={1755}
          height={1241}
          className="w-full h-auto border border-gray-300 shadow-lg bg-white"
        />
      </div>

    </div>
  );
};

export default Certificate;
