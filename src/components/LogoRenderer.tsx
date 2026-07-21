import React from "react";

interface LogoRendererProps {
  id: number; // 1 to 100
  initials: string; // e.g. "HM"
  partner1: string; // e.g. "Hậu"
  partner2: string; // e.g. "My"
  date: string; // e.g. "2026.07.20"
  themeColor?: string; // Optional custom color override
  bgColor?: string; // Optional custom background color override
  width?: string | number;
  height?: string | number;
}

export const LogoRenderer: React.FC<LogoRendererProps> = ({
  id,
  initials = "HM",
  partner1 = "Hậu",
  partner2 = "My",
  date = "2026.07.20",
  themeColor,
  bgColor,
  width = "100%",
  height = "100%",
}) => {
  // Determine Category based on ID (1-25: Royal, 26-50: Minimalist, 51-75: Art Deco, 76-100: Botanical)
  const categoryId = Math.ceil(id / 25);
  const subId = ((id - 1) % 25) + 1; // 1 to 25

  // Default color palettes based on trends
  let defaultStrokeColor = "#D4AF37"; // Royal Gold
  let defaultBgColor = "#FFFFFF"; // Premium Pure White
  let categoryName = "Classic Royal";

  if (categoryId === 2) {
    // Modern Minimalist
    defaultStrokeColor = "#A0AEC0"; // Matte Silver / Steel
    defaultBgColor = "#121212"; // Deep Espresso Black
    categoryName = "Modern Minimalist";
  } else if (categoryId === 3) {
    // Vintage Art Deco
    defaultStrokeColor = "#C97A53"; // Antique Bronze
    defaultBgColor = "#FDFBF7"; // Warm Vellum Cream
    categoryName = "Vintage Art Deco";
  } else if (categoryId === 4) {
    // Botanical Garden
    defaultStrokeColor = "#2D5A27"; // Sage / Matcha Green
    defaultBgColor = "#FAF6F0"; // Creamy Alabaster
    categoryName = "Botanical Garden";
  }

  // Allow custom theme color overrides
  const stroke = themeColor || defaultStrokeColor;
  const bg = bgColor || defaultBgColor;

  // Split initials
  const chars = initials.split("").filter(Boolean);
  const firstChar = chars[0] || "H";
  const secondChar = chars[1] || "M";

  // Create different design elements based on the subId (1-25)
  const borderType = subId % 6;
  const accentType = subId % 4;
  const dividerType = subId % 5;
  const letteringLayout = subId % 4;

  // SVG dimensions: ViewBox is 400x400
  return (
    <svg
      id={`wedding-logo-${id}`}
      viewBox="0 0 400 400"
      width={width}
      height={height}
      className="select-none transition-all duration-300"
      style={{ background: bg }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id={`gold-foil-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B38728" />
          <stop offset="25%" stopColor="#FBF5B7" />
          <stop offset="50%" stopColor="#DAA520" />
          <stop offset="75%" stopColor="#FBF5B7" />
          <stop offset="100%" stopColor="#AA771C" />
        </linearGradient>

        <linearGradient id={`silver-chrome-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A5568" />
          <stop offset="25%" stopColor="#CBD5E0" />
          <stop offset="50%" stopColor="#718096" />
          <stop offset="75%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#2D3748" />
        </linearGradient>

        <linearGradient id={`antique-bronze-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8C4F2B" />
          <stop offset="40%" stopColor="#E6A17A" />
          <stop offset="70%" stopColor="#B26C43" />
          <stop offset="100%" stopColor="#5C3117" />
        </linearGradient>

        {/* Drop shadow for presentation */}
        <filter id="subtle-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* Background layer */}
      <rect width="400" height="400" rx="0" fill={bg} />

      {/* Category Specific Graphic Borders and Laurels */}
      {categoryId === 1 && (
        <g id="royal-elements">
          {/* ROYAL CATEGORY (Gold / Traditional luxury) */}
          {borderType === 0 && (
            // Delicate circular laurel wreath
            <g transform="translate(200,200) scale(1)">
              <circle cx="0" cy="0" r="140" fill="none" stroke={stroke} strokeWidth="1" strokeDasharray="3,3" />
              <circle cx="0" cy="0" r="130" fill="none" stroke={stroke} strokeWidth="1.5" />
              {/* Leaves path */}
              <path
                d="M -130,0 C -130,-70 -70,-130 0,-130 C 70,-130 130,-70 130,0"
                fill="none"
                stroke={stroke}
                strokeWidth="1"
              />
              <path
                d="M -130,0 C -130,70 -70,130 0,130 C 70,130 130,70 130,0"
                fill="none"
                stroke={stroke}
                strokeWidth="1"
              />
              {/* Leaf buds */}
              {Array.from({ length: 16 }).map((_, i) => {
                const angle = (i * 360) / 16;
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * 130;
                const y = Math.sin(rad) * 130;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={subId % 2 === 0 ? "3" : "2"}
                    fill={stroke}
                  />
                );
              })}
            </g>
          )}

          {borderType === 1 && (
            // Double luxury ring with internal dots
            <g transform="translate(200,200)">
              <circle cx="0" cy="0" r="145" fill="none" stroke={stroke} strokeWidth="1" />
              <circle cx="0" cy="0" r="138" fill="none" stroke={stroke} strokeWidth="2" />
              <circle cx="0" cy="0" r="126" fill="none" stroke={stroke} strokeWidth="0.5" />
              {Array.from({ length: 36 }).map((_, i) => {
                const angle = (i * 360) / 36;
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * 132;
                const y = Math.sin(rad) * 132;
                return <circle key={i} cx={x} cy={y} r="1.5" fill={stroke} />;
              })}
            </g>
          )}

          {borderType === 2 && (
            // Royal Crest / Shield
            <g transform="translate(200, 195) scale(0.95)">
              <path
                d="M 0,-140 Q 90,-140 120,-80 Q 130,50 0,150 Q -130,50 -120,-80 Q -90,-140 0,-140 Z"
                fill="none"
                stroke={stroke}
                strokeWidth="2"
              />
              <path
                d="M 0,-130 Q 80,-130 110,-75 Q 120,40 0,138 Q -120,40 -110,-75 Q -80,-130 0,-130 Z"
                fill="none"
                stroke={stroke}
                strokeWidth="0.75"
                strokeDasharray="4,4"
              />
            </g>
          )}

          {borderType === 3 && (
            // Hexagon with ornate flourish corners
            <g transform="translate(200,200)">
              <polygon
                points="0,-140 121,-70 121,70 0,140 -121,70 -121,-70"
                fill="none"
                stroke={stroke}
                strokeWidth="1.5"
              />
              <polygon
                points="0,-132 114,-65 114,65 0,132 -114,65 -114,-65"
                fill="none"
                stroke={stroke}
                strokeWidth="0.5"
              />
              {/* Corner dots */}
              <circle cx="0" cy="-140" r="4" fill={stroke} />
              <circle cx="121" cy="-70" r="4" fill={stroke} />
              <circle cx="121" cy="70" r="4" fill={stroke} />
              <circle cx="0" cy="140" r="4" fill={stroke} />
              <circle cx="-121" cy="70" r="4" fill={stroke} />
              <circle cx="-121" cy="-70" r="4" fill={stroke} />
            </g>
          )}

          {borderType === 4 && (
            // Ornate flourish on top & bottom only (No side borders)
            <g transform="translate(200,200)">
              {/* Top Ornate flourishes */}
              <path d="M -120,-130 Q -60,-150 0,-130 Q 60,-150 120,-130" fill="none" stroke={stroke} strokeWidth="1.5" />
              <path d="M -80,-140 Q 0,-165 80,-140" fill="none" stroke={stroke} strokeWidth="0.75" />
              <circle cx="0" cy="-152" r="3" fill={stroke} />
              {/* Bottom Ornate flourishes */}
              <path d="M -120,130 Q -60,150 0,130 Q 60,150 120,130" fill="none" stroke={stroke} strokeWidth="1.5" />
              <path d="M -80,140 Q 0,165 80,140" fill="none" stroke={stroke} strokeWidth="0.75" />
              <circle cx="0" cy="152" r="3" fill={stroke} />
            </g>
          )}

          {borderType === 5 && (
            // Circle with ornate quadrants
            <g transform="translate(200,200)">
              <circle cx="0" cy="0" r="135" fill="none" stroke={stroke} strokeWidth="1.5" />
              <path d="M -145,0 L -125,0" stroke={stroke} strokeWidth="1.5" />
              <path d="M 125,0 L 145,0" stroke={stroke} strokeWidth="1.5" />
              <path d="M 0,-145 L 0,-125" stroke={stroke} strokeWidth="1.5" />
              <path d="M 0,125 L 0,145" stroke={stroke} strokeWidth="1.5" />
              {/* Internal corners */}
              <path d="M -70,-70 Q -95,-95 -120,-70" fill="none" stroke={stroke} strokeWidth="0.75" />
              <path d="M 70,-70 Q 95,-95 120,-70" fill="none" stroke={stroke} strokeWidth="0.75" />
              <path d="M -70,70 Q -95,95 -120,70" fill="none" stroke={stroke} strokeWidth="0.75" />
              <path d="M 70,70 Q 95,95 120,70" fill="none" stroke={stroke} strokeWidth="0.75" />
            </g>
          )}

          {/* Accents for Royal Category */}
          {accentType === 0 && (
            // Royal crown on top
            <g transform="translate(200, 100) scale(0.65)">
              <path
                d="M -30,0 L -40,-25 L -15,-15 L 0,-35 L 15,-15 L 40,-25 L 30,0 Z"
                fill="none"
                stroke={stroke}
                strokeWidth="2"
              />
              <circle cx="0" cy="-39" r="2.5" fill={stroke} />
              <circle cx="-40" cy="-29" r="2" fill={stroke} />
              <circle cx="40" cy="-29" r="2" fill={stroke} />
              <rect x="-25" y="2" width="50" height="4" rx="1" fill={stroke} />
            </g>
          )}

          {accentType === 1 && (
            // Classic Ribbon at the bottom
            <g transform="translate(200, 310) scale(0.8)">
              <path d="M -90,0 Q 0,-15 90,0 L 80,18 Q 0,3 -80,18 Z" fill={bg} stroke={stroke} strokeWidth="1.25" />
              <path d="M -80,18 L -95,30 L -80,24 Z" fill="none" stroke={stroke} strokeWidth="1.25" />
              <path d="M 80,18 L 95,30 L 80,24 Z" fill="none" stroke={stroke} strokeWidth="1.25" />
            </g>
          )}

          {accentType === 2 && (
            // Small stars on top
            <g transform="translate(200, 95)">
              <polygon points="0,-10 3,-3 10,-3 5,2 7,9 0,5 -7,9 -5,2 -10,-3 -3,-3" fill={stroke} />
              <circle cx="-25" cy="-3" r="2" fill={stroke} />
              <circle cx="25" cy="-3" r="2" fill={stroke} />
            </g>
          )}
        </g>
      )}

      {categoryId === 2 && (
        <g id="minimalist-elements">
          {/* MINIMALIST CATEGORY (Silver / Modern chic) */}
          {borderType === 0 && (
            // Single large clean circle
            <circle cx="200" cy="200" r="140" fill="none" stroke={stroke} strokeWidth="1" />
          )}

          {borderType === 1 && (
            // Concentric thin circles
            <g transform="translate(200,200)">
              <circle cx="0" cy="0" r="145" fill="none" stroke={stroke} strokeWidth="0.5" />
              <circle cx="0" cy="0" r="138" fill="none" stroke={stroke} strokeWidth="1" />
            </g>
          )}

          {borderType === 2 && (
            // Clean Square Border with Offset Corners
            <g transform="translate(200,200)">
              <rect x="-120" y="-120" width="240" height="240" fill="none" stroke={stroke} strokeWidth="1" />
              <circle cx="-120" cy="-120" r="3" fill={stroke} />
              <circle cx="120" cy="-120" r="3" fill={stroke} />
              <circle cx="120" cy="120" r="3" fill={stroke} />
              <circle cx="-120" cy="120" r="3" fill={stroke} />
            </g>
          )}

          {borderType === 3 && (
            // Outer cross hair style (Modern compass)
            <g transform="translate(200,200)">
              <circle cx="0" cy="0" r="135" fill="none" stroke={stroke} strokeWidth="1" />
              <line x1="0" y1="-145" x2="0" y2="-125" stroke={stroke} strokeWidth="1" />
              <line x1="0" y1="125" x2="0" y2="145" stroke={stroke} strokeWidth="1" />
              <line x1="-145" y1="0" x2="-125" y2="0" stroke={stroke} strokeWidth="1" />
              <line x1="125" y1="0" x2="145" y2="0" stroke={stroke} strokeWidth="1" />
            </g>
          )}

          {borderType === 4 && (
            // Minimal horizontal lines flanking names (No border)
            <g transform="translate(200,200)">
              <line x1="-130" y1="-120" x2="130" y2="-120" stroke={stroke} strokeWidth="0.75" />
              <line x1="-130" y1="120" x2="130" y2="120" stroke={stroke} strokeWidth="0.75" />
            </g>
          )}

          {borderType === 5 && (
            // Intertwined circular hoops (Olympic/Infinity motif)
            <g transform="translate(200,200)">
              <circle cx="-25" cy="0" r="115" fill="none" stroke={stroke} strokeWidth="0.75" />
              <circle cx="25" cy="0" r="115" fill="none" stroke={stroke} strokeWidth="0.75" />
            </g>
          )}

          {/* Minimalist divider line in middle */}
          {dividerType === 1 && (
            <line x1="200" y1="150" x2="200" y2="250" stroke={stroke} strokeWidth="0.5" strokeDasharray="4,4" />
          )}
          {dividerType === 2 && (
            <line x1="150" y1="200" x2="250" y2="200" stroke={stroke} strokeWidth="0.5" />
          )}
        </g>
      )}

      {categoryId === 3 && (
        <g id="artdeco-elements">
          {/* ART DECO CATEGORY (Bronze / 1920s Symmetrical Symmetry) */}
          {borderType === 0 && (
            // Bold Art Deco octagon
            <g transform="translate(200,200)">
              <polygon points="0,-140 99,-99 140,0 99,99 0,140 -99,99 -140,0 -99,-99" fill="none" stroke={stroke} strokeWidth="2" />
              <polygon points="0,-130 92,-92 130,0 92,92 0,130 -92,92 -130,0 -92,-92" fill="none" stroke={stroke} strokeWidth="0.75" />
              {/* Corner spikes */}
              <line x1="0" y1="-140" x2="0" y2="-150" stroke={stroke} strokeWidth="1.5" />
              <line x1="0" y1="140" x2="0" y2="150" stroke={stroke} strokeWidth="1.5" />
              <line x1="-140" y1="0" x2="-150" y2="0" stroke={stroke} strokeWidth="1.5" />
              <line x1="140" y1="0" x2="150" y2="0" stroke={stroke} strokeWidth="1.5" />
            </g>
          )}

          {borderType === 1 && (
            // Rectangular Art Deco frame with stepped corners
            <g transform="translate(200,200)">
              <path
                d="M -110,-130 L -90,-130 L -90,-145 L 90,-145 L 90,-130 L 110,-130 L 110,-90 L 125,-90 L 125,90 L 110,90 L 110,130 L 90,130 L 90,145 L -90,145 L -90,130 L -110,130 L -110,90 L -125,90 L -125,-90 L -110,-90 Z"
                fill="none"
                stroke={stroke}
                strokeWidth="1.5"
              />
              <path
                d="M -100,-120 L -80,-120 L -80,-135 L 80,-135 L 80,-120 L 100,-120 L 100,-80 L 115,-80 L 115,80 L 100,80 L 100,120 L 80,120 L 80,135 L -80,135 L -80,120 L -100,120 L -100,80 L -115,80 L -115,-80 L -100,-80 Z"
                fill="none"
                stroke={stroke}
                strokeWidth="0.75"
                strokeDasharray="2,2"
              />
            </g>
          )}

          {borderType === 2 && (
            // Concentric diamonds
            <g transform="translate(200,200)">
              <polygon points="0,-145 145,0 0,145 -145,0" fill="none" stroke={stroke} strokeWidth="2" />
              <polygon points="0,-130 130,0 0,130 -130,0" fill="none" stroke={stroke} strokeWidth="0.75" />
              <circle cx="0" cy="0" r="105" fill="none" stroke={stroke} strokeWidth="0.5" strokeDasharray="3,3" />
            </g>
          )}

          {borderType === 3 && (
            // Sunburst radiation rays in background (Art deco classic)
            <g transform="translate(200,200)">
              <circle cx="0" cy="0" r="135" fill="none" stroke={stroke} strokeWidth="1.5" />
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 360) / 24;
                const rad = (angle * Math.PI) / 180;
                const x1 = Math.cos(rad) * 115;
                const y1 = Math.sin(rad) * 115;
                const x2 = Math.cos(rad) * 135;
                const y2 = Math.sin(rad) * 135;
                // Avoid lines overlapping text area
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth="0.75" />;
              })}
            </g>
          )}

          {borderType === 4 && (
            // Parallel triple-lines vertical borders
            <g transform="translate(200,200)">
              <line x1="-120" y1="-140" x2="-120" y2="140" stroke={stroke} strokeWidth="1.5" />
              <line x1="-110" y1="-120" x2="-110" y2="120" stroke={stroke} strokeWidth="0.75" />
              <line x1="-100" y1="-100" x2="-100" y2="100" stroke={stroke} strokeWidth="0.5" />

              <line x1="120" y1="-140" x2="120" y2="140" stroke={stroke} strokeWidth="1.5" />
              <line x1="110" y1="-120" x2="110" y2="120" stroke={stroke} strokeWidth="0.75" />
              <line x1="100" y1="-100" x2="100" y2="100" stroke={stroke} strokeWidth="0.5" />

              {/* Decorative corners */}
              <polygon points="-50,-135 50,-135 0,-155" fill="none" stroke={stroke} strokeWidth="1" />
              <polygon points="-50,135 50,135 0,155" fill="none" stroke={stroke} strokeWidth="1" />
            </g>
          )}

          {borderType === 5 && (
            // Double line circular border with corner block details
            <g transform="translate(200,200)">
              <circle cx="0" cy="0" r="135" fill="none" stroke={stroke} strokeWidth="1" />
              <circle cx="0" cy="0" r="127" fill="none" stroke={stroke} strokeWidth="1.5" />
              {/* Corner accents */}
              <rect x="-95" y="-95" width="20" height="20" fill="none" stroke={stroke} strokeWidth="1" />
              <rect x="75" y="-95" width="20" height="20" fill="none" stroke={stroke} strokeWidth="1" />
              <rect x="75" y="75" width="20" height="20" fill="none" stroke={stroke} strokeWidth="1" />
              <rect x="-95" y="75" width="20" height="20" fill="none" stroke={stroke} strokeWidth="1" />
            </g>
          )}
        </g>
      )}

      {categoryId === 4 && (
        <g id="botanical-elements">
          {/* BOTANICAL GARDEN CATEGORY (Matcha Green / Organic Sage) */}
          {borderType === 0 && (
            // Flowy leaf vine circle (Organic)
            <g transform="translate(200,200)">
              <circle cx="0" cy="0" r="130" fill="none" stroke={stroke} strokeWidth="0.5" strokeDasharray="5,5" />
              {/* Leaf vines drawing */}
              <path
                d="M -120,-40 C -140,40 -40,140 40,120 C 120,100 130,0 100,-70 C 80,-110 0,-130 -60,-110 C -100,-100 -115,-70 -120,-40"
                fill="none"
                stroke={stroke}
                strokeWidth="1.5"
              />
              {/* Eucalyptus leaves */}
              <path d="M -125,-30 Q -145,-35 -135,-15 Q -125,-10 -125,-30" fill={stroke} opacity="0.85" />
              <path d="M -100,50 Q -115,70 -90,75 Q -80,65 -100,50" fill={stroke} opacity="0.85" />
              <path d="M -10,125 Q 0,145 20,135 Q 20,120 -10,125" fill={stroke} opacity="0.85" />
              <path d="M 85,90 Q 110,105 110,80 Q 95,70 85,90" fill={stroke} opacity="0.85" />
              <path d="M 115,-30 Q 135,-45 115,-55 Q 100,-40 115,-30" fill={stroke} opacity="0.85" />
              <path d="M 40,-115 Q 45,-135 25,-130 Q 25,-115 40,-115" fill={stroke} opacity="0.85" />
              <path d="M -50,-115 Q -70,-130 -75,-105 Q -60,-100 -50,-115" fill={stroke} opacity="0.85" />
            </g>
          )}

          {borderType === 1 && (
            // Symmetrical flanking eucalyptus branches (Left & Right)
            <g transform="translate(200,200)">
              {/* Left branch */}
              <path d="M -110,-90 Q -135,0 -100,90" fill="none" stroke={stroke} strokeWidth="1.25" />
              {Array.from({ length: 6 }).map((_, i) => {
                const y = -75 + i * 30;
                const offsetDir = i % 2 === 0 ? 1 : -1;
                return (
                  <path
                    key={`l-${i}`}
                    d={`M -120,${y} Q ${-120 + offsetDir * 18},${y - 12} ${-120 + offsetDir * 12},${y + 12} Z`}
                    fill={stroke}
                    opacity="0.8"
                  />
                );
              })}

              {/* Right branch */}
              <path d="M 110,-90 Q 135,0 100,90" fill="none" stroke={stroke} strokeWidth="1.25" />
              {Array.from({ length: 6 }).map((_, i) => {
                const y = -75 + i * 30;
                const offsetDir = i % 2 === 0 ? -1 : 1;
                return (
                  <path
                    key={`r-${i}`}
                    d={`M 120,${y} Q ${120 + offsetDir * 18},${y - 12} ${120 + offsetDir * 12},${y + 12} Z`}
                    fill={stroke}
                    opacity="0.8"
                  />
                );
              })}
            </g>
          )}

          {borderType === 2 && (
            // Ginkgo Biloba circular frame
            <g transform="translate(200,200)">
              <circle cx="0" cy="0" r="132" fill="none" stroke={stroke} strokeWidth="0.75" />
              {/* Ginkgo leaves on the circle */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * 360) / 8 + 22.5;
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * 132;
                const y = Math.sin(rad) * 132;
                return (
                  <g key={i} transform={`translate(${x},${y}) rotate(${angle + 90})`}>
                    {/* Ginkgo leaf shape fan */}
                    <path
                      d="M 0,0 C -12,-15 -20,-10 -15,5 C -10,12 0,5 0,0 C 0,5 10,12 15,5 C 20,-10 12,-15 0,0"
                      fill={stroke}
                      opacity="0.8"
                    />
                    <line x1="0" y1="0" x2="0" y2="8" stroke={stroke} strokeWidth="1" />
                  </g>
                );
              })}
            </g>
          )}

          {borderType === 3 && (
            // Loose hand-drawn watercolor circle
            <g transform="translate(200,200)">
              <path
                d="M -125,-20 C -135,40 -100,100 -40,125 C 20,135 100,110 125,50 C 135,-10 110,-90 60,-120 C 10,-135 -70,-120 -105,-80 C -125,-55 -125,-20 -125,-20"
                fill="none"
                stroke={stroke}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M -120,-15 C -128,35 -95,90 -45,115 C 15,125 90,105 115,55 C 125,-5 105,-80 55,-110"
                fill="none"
                stroke={stroke}
                strokeWidth="0.75"
                opacity="0.5"
              />
            </g>
          )}

          {borderType === 4 && (
            // Wreath of mixed leaves and berries (Rosemary & Eucalyptus)
            <g transform="translate(200,200)">
              <circle cx="0" cy="0" r="130" fill="none" stroke={stroke} strokeWidth="1.25" />
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 360) / 12;
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * 130;
                const y = Math.sin(rad) * 130;
                return (
                  <g key={i} transform={`translate(${x},${y}) rotate(${angle})`}>
                    <line x1="0" y1="0" x2="10" y2="0" stroke={stroke} strokeWidth="1" />
                    <circle cx="10" cy="-4" r="2.5" fill={stroke} />
                    <circle cx="12" cy="3" r="2" fill={stroke} />
                  </g>
                );
              })}
            </g>
          )}

          {borderType === 5 && (
            // Symmetrical top and bottom botanical arches
            <g transform="translate(200,200)">
              {/* Top floral spray */}
              <path d="M -110,-100 Q 0,-145 110,-100" fill="none" stroke={stroke} strokeWidth="1.25" />
              <circle cx="0" cy="-127" r="3" fill={stroke} />
              <path d="M -40,-125 C -50,-135 -60,-135 -50,-123" fill={stroke} />
              <path d="M 40,-125 C 50,-135 60,-135 50,-123" fill={stroke} />

              {/* Bottom floral spray */}
              <path d="M -110,100 Q 0,145 110,100" fill="none" stroke={stroke} strokeWidth="1.25" />
              <circle cx="0" cy="127" r="3" fill={stroke} />
              <path d="M -40,125 C -50,135 -60,135 -50,123" fill={stroke} />
              <path d="M 40,125 C 50,135 60,135 50,123" fill={stroke} />
            </g>
          )}
        </g>
      )}

      {/* RENDER DYNAMIC WEDDING LETTERING / INITIALS */}
      <g id="initials-lettering">
        {categoryId === 1 && (
          // CLASSIC ROYAL: Ornate, Traditional script & serif pairing
          <g>
            {letteringLayout === 0 && (
              // Shared central interlocked scripts (e.g. H & M)
              <g>
                <text
                  x="165"
                  y="215"
                  fontFamily="'Pinyon Script', 'Great Vibes', cursive"
                  fontSize="120"
                  fill={stroke}
                  textAnchor="middle"
                  style={{ filter: "url(#subtle-shadow)" }}
                >
                  {firstChar}
                </text>
                <text
                  x="200"
                  y="200"
                  fontFamily="'Cinzel', 'Playfair Display', serif"
                  fontSize="24"
                  fontWeight="300"
                  fill={stroke}
                  textAnchor="middle"
                  opacity="0.85"
                >
                  &
                </text>
                <text
                  x="235"
                  y="235"
                  fontFamily="'Pinyon Script', 'Great Vibes', cursive"
                  fontSize="120"
                  fill={stroke}
                  textAnchor="middle"
                  style={{ filter: "url(#subtle-shadow)" }}
                >
                  {secondChar}
                </text>
              </g>
            )}

            {letteringLayout === 1 && (
              // Side-by-side classic serif with central divider
              <g>
                <text
                  x="150"
                  y="210"
                  fontFamily="'Cinzel', 'Playfair Display', serif"
                  fontSize="72"
                  fontWeight="500"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {firstChar}
                </text>
                <text
                  x="200"
                  y="190"
                  fontFamily="'Alex Brush', cursive"
                  fontSize="48"
                  fill={stroke}
                  textAnchor="middle"
                >
                  &
                </text>
                <text
                  x="250"
                  y="210"
                  fontFamily="'Cinzel', 'Playfair Display', serif"
                  fontSize="72"
                  fontWeight="500"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {secondChar}
                </text>
              </g>
            )}

            {letteringLayout === 2 && (
              // Stacked Royal initials
              <g transform="translate(200, 195)">
                <text
                  x="0"
                  y="-10"
                  fontFamily="'Cinzel', serif"
                  fontSize="64"
                  fontWeight="700"
                  letterSpacing="4"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {firstChar}
                </text>
                <line x1="-40" y1="5" x2="40" y2="5" stroke={stroke} strokeWidth="1.5" />
                <text
                  x="0"
                  y="55"
                  fontFamily="'Cinzel', serif"
                  fontSize="56"
                  fontWeight="400"
                  letterSpacing="4"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {secondChar}
                </text>
              </g>
            )}

            {letteringLayout === 3 && (
              // Ornate Single Crest Initials side-by-side with beautiful swirls
              <g>
                <text
                  x="200"
                  y="215"
                  fontFamily="'Alex Brush', 'Great Vibes', cursive"
                  fontSize="125"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {firstChar}
                  <tspan fontSize="40" fontFamily="'Cinzel', serif" dy="-40">
                    {" "}
                    &{" "}
                  </tspan>
                  <tspan fontSize="125" fontFamily="'Alex Brush', cursive" dy="40">
                    {secondChar}
                  </tspan>
                </text>
              </g>
            )}
          </g>
        )}

        {categoryId === 2 && (
          // MODERN MINIMALIST: Clean, ultra-spaced, no-serif
          <g>
            {letteringLayout === 0 && (
              // Separated by a thin vertical line
              <g transform="translate(200, 195)">
                <text
                  x="-45"
                  y="20"
                  fontFamily="'Montserrat', 'Space Grotesk', sans-serif"
                  fontSize="65"
                  fontWeight="200"
                  letterSpacing="2"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {firstChar}
                </text>
                <line x1="0" y1="-45" x2="0" y2="45" stroke={stroke} strokeWidth="1" />
                <text
                  x="45"
                  y="20"
                  fontFamily="'Montserrat', 'Space Grotesk', sans-serif"
                  fontSize="65"
                  fontWeight="200"
                  letterSpacing="2"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {secondChar}
                </text>
              </g>
            )}

            {letteringLayout === 1 && (
              // Minimal initials with an offset "+" sign
              <g>
                <text
                  x="160"
                  y="215"
                  fontFamily="'Montserrat', 'Space Grotesk', sans-serif"
                  fontSize="75"
                  fontWeight="300"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {firstChar}
                </text>
                <text
                  x="200"
                  y="190"
                  fontFamily="'Space Grotesk', sans-serif"
                  fontSize="32"
                  fontWeight="100"
                  fill={stroke}
                  textAnchor="middle"
                  opacity="0.7"
                >
                  +
                </text>
                <text
                  x="240"
                  y="215"
                  fontFamily="'Montserrat', 'Space Grotesk', sans-serif"
                  fontSize="75"
                  fontWeight="300"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {secondChar}
                </text>
              </g>
            )}

            {letteringLayout === 2 && (
              // Clean overlap with bold and thin weights
              <g transform="translate(200, 205)">
                <text
                  x="-25"
                  y="10"
                  fontFamily="'Montserrat', sans-serif"
                  fontSize="80"
                  fontWeight="100"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {firstChar}
                </text>
                <text
                  x="25"
                  y="10"
                  fontFamily="'Montserrat', sans-serif"
                  fontSize="80"
                  fontWeight="400"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {secondChar}
                </text>
              </g>
            )}

            {letteringLayout === 3 && (
              // Stacked modern blocks
              <g transform="translate(200, 185)">
                <text
                  x="0"
                  y="0"
                  fontFamily="'Montserrat', sans-serif"
                  fontSize="48"
                  fontWeight="200"
                  letterSpacing="10"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {firstChar}
                </text>
                <circle cx="0" cy="18" r="2" fill={stroke} />
                <text
                  x="0"
                  y="52"
                  fontFamily="'Montserrat', sans-serif"
                  fontSize="48"
                  fontWeight="200"
                  letterSpacing="10"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {secondChar}
                </text>
              </g>
            )}
          </g>
        )}

        {categoryId === 3 && (
          // VINTAGE ART DECO: Heavy serif, structured, opulent
          <g>
            {letteringLayout === 0 && (
              // Interlocked bold serif letters with geometrical lines
              <g>
                <text
                  x="165"
                  y="215"
                  fontFamily="'Cinzel', serif"
                  fontSize="80"
                  fontWeight="700"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {firstChar}
                </text>
                <text
                  x="200"
                  y="200"
                  fontFamily="'Cinzel', serif"
                  fontSize="24"
                  fontWeight="400"
                  fill={stroke}
                  textAnchor="middle"
                >
                  O
                </text>
                <text
                  x="235"
                  y="215"
                  fontFamily="'Cinzel', serif"
                  fontSize="80"
                  fontWeight="700"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {secondChar}
                </text>
              </g>
            )}

            {letteringLayout === 1 && (
              // Diagonal staggered Art Deco blocks
              <g>
                <text
                  x="165"
                  y="185"
                  fontFamily="'Cinzel', serif"
                  fontSize="70"
                  fontWeight="600"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {firstChar}
                </text>
                <line x1="150" y1="200" x2="250" y2="200" stroke={stroke} strokeWidth="2" />
                <text
                  x="235"
                  y="245"
                  fontFamily="'Cinzel', serif"
                  fontSize="70"
                  fontWeight="600"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {secondChar}
                </text>
              </g>
            )}

            {letteringLayout === 2 && (
              // Concentric Serif with double-lines
              <g transform="translate(200, 205)">
                <text
                  x="0"
                  y="0"
                  fontFamily="'Cinzel', serif"
                  fontSize="90"
                  fontWeight="400"
                  letterSpacing="12"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {firstChar}
                  <tspan fontSize="40" dy="-20">
                    ·
                  </tspan>
                  <tspan fontSize="90" dy="20">
                    {secondChar}
                  </tspan>
                </text>
              </g>
            )}

            {letteringLayout === 3 && (
              // Triple monogram blocks (H-M) inside geometric frame
              <g>
                <rect x="130" y="145" width="140" height="110" fill="none" stroke={stroke} strokeWidth="1.5" />
                <text
                  x="200"
                  y="215"
                  fontFamily="'Cinzel', serif"
                  fontSize="65"
                  fontWeight="700"
                  letterSpacing="12"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {firstChar}
                  {secondChar}
                </text>
              </g>
            )}
          </g>
        )}

        {categoryId === 4 && (
          // BOTANICAL GARDEN: Organic, hand-drawn script
          <g>
            {letteringLayout === 0 && (
              // Elegant script nestled perfectly
              <g>
                <text
                  x="160"
                  y="215"
                  fontFamily="'Pinyon Script', 'Alex Brush', cursive"
                  fontSize="105"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {firstChar}
                </text>
                <text
                  x="200"
                  y="200"
                  fontFamily="'Cormorant Garamond', serif"
                  fontSize="28"
                  fontStyle="italic"
                  fill={stroke}
                  textAnchor="middle"
                >
                  &
                </text>
                <text
                  x="240"
                  y="225"
                  fontFamily="'Pinyon Script', 'Alex Brush', cursive"
                  fontSize="105"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {secondChar}
                </text>
              </g>
            )}

            {letteringLayout === 1 && (
              // Delicate serif with small leaf symbol separating
              <g transform="translate(200, 210)">
                <text
                  x="-45"
                  y="0"
                  fontFamily="'Cormorant Garamond', serif"
                  fontSize="64"
                  fontWeight="300"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {firstChar}
                </text>
                {/* Small leaf branch between */}
                <path d="M -15,-30 Q 0,-20 15,-30 M -5,-25 Q 0,-15 5,-25" fill="none" stroke={stroke} strokeWidth="1" />
                <text
                  x="45"
                  y="0"
                  fontFamily="'Cormorant Garamond', serif"
                  fontSize="64"
                  fontWeight="300"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {secondChar}
                </text>
              </g>
            )}

            {letteringLayout === 2 && (
              // Soft flowy script with long swooping tails
              <g>
                <text
                  x="200"
                  y="215"
                  fontFamily="'Great Vibes', 'Alex Brush', cursive"
                  fontSize="110"
                  fill={stroke}
                  textAnchor="middle"
                  style={{ filter: "url(#subtle-shadow)" }}
                >
                  {firstChar}
                  <tspan fontSize="45" fontFamily="'Cormorant Garamond', serif" fontWeight="300" dy="-25">
                    {" "}
                    and{" "}
                  </tspan>
                  <tspan fontSize="110" fontFamily="'Great Vibes', cursive" dy="25">
                    {secondChar}
                  </tspan>
                </text>
              </g>
            )}

            {letteringLayout === 3 && (
              // Clean serif with a subtle circular botanical border
              <g>
                <text
                  x="200"
                  y="215"
                  fontFamily="'Cormorant Garamond', serif"
                  fontSize="75"
                  fontWeight="400"
                  letterSpacing="8"
                  fill={stroke}
                  textAnchor="middle"
                >
                  {firstChar}
                  <tspan fontSize="36" fontWeight="300" dy="-10">
                    &
                  </tspan>
                  <tspan fontSize="75" dy="10">
                    {secondChar}
                  </tspan>
                </text>
              </g>
            )}
          </g>
        )}
      </g>

      {/* FOOTER TEXT: PARTNER NAMES & DATE */}
      <g id="footer-text">
        {/* Double-check to hide dates in very minimalist layouts if desired, but here we render elegantly */}
        {categoryId === 1 && (
          // Royal classic serif names & date
          <g transform="translate(200, 290)">
            <text
              x="0"
              y="0"
              fontFamily="'Cinzel', serif"
              fontSize="11"
              fontWeight="600"
              letterSpacing="3"
              fill={stroke}
              textAnchor="middle"
            >
              {partner1.toUpperCase()} & {partner2.toUpperCase()}
            </text>
            <text
              x="0"
              y="16"
              fontFamily="'Cormorant Garamond', serif"
              fontSize="10"
              fontWeight="400"
              letterSpacing="2"
              fill={stroke}
              textAnchor="middle"
              opacity="0.8"
            >
              {date}
            </text>
          </g>
        )}

        {categoryId === 2 && (
          // Minimalist clean sans-serif names & date
          <g transform="translate(200, 295)">
            <text
              x="0"
              y="0"
              fontFamily="'Montserrat', sans-serif"
              fontSize="10"
              fontWeight="300"
              letterSpacing="6"
              fill={stroke}
              textAnchor="middle"
            >
              {partner1.toUpperCase()} · {partner2.toUpperCase()}
            </text>
            <text
              x="0"
              y="14"
              fontFamily="'Montserrat', sans-serif"
              fontSize="8"
              fontWeight="200"
              letterSpacing="4"
              fill={stroke}
              textAnchor="middle"
              opacity="0.7"
            >
              {date.replace(/\./g, " / ")}
            </text>
          </g>
        )}

        {categoryId === 3 && (
          // Art deco stylized footer
          <g transform="translate(200, 292)">
            {/* Fine Art Deco divider line */}
            <line x1="-50" y1="-10" x2="50" y2="-10" stroke={stroke} strokeWidth="1" />
            <circle cx="0" cy="-10" r="2.5" fill={stroke} />
            <text
              x="0"
              y="6"
              fontFamily="'Cinzel', serif"
              fontSize="11"
              fontWeight="600"
              letterSpacing="4"
              fill={stroke}
              textAnchor="middle"
            >
              {partner1.toUpperCase()} & {partner2.toUpperCase()}
            </text>
            <text
              x="0"
              y="20"
              fontFamily="'Cinzel', serif"
              fontSize="9"
              fontWeight="400"
              letterSpacing="3"
              fill={stroke}
              textAnchor="middle"
              opacity="0.85"
            >
              {date}
            </text>
          </g>
        )}

        {categoryId === 4 && (
          // Botanical garden serif footer
          <g transform="translate(200, 292)">
            <text
              x="0"
              y="0"
              fontFamily="'Cormorant Garamond', serif"
              fontSize="12"
              fontWeight="500"
              fontStyle="italic"
              letterSpacing="2"
              fill={stroke}
              textAnchor="middle"
            >
              {partner1} & {partner2}
            </text>
            <text
              x="0"
              y="16"
              fontFamily="'Cormorant Garamond', serif"
              fontSize="10"
              fontWeight="400"
              letterSpacing="2"
              fill={stroke}
              textAnchor="middle"
              opacity="0.8"
            >
              {date}
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};
