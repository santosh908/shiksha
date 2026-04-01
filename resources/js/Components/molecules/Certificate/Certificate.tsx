import React, { useEffect, useRef } from 'react';
import { useWindowScroll } from '@mantine/hooks';

const Certificate = ({ name, shiksha_level,certificateNo }: { name: string; shiksha_level: number,certificateNo:string }) => {
  const [scroll, _] = useWindowScroll();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    //@ts-ignore
    const ctx = canvas.getContext('2d');

    // Create image element the browser way
    const img = document.createElement('img');
    if(shiksha_level==2)
    {
      img.src = '/Certificate/shradhawan.jpg'; 
    }
    else if(shiksha_level==3)
    {
      img.src = '/Certificate/KrishnaSevak.jpg';
    }
    else if(shiksha_level==4)
    {
      img.src = '/Certificate/KrishnaSadhak.jpg';
    }
    else if(shiksha_level==5)
    {
      img.src = '/Certificate/ShrilaPrabhupada.jpg';
    }
    else if(shiksha_level==6)
    {
      img.src = '/Certificate/GurupadaAshray.jpg';
    }
    else if(shiksha_level==7)
    {
      img.src = '/Certificate/GurupadaAshray.jpg';
    }
   else
   img.src = '/'; 
    
    // Handle errors
    img.onerror = () => {
      console.error('Error loading certificate background image');
      // Draw fallback background
      ctx.fillStyle = '#ffffff';
      //@ts-ignore
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //@ts-ignore
      drawCertificateContent(ctx, canvas.width, canvas.height, name);
    };
    
    img.onload = () => {
      //@ts-ignore
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      //@ts-ignore
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      //@ts-ignore
      drawCertificateContent(ctx, canvas.width, canvas.height, name);
    };
  }, [name]);

  //@ts-ignore
  const drawCertificateContent = (ctx, width, height, name) => {

  const baseFontSize = width * 0.015;
    
  ctx.font = `${baseFontSize}px Arial`;
  ctx.textAlign = 'left';
  ctx.fillStyle = 'black';
  const certificateId = certificateNo.toString();
  if(shiksha_level==2){
    const certificateIdX = width * 0.07; // Adjust position as percentage of width
    const certificateIdY = height * 0.30; // Adjust position as percentage of height
    ctx.fillText(certificateId, certificateIdX, certificateIdY);
  }
  if(shiksha_level==3){
    const certificateIdX = width * 0.07; // Adjust position as percentage of width
    const certificateIdY = height * 0.25; // Adjust position as percentage of height
    ctx.fillText(certificateId, certificateIdX, certificateIdY);
  }
  if(shiksha_level==4){
    const certificateIdX = width * 0.09; // Adjust position as percentage of width
    const certificateIdY = height * 0.31; // Adjust position as percentage of height
    ctx.fillText(certificateId, certificateIdX, certificateIdY);
  }
  if(shiksha_level==5){
    const certificateIdX = width * 0.060; // Adjust position as percentage of width
    const certificateIdY = height * 0.24; // Adjust position as percentage of height
    ctx.fillText(certificateId, certificateIdX, certificateIdY);
  }
  if(shiksha_level==6){
    const certificateIdX = width * 0.060; // Adjust position as percentage of width
    const certificateIdY = height * 0.24; // Adjust position as percentage of height
    ctx.fillText(certificateId, certificateIdX, certificateIdY);
  }
  if(shiksha_level==7){
    const certificateIdX = width * 0.060; // Adjust position as percentage of width
    const certificateIdY = height * 0.24; // Adjust position as percentage of height
    ctx.fillText(certificateId, certificateIdX, certificateIdY);
  }
    
    // Set font styles for title
   ctx.font = 'bold 60px Arial';
   ctx.fillStyle = 'black';
   ctx.textAlign = 'center';

    // Draw "THIS CERTIFICATE IS AWARDED TO"
    ctx.font = 'bold 40px Arial';

    if(shiksha_level==7){
      // Draw name
      ctx.font = 'bold 50px Arial';
      const centerX = width / 2;
      ctx.fillText(name, centerX, 730);
    }
    else{
      // Draw name
      ctx.font = 'bold 50px Arial';
      const centerX = width / 2;
      ctx.fillText(name, centerX, 700);
    }
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
      
      <div className="relative  w-full max-w-6xl" style={{overflow:'scroll'}}>
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
