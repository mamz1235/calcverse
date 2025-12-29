
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'CalcVerse';
  const category = searchParams.get('category') || 'Calculator';
  const result = searchParams.get('result');

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          color: 'white',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
           <div style={{ fontSize: 32, fontWeight: 'bold', color: '#6366f1', display: 'flex', alignItems: 'center' }}>
             <svg width="32" height="32" viewBox="0 0 24 24" fill="#6366f1" style={{marginRight: '12px'}}>
               <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
             </svg>
             CalcVerse
           </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          padding: '50px 80px',
          border: '2px solid #334155',
          borderRadius: '30px',
          backgroundColor: '#1e293b',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          minWidth: '650px',
          maxWidth: '900px'
        }}>
          <div style={{ 
            fontSize: 24, 
            textTransform: 'uppercase', 
            letterSpacing: '4px', 
            color: '#94a3b8',
            marginBottom: '15px',
            fontWeight: 600
          }}>
            {category}
          </div>
          <div style={{ 
            fontSize: 70, 
            fontWeight: '900', 
            background: 'linear-gradient(to right, #6366f1, #a855f7, #ec4899)',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: '30px',
            textAlign: 'center',
            lineHeight: 1.1
          }}>
            {title}
          </div>
          
          {result && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              marginTop: '10px',
              padding: '20px 40px',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              borderRadius: '16px',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}>
               <div style={{ fontSize: 18, color: '#cbd5e1', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Calculation Result</div>
               <div style={{ fontSize: 48, fontWeight: 'bold', color: '#ffffff' }}>{result}</div>
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
