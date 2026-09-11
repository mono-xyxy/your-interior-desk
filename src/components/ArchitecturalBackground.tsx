'use client';

export default function ArchitecturalBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-radial from-[#1E3048]/30 via-[#0E1726]/10 to-transparent blur-3xl opacity-60" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-radial from-[#D4AF37]/5 via-transparent to-transparent blur-3xl opacity-40" />

      {/* Grid line texture */}
      <div className="absolute inset-0 architectural-grid opacity-30" />

      {/* Subtle Architectural Wireframe Art overlay matching uploaded Image 2 */}
      <svg
        className="absolute top-12 left-8 md:left-16 w-72 md:w-96 opacity-15 text-[#D4AF37]"
        viewBox="0 0 400 600"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M50,100 L350,100 M200,50 L200,550 M100,200 L300,200 M100,400 L300,400" strokeDasharray="4 4" />
        <rect x="120" y="150" width="160" height="250" strokeWidth="1.5" />
        <line x1="80" y1="300" x2="320" y2="300" strokeWidth="1.5" />
        <line x1="160" y1="100" x2="160" y2="450" />
        <line x1="240" y1="100" x2="240" y2="450" />
      </svg>

      <svg
        className="absolute bottom-12 right-8 md:right-16 w-80 md:w-[450px] opacity-10 text-[#C5A059]"
        viewBox="0 0 500 500"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <circle cx="250" cy="250" r="180" strokeDasharray="6 6" />
        <polygon points="250,70 410,340 90,340" strokeWidth="1.5" />
        <line x1="50" y1="250" x2="450" y2="250" />
      </svg>
    </div>
  );
}
