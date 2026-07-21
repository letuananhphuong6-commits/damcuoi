import React, { useState, useRef, useEffect } from "react";
import {
  Download,
  Sparkles,
  Search,
  RotateCcw,
  Sliders,
  Calendar,
  User,
  Check,
  Heart,
  Palette,
  Maximize2,
  Info,
  Send,
  Loader2,
  Lightbulb,
  X,
  Eye,
  BookOpen
} from "lucide-react";
import { LogoRenderer } from "./components/LogoRenderer";

// Definitions of trends
interface TrendDef {
  name: string;
  vietnameseName: string;
  palette: string;
  material: string;
  venue: string;
  meaning: string;
  midjourneyPrompt: string;
}

const TRENDS: Record<number, TrendDef> = {
  1: {
    name: "Classic Royal",
    vietnameseName: "Cổ Điển Hoàng Gia",
    palette: "Gold foil on white background (Vàng kim trên nền trắng)",
    material: "Vellum translucent paper, hot foil stamping (Giấy vellum xuyên thấu, ép kim nóng)",
    venue: "Classic villa, 5-star grand ballroom (Biệt thự cổ điển, sảnh tiệc 5 sao)",
    meaning: "Sự ấm áp, lộng lẫy, hoàng gia quý tộc",
    midjourneyPrompt: "An elegant wedding monogram logo featuring the intertwined letters \"[INITIALS]\" in an exquisite classical calligraphy style, sharing a fluid stroke, surrounded by a subtle royal laurel wreath, metallic gold foil on a solid flat white background, haute couture wedding branding aesthetic, clean vector line art --ar 1:1 --style raw --stylize 250 --v 6.0 --no photorealistic, colorful, 3d, gradient, mockup, shadows, blur"
  },
  2: {
    name: "Modern Minimalist",
    vietnameseName: "Tối Giản Đương Đại",
    palette: "Silver on matte dark chocolate (Bạc trên nền sô-cô-la tối)",
    material: "Rough woven linen, colorless embossing (Vải linen dệt thô, dập nổi không màu)",
    venue: "Industrial greenhouse, outdoor loft (Không gian công nghiệp, nhà kính sân vườn)",
    meaning: "Sự thanh lịch, hiện đại, mang hơi thở đương đại Châu Âu",
    midjourneyPrompt: "A sleek modern wedding monogram logo with letters \"[INITIALS]\" separated by a thin minimalist vertical line, contemporary sans-serif typography, wide kerning, refined layout, pure silver finish on a solid matte dark chocolate background, high-end editorial aesthetic, sharp geometric edges --ar 1:1 --style raw --stylize 150 --v 6.0 --no serif, floral, decorative, 3d, gradient, mockup, background-noise"
  },
  3: {
    name: "Vintage Art Deco",
    vietnameseName: "Hoài Cổ Sang Trọng",
    palette: "Bronze on white background (Đồng cổ trên nền trắng)",
    material: "Coarse art paper, 1920s geometric framing (Giấy mỹ thuật thô, khung hình học đối xứng)",
    venue: "Retro ballroom, historical heritage estate (Sảnh tiệc hoài cổ, biệt thự phong cách Đông Dương)",
    meaning: "Sự trường tồn, tôn kính, lộng lẫy và giàu dấu ấn thời gian",
    midjourneyPrompt: "A sophisticated wedding monogram logo featuring letters \"[INITIALS]\" intertwined, luxury Art Deco geometric style, sleek metallic bronze lines, symmetrical frame, opulent 1920s glamour, flat graphic design, white background --ar 1:1 --style raw --stylize 200 --v 6.0 --no color, gradient, photorealistic, 3d, shadows, mockup"
  },
  4: {
    name: "Botanical Garden",
    vietnameseName: "Nghệ Thuật Thiên Nhiên",
    palette: "Matcha green on cream background (Xanh matcha trên nền kem)",
    material: "Eco-fibers, recycled vellum paper (Sợi hữu cơ, giấy tái chế thân thiện môi trường)",
    venue: "Garden party, rustic bohemian woodland (Sân vườn ngoài trời, tiệc cưới Rustic)",
    meaning: "Sự lãng mạn, thanh mát, gần gũi và hòa quyện với tự nhiên",
    midjourneyPrompt: "A romantic botanical wedding crest logo, featuring delicate intertwined initials \"[INITIALS]\" surrounded by a hand-drawn vintage wreath of eucalyptus and ginkgo leaves, fine line art style, matcha green on a solid cream background, organic luxury aesthetic, flat emblem --ar 1:1 --style raw --stylize 300 --v 6.0 --no colorful, 3d render, mockup, gradient, shadows"
  }
};

const COLOR_PRESETS = [
  { name: "Sophisticated Dark", stroke: "#c5a059", bg: "#0a0a0a", dark: true },
  { name: "Gold Foil", stroke: "#D4AF37", bg: "#FFFFFF", dark: false },
  { name: "Champagne Pearl", stroke: "#C5B358", bg: "#FDFBF7", dark: false },
  { name: "Royal Midnight", stroke: "#F7FAFC", bg: "#0F172A", dark: true },
  { name: "Matte Silver", stroke: "#A0AEC0", bg: "#121212", dark: true },
  { name: "Sage Matcha", stroke: "#2D5A27", bg: "#FAF6F0", dark: false },
  { name: "Antique Bronze", stroke: "#B26C43", bg: "#FAF8F5", dark: false },
  { name: "Rose Velvet", stroke: "#B05C6F", bg: "#FFF9FA", dark: false },
  { name: "Forest Copper", stroke: "#D27D2D", bg: "#1C2E24", dark: true }
];

export default function App() {
  // --- States ---
  const [initials, setInitials] = useState("HM");
  const [partner1, setPartner1] = useState("Hậu");
  const [partner2, setPartner2] = useState("My");
  const [weddingDate, setWeddingDate] = useState("20.07.2026");

  // Custom Colors
  const [strokeColor, setStrokeColor] = useState("#c5a059");
  const [backgroundColor, setBackgroundColor] = useState("#0a0a0a");
  const [isBgDark, setIsBgDark] = useState(true);

  // Layout filter state
  const [activeTab, setActiveTab] = useState<"all" | "royal" | "minimal" | "deco" | "botanical">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Inspect Modal States
  const [inspectedId, setInspectedId] = useState<number | null>(null);
  const [goboProjected, setGoboProjected] = useState(false);
  const [mockupView, setMockupView] = useState<"flat" | "wax" | "paper" | "embroidery">("flat");

  // AI Consult State
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "Xin kính chào cặp đôi! Tôi là cố vấn thương hiệu tiệc cưới cao cấp của bạn. Dựa trên nghiên cứu xu hướng 2026 mới nhất, tôi sẵn sàng tư vấn cho bạn cách thiết kế, in ấn, chọn chất liệu hay chiếu GOBO ánh sáng cho logo của bạn. Bạn muốn bắt đầu từ đâu?"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Generate 100 logo IDs
  const allLogoIds = Array.from({ length: 100 }, (_, i) => i + 1);

  // Search/Filter matching rules
  const getFilteredLogos = () => {
    return allLogoIds.filter((id) => {
      // Tab filter
      const categoryId = Math.ceil(id / 25);
      if (activeTab === "royal" && categoryId !== 1) return false;
      if (activeTab === "minimal" && categoryId !== 2) return false;
      if (activeTab === "deco" && categoryId !== 3) return false;
      if (activeTab === "botanical" && categoryId !== 4) return false;

      // Search query filter (sub-attributes based on indices)
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const subId = ((id - 1) % 25) + 1;
        const borderType = subId % 6;
        const accentType = subId % 4;

        let tags: string[] = [];
        if (categoryId === 1) tags.push("royal", "hoàng gia", "laurel", "vòng nguyệt quế", "crown", "vương miện", "gold", "vàng", "thư pháp");
        if (categoryId === 2) tags.push("minimal", "tối giản", "silver", "bạc", "cross", "line", "trục đứng", "chữ không chân");
        if (categoryId === 3) tags.push("deco", "art deco", "hoài cổ", "bronze", "đồng", "hexagon", "lục giác", "octagon", "bát giác", "sunburst", "tia sáng");
        if (categoryId === 4) tags.push("botanical", "thiên nhiên", "organic", "eucalyptus", "bạch đàn", "ginkgo", "rẻ quạt", "lá", "hoa", "boho");

        // Add design variations tags
        if (borderType === 0) tags.push("wreath", "vòng nguyệt quế", "tròn", "circle");
        if (borderType === 1) tags.push("double", "kép", "ring", "tròn");
        if (borderType === 2) tags.push("shield", "crest", "khiên", "huy hiệu");
        if (borderType === 3) tags.push("hexagon", "polygon", "lục giác", "góc cạnh");
        if (borderType === 4) tags.push("flourish", "accents", "hoa văn");
        if (borderType === 5) tags.push("quadrants", "cross", "phân khu");

        if (accentType === 0) tags.push("crown", "vương miện");
        if (accentType === 1) tags.push("ribbon", "dải băng");
        if (accentType === 2) tags.push("star", "ngôi sao");

        const matchesQuery = tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesQuery) return false;
      }

      return true;
    });
  };

  const filteredLogos = getFilteredLogos();

  // Apply color presets
  const handleApplyPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setStrokeColor(preset.stroke);
    setBackgroundColor(preset.bg);
    setIsBgDark(preset.dark);
  };

  // Reset parameters
  const handleReset = () => {
    setInitials("HM");
    setPartner1("Hậu");
    setPartner2("My");
    setWeddingDate("20.07.2026");
    setStrokeColor("#c5a059");
    setBackgroundColor("#0a0a0a");
    setIsBgDark(true);
    setActiveTab("all");
    setSearchQuery("");
  };

  // --- Export SVG ---
  const downloadSVG = (id: number) => {
    const svgElement = document.getElementById(`wedding-logo-${id}`);
    if (!svgElement) return;

    // Grab SVG string
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `monogram_wedding_${partner1}_${partner2}_style_${id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // --- Export 2K PNG (2048x2048) ---
  const download2KPNG = (id: number) => {
    const svgElement = document.getElementById(`wedding-logo-${id}`);
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      // Setup canvas for 2K
      const canvas = document.createElement("canvas");
      canvas.width = 2048;
      canvas.height = 2048;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // High quality scale smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Draw image stretched to 2K bounding box
        ctx.drawImage(img, 0, 0, 2048, 2048);

        // Convert to dataURL & trigger download
        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = `monogram_wedding_${partner1}_${partner2}_style_${id}_2K.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      URL.revokeObjectURL(url);
    };
  };

  // --- Send Message to Gemini AI Consultant ---
  const handleSendQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || aiLoading) return;

    const userText = chatInput.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setAiLoading(true);

    // Pick active trend category name
    const activeCategoryNum = inspectedId ? Math.ceil(inspectedId / 25) : 1;
    const activeTrend = TRENDS[activeCategoryNum].name;

    try {
      const response = await fetch("/api/gemini/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initials,
          partner1,
          partner2,
          theme: activeTrend,
          customQuestion: userText,
          venue: TRENDS[activeCategoryNum].venue
        })
      });

      const data = await response.json();
      if (data.success && data.advice) {
        setMessages((prev) => [...prev, { sender: "ai", text: data.advice }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: `Rất tiếc, tôi không thể hoàn tất câu trả lời do: ${data.error || "Lỗi bất định"}. Tuy nhiên, theo cẩm nang cưới 2026, đối với style ${activeTrend}, bạn hãy chọn in dập nổi không màu trên giấy mỹ thuật cao cấp để logo đạt chiều sâu xúc giác hoàn hảo nhất.`
          }
        ]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Xin thứ lỗi, hệ thống đang gặp gián đoạn kết nối. Nhưng đừng lo lắng, tôi khuyên bạn nên chiếu đèn GOBO sử dụng đĩa thủy tinh Size B tại sảnh để đạt được độ nét quang học vượt trội, không bị méo viền."
        }
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  // Keep chat scroll at bottom
  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiLoading]);

  // Handle Quick advice from prompt
  const handleQuickConsult = (topic: string) => {
    setChatInput(topic);
    setTimeout(() => {
      const submitBtn = document.getElementById("send-chat-btn");
      if (submitBtn) submitBtn.click();
    }, 100);
  };

  // Get current inspected details
  const currentCategoryNum = inspectedId ? Math.ceil(inspectedId / 25) : 1;
  const currentTrend = TRENDS[currentCategoryNum];
  const midjourneyPromptFilled = currentTrend
    ? currentTrend.midjourneyPrompt.replace("[INITIALS]", initials.toUpperCase())
    : "";

  return (
    <div id="wedding-workspace-root" className="relative min-h-screen bg-[#0a0a0a] text-[#e5e5e5] flex flex-col font-serif overflow-hidden select-none">
      
      {/* Subtle background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: "radial-gradient(#c5a059 0.5px, transparent 0.5px)", backgroundSize: "20px 20px" }}></div>

      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#c5a059]/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-ambient pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#332a1f]/40 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-ambient pointer-events-none" style={{ animationDelay: "2s" }}></div>
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-[#c5a059]/5 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-ambient pointer-events-none" style={{ animationDelay: "4s" }}></div>

      {/* LUXURY APP HEADER BAR */}
      <header id="luxury-header" className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#332a1f] px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-[#c5a059] text-black p-2.5 rounded-xl shadow-md">
            <Heart className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-cinzel font-light tracking-[0.1em] text-[#e5e5e5]">
              100 LOGO CƯỚI CAO CẤP <span className="text-[#c5a059] font-normal">2026</span>
            </h1>
            <p className="text-[10px] font-sans text-[#c5a059] tracking-[0.2em] uppercase mt-0.5">
              Family Branding & Monogram Studio · Hậu & My Exclusive
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 bg-[#0d0d0d] text-[#c5a059] px-3.5 py-1.5 rounded-full text-xs font-sans font-medium border border-[#332a1f]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>2K Ultra-HD Vectors Only</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-[#0d0d0d] text-[#888] px-3.5 py-1.5 rounded-full text-xs font-sans font-medium border border-[#1a1a1a]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>2026 Trend Guidelines</span>
          </div>
        </div>
      </header>

      {/* CORE WORKSPACE CONTAINER */}
      <main id="main-workspace-grid" className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: CUSTOMIZATION & CONTROLS (4 cols) */}
        <section id="customization-panel" className="lg:col-span-4 bg-[#0d0d0d] rounded-3xl border border-[#332a1f] shadow-2xl p-5 lg:p-6 h-fit sticky top-24 z-20 space-y-6 text-[#e5e5e5]">
          <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-4">
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-[#c5a059]" />
              <h2 className="text-lg font-cinzel font-light tracking-wider text-[#c5a059]">BỘ TÙY CHỈNH CHỈ SỐ</h2>
            </div>
            <button
              onClick={handleReset}
              className="text-[#888] hover:text-[#c5a059] transition-colors duration-200 p-1.5 rounded-lg hover:bg-[#1a1a1a]"
              title="Khôi phục mặc định"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Form Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-serif text-[#888] uppercase tracking-[0.15em] mb-1.5 flex items-center justify-between">
                <span>Chữ viết tắt (Initials)</span>
                <span className="text-[#555] text-[10px] lowercase font-normal">(Tối đa 3 ký tự)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={3}
                  value={initials}
                  onChange={(e) => setInitials(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#1a1a1a] focus:border-[#c5a059] rounded-xl px-4 py-3 text-lg font-cinzel font-bold text-[#e5e5e5] tracking-wider focus:outline-none focus:ring-1 focus:ring-[#c5a059] transition-all duration-200 uppercase"
                />
                <span className="absolute right-3.5 top-3.5 text-xs font-semibold text-[#c5a059]">
                  {initials.length}/3
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-serif text-[#888] uppercase tracking-[0.15em] mb-1.5 flex items-center space-x-1">
                  <User className="w-3 h-3 text-[#555]" />
                  <span>Cô dâu / Chú rể 1</span>
                </label>
                <input
                  type="text"
                  value={partner1}
                  onChange={(e) => setPartner1(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#1a1a1a] focus:border-[#c5a059] rounded-xl px-3 py-2.5 text-sm font-medium text-[#e5e5e5] focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-serif text-[#888] uppercase tracking-[0.15em] mb-1.5 flex items-center space-x-1">
                  <User className="w-3 h-3 text-[#555]" />
                  <span>Cô dâu / Chú rể 2</span>
                </label>
                <input
                  type="text"
                  value={partner2}
                  onChange={(e) => setPartner2(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#1a1a1a] focus:border-[#c5a059] rounded-xl px-3 py-2.5 text-sm font-medium text-[#e5e5e5] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif text-[#888] uppercase tracking-[0.15em] mb-1.5 flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-[#555]" />
                <span>Ngày kỷ niệm (Wedding Date)</span>
              </label>
              <input
                type="text"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                placeholder="Ví dụ: 20.07.2026"
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] focus:border-[#c5a059] rounded-xl px-4 py-2.5 text-sm font-medium text-[#e5e5e5] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Color Palettes */}
          <div className="space-y-4 pt-2 border-t border-[#1a1a1a]">
            <div>
              <label className="block text-xs font-serif text-[#888] uppercase tracking-[0.15em] mb-2 flex items-center space-x-1.5">
                <Palette className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Preset màu sắc quý tộc (2026)</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_PRESETS.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => handleApplyPreset(preset)}
                    className="group relative h-9 w-full rounded-lg border border-[#1a1a1a] hover:border-[#c5a059] overflow-hidden flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                    style={{ background: preset.bg }}
                    title={preset.name}
                  >
                    <div
                      className="w-5 h-5 rounded-full border border-black/10"
                      style={{ background: preset.stroke }}
                    ></div>
                    {strokeColor === preset.stroke && backgroundColor === preset.bg && (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white mix-blend-difference" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Manual Colors */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[10px] font-sans font-bold text-[#888] uppercase tracking-wider mb-1">Màu Họa tiết (Stroke)</label>
                <div className="flex items-center space-x-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-2.5 py-1.5">
                  <input
                    type="color"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="w-6 h-6 border-0 rounded cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono font-medium text-[#888] uppercase">{strokeColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-sans font-bold text-[#888] uppercase tracking-wider mb-1">Màu nền (Canvas)</label>
                <div className="flex items-center space-x-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-2.5 py-1.5">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => {
                      setBackgroundColor(e.target.value);
                      // Auto detect dark/light background brightness
                      const hex = e.target.value.replace("#", "");
                      const r = parseInt(hex.substring(0, 2), 16);
                      const g = parseInt(hex.substring(2, 4), 16);
                      const b = parseInt(hex.substring(4, 6), 16);
                      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                      setIsBgDark(brightness < 128);
                    }}
                    className="w-6 h-6 border-0 rounded cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono font-medium text-[#888] uppercase">{backgroundColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines Box */}
          <div className="bg-[#0a0a0a] rounded-2xl p-4 border border-[#332a1f] text-xs space-y-2.5 text-[#888]">
            <div className="flex items-center space-x-1 text-[#c5a059] font-serif font-semibold tracking-wider">
              <Info className="w-3.5 h-3.5" />
              <span>Tiêu chuẩn In ấn & Laser-Cut</span>
            </div>
            <p className="leading-relaxed">
              Tất cả 100 logo bên dưới đều được thiết kế theo tỷ lệ 1:1 chuẩn quốc tế, cấu trúc phẳng tuyệt đối để tránh lỗi in vỡ hình, sẵn sàng đưa vào khắc dấu sáp, dập nổi hoặc làm khuôn kim loại thiệp cưới vellum.
            </p>
          </div>
        </section>

        {/* RIGHT COLUMN: LOGO GALLERY & VIEWING AREA (8 cols) */}
        <section id="gallery-workspace" className="lg:col-span-8 flex flex-col space-y-6">
          
          {/* SEARCH & FILTER TABS BAR */}
          <div className="bg-[#0d0d0d] rounded-3xl border border-[#332a1f] shadow-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {[
                { id: "all", label: "Tất cả (100)" },
                { id: "royal", label: "Cổ Điển Hoàng Gia" },
                { id: "minimal", label: "Tối Giản Đương Đại" },
                { id: "deco", label: "Art Deco Quý Phái" },
                { id: "botanical", label: "Thiên Nhiên Sân Vườn" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.8 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    activeTab === tab.id
                      ? "bg-[#c5a059] text-black font-bold shadow-md"
                      : "bg-[#0a0a0a] text-[#888] hover:text-[#e5e5e5] border border-[#1a1a1a] hover:border-[#332a1f]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Live Search input */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Tìm họa tiết: vương miện, lá, tròn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] focus:border-[#c5a059] rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-[#e5e5e5] placeholder-[#555] focus:outline-none transition-all"
              />
              <Search className="w-3.5 h-3.5 text-[#555] absolute left-3 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-[#555] hover:text-[#c5a059] p-0.5 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* GALLERY GRID (The 100 Logos) */}
          <div className="bg-[#0d0d0d] rounded-3xl p-5 border border-[#332a1f] min-h-[500px]">
            {filteredLogos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" id="logo-grid-container">
                {filteredLogos.map((id) => {
                  const catId = Math.ceil(id / 25);
                  let catBadgeColor = "bg-[#332a1f] text-[#c5a059] border-[#c5a059]/30";
                  let styleLabel = "Royal";
                  if (catId === 2) {
                    catBadgeColor = "bg-[#1a1a1a] text-[#aaa] border-[#888]/20";
                    styleLabel = "Minimal";
                  } else if (catId === 3) {
                    catBadgeColor = "bg-[#221c15] text-[#b48d4c] border-[#b48d4c]/20";
                    styleLabel = "Art Deco";
                  } else if (catId === 4) {
                    catBadgeColor = "bg-[#122216] text-[#6bb07c] border-[#6bb07c]/20";
                    styleLabel = "Botanical";
                  }

                  return (
                    <div
                      key={id}
                      className="group relative bg-[#050505] rounded-2xl border border-[#1a1a1a] hover:border-[#c5a059] overflow-hidden shadow-md luxury-hover cursor-pointer p-2 aspect-square flex flex-col justify-between transition-all duration-300"
                      onClick={() => setInspectedId(id)}
                    >
                      {/* Logo Preview Wrapper */}
                      <div className="flex-1 w-full flex items-center justify-center p-2">
                        <LogoRenderer
                          id={id}
                          initials={initials}
                          partner1={partner1}
                          partner2={partner2}
                          date={weddingDate}
                          themeColor={strokeColor}
                          bgColor={backgroundColor}
                        />
                      </div>

                      {/* Info Overlays */}
                      <div className="flex items-center justify-between px-2 pb-1.5 pt-1.5 border-t border-[#1a1a1a]">
                        <span className="text-[10px] font-mono font-bold text-[#555]">
                          #{String(id).padStart(3, "0")}
                        </span>
                        <span className={`text-[9px] font-semibold tracking-wide px-2 py-0.5 rounded-full border ${catBadgeColor}`}>
                          {styleLabel}
                        </span>
                      </div>

                      {/* Quick Hover Actions Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 backdrop-blur-[1px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectedId(id);
                          }}
                          className="bg-[#c5a059] hover:bg-[#b48d4c] text-black p-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center space-x-1 text-xs font-semibold"
                        >
                          <Eye className="w-4 h-4 text-black" />
                          <span>Chi tiết</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-[#555]">
                <Search className="w-12 h-12 text-[#1a1a1a] mb-4" strokeWidth={1.5} />
                <h3 className="font-cinzel font-bold text-lg text-[#e5e5e5]">KHÔNG TÌM THẤY LOGO</h3>
                <p className="text-sm text-[#888] mt-1 max-w-sm text-center font-sans">
                  Không tìm thấy họa tiết tương ứng với từ khóa "{searchQuery}". Hãy thử lại với các từ như "vành", "đá", "vương miện", "lá" hoặc "chữ".
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 bg-[#0a0a0a] border border-[#332a1f] text-[#c5a059] px-4 py-2 rounded-xl text-xs font-semibold shadow-md hover:bg-[#1a1a1a] transition-colors"
                >
                  Xóa bộ lọc tìm kiếm
                </button>
              </div>
            )}
          </div>

          {/* BRANDING GUIDE & SPECIFICATIONS SECTION */}
          <div className="bg-[#0d0d0d] rounded-3xl border border-[#332a1f] shadow-xl p-5 lg:p-6 space-y-4">
            <h3 className="text-md font-cinzel font-light text-[#e5e5e5] flex items-center space-x-2 border-b border-[#1a1a1a] pb-3">
              <BookOpen className="w-4.5 h-4.5 text-[#c5a059]" />
              <span className="tracking-wide">CẨM NANG THIẾT KẾ VÀ TRÌNH CHIẾU SỰ KIỆN 2026</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#888]">
              <div className="space-y-2.5">
                <h4 className="font-semibold text-[#c5a059] flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-[#c5a059] rounded-full"></span>
                  <span>1. Khắc dấu sáp & Thêu thủ công</span>
                </h4>
                <p className="leading-relaxed pl-3 text-[#888]">
                  Đối với con dấu sáp (wax seal), bạn nên chọn các logo có mã ID thuộc nhóm <strong>Classic Royal (1-25)</strong> hoặc <strong>Botanical Garden (76-100)</strong> vì các nét vẽ uốn lượn lồng ghép sẽ tạo độ bám sáp cực kỳ sâu, sáp nóng chảy dễ điền đầy khuôn mang lại tỷ lệ nét chữ vô cùng hoàn mỹ.
                </p>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-semibold text-[#c5a059] flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-[#c5a059] rounded-full"></span>
                  <span>2. Tiêu chuẩn GOBO Projector</span>
                </h4>
                <p className="leading-relaxed pl-3 text-[#888]">
                  Nhà tổ chức tiệc cưới khuyên dùng đĩa <strong>Glass Gobo (Thủy tinh khắc laser)</strong> thay vì đĩa phim nhựa mỏng giá rẻ (chỉ chạy được tối đa 6 giờ). Đĩa thủy tinh giúp logo <strong>Hậu & My</strong> sáng rõ nét đến từng chi tiết hoa văn mảnh nhất mà không bị biến dạng do nhiệt lượng lớn từ bóng đèn.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- FLOATING GEMINI AI WEDDING ASSISTANT PANEL --- */}
      <section id="ai-chat-assistant-panel" className="max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 gap-6">
        <div className="bg-[#0d0d0d] rounded-3xl border border-[#332a1f] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* AI Banner / Intro (5 cols) */}
          <div className="md:col-span-5 bg-gradient-to-br from-[#0d0d0d] to-[#050505] p-6 lg:p-8 text-white flex flex-col justify-between space-y-6 border-r border-[#1a1a1a]">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-1 bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/20 px-3 py-1 rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Powered by Gemini 3.5 Flash</span>
              </div>
              <h3 className="text-2xl font-cinzel font-light tracking-wider">
                AI Cố Vấn Thương Hiệu Đám Cưới
              </h3>
              <p className="text-[#888] text-xs leading-relaxed font-sans">
                Được huấn luyện đặc biệt dựa trên tài liệu xu hướng tiệc cưới cao cấp năm 2026. Hãy đặt bất kỳ câu hỏi nào về cách áp dụng, in ấn vellum, thêu chỉ nổi hay chọn cấu hình thiết bị chiếu sáng GOBO tốt nhất tại sảnh tiệc của bạn.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#1a1a1a] text-xs">
              <span className="text-[#555] font-semibold uppercase tracking-wider block">Gợi ý chủ đề hỏi nhanh:</span>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleQuickConsult("Tôi nên in logo cưới HM trên loại giấy vellum nào và dập nổi kim loại như thế nào để sang trọng nhất?")}
                  className="text-left text-[#c5a059] hover:text-[#e5e5e5] transition-colors flex items-center space-x-1.5"
                >
                  <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Cách in ép kim logo trên thiệp giấy vellum?</span>
                </button>
                <button
                  onClick={() => handleQuickConsult("Tôi muốn mua máy chiếu GOBO cho sảnh tiệc, hãy phân tích độ phân giải 1920x1080 và công nghệ DLP cho logo HM?")}
                  className="text-left text-[#c5a059] hover:text-[#e5e5e5] transition-colors flex items-center space-x-1.5"
                >
                  <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Thông số chiếu GOBO sảnh tiệc cưới rộng?</span>
                </button>
                <button
                  onClick={() => handleQuickConsult("Tạo prompt viết lại cho Midjourney v6 phong cách Botanical Garden lộng lẫy cho cặp đôi Hậu và My")}
                  className="text-left text-[#c5a059] hover:text-[#e5e5e5] transition-colors flex items-center space-x-1.5"
                >
                  <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Viết Prompt Midjourney v6/v7 tối ưu nhất?</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Chat Window (7 cols) */}
          <div className="md:col-span-7 flex flex-col h-[400px] bg-[#0a0a0a]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" id="ai-chat-messages-container">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#c5a059] text-black font-semibold shadow-md rounded-br-none"
                        : "bg-[#0d0d0d] text-[#e5e5e5] border border-[#1a1a1a] shadow-sm rounded-bl-none"
                    }`}
                  >
                    {msg.sender === "ai" ? (
                      <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                    ) : (
                      <p>{msg.text}</p>
                    )}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4 shadow-sm flex items-center space-x-2 text-xs text-[#888]">
                    <Loader2 className="w-4 h-4 animate-spin text-[#c5a059]" />
                    <span>Cố vấn AI đang phân tích tài liệu nghiên cứu và soạn thảo tư vấn...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendQuery} className="p-3 bg-[#0d0d0d] border-t border-[#1a1a1a] flex items-center space-x-2">
              <input
                type="text"
                placeholder="Hỏi AI về cách ứng dụng logo, in ấn vellum, chiếu đèn sảnh..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#c5a059] focus:bg-[#050505] text-[#e5e5e5] transition-all"
              />
              <button
                type="submit"
                id="send-chat-btn"
                disabled={aiLoading}
                className="bg-[#c5a059] hover:bg-[#b48d4c] disabled:bg-[#1a1a1a] disabled:text-[#555] text-black p-2.5 rounded-xl transition-all active:scale-95 shadow-md flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* FOOTER COOLDOWN BRANDING */}
      <footer className="bg-[#050505] text-[#888] py-10 px-6 border-t border-[#332a1f] mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-center md:text-left">
          <div className="space-y-1">
            <p className="font-cinzel text-[#c5a059] font-light tracking-[0.2em] text-sm">HẬU & MY 2026</p>
            <p className="font-sans text-[#555]">Tuyển tập 100 tác phẩm monogram đám cưới đẳng cấp hoàng gia & tinh tế phẳng.</p>
          </div>
          <div className="text-[#555] font-sans">
            <p>© 2026 Wedding Family Branding. Thiết kế độc bản cho ngày hạnh phúc nhất đời.</p>
          </div>
        </div>
      </footer>

      {/* --- INSPECTION MODAL (ZOOMED VIEW & DOWNLOADS) --- */}
      {inspectedId !== null && (
        <div id="logo-inspect-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="relative bg-[#0d0d0d] rounded-3xl shadow-2xl border border-[#332a1f] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row text-[#e5e5e5]">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setInspectedId(null);
                setGoboProjected(false);
                setMockupView("flat");
              }}
              className="absolute right-4 top-4 z-10 bg-[#0a0a0a] hover:bg-[#1a1a1a] text-[#888] hover:text-[#c5a059] p-2 rounded-full transition-colors border border-[#1a1a1a]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left side: Graphics Viewer */}
            <div className="md:w-1/2 bg-[#050505] p-6 flex flex-col items-center justify-center relative min-h-[320px] md:min-h-[480px] border-r border-[#1a1a1a]">
              
              {/* Gobo Projection Simulator View */}
              {goboProjected ? (
                <div className="absolute inset-0 bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
                  
                  {/* Dance Floor texture simulation under GOBO projection */}
                  <div className="w-full h-full relative flex items-center justify-center" style={{ background: "radial-gradient(circle, #332a1f 0%, #0d0d0d 70%, #020202 100%)" }}>
                    
                    {/* Simulated light beam cone overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#c5a059]/5 to-[#c5a059]/10 pointer-events-none mix-blend-screen"></div>

                    {/* Highly glowing white monogram representing high intensity light projection */}
                    <div
                      className="w-64 h-64 scale-95 transition-all duration-700 filter blur-[0.4px]"
                      style={{
                        filter: "drop-shadow(0 0 15px rgba(251,245,183,0.95)) drop-shadow(0 0 35px rgba(197,160,89,0.4))",
                      }}
                    >
                      <LogoRenderer
                        id={inspectedId}
                        initials={initials}
                        partner1={partner1}
                        partner2={partner2}
                        date={weddingDate}
                        themeColor="#FFFDD0" // Warm light colored light beam projection
                        bgColor="transparent"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <span className="text-[10px] font-mono tracking-widest text-[#c5a059] uppercase">
                      GOBO PROJECTION SIMULATION (Size B Glass Disk)
                    </span>
                  </div>
                </div>
              ) : mockupView === "wax" ? (
                // WAX SEAL MOCKUP PREVIEW
                <div className="absolute inset-0 bg-[#120507] flex flex-col items-center justify-center p-6">
                  <div className="w-64 h-64 rounded-full bg-[#800C1F] flex items-center justify-center shadow-2xl relative overflow-hidden border-4 border-[#800C1F]/80">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/30 pointer-events-none"></div>
                    {/* Outer wax drip effect ring */}
                    <div className="absolute inset-2 rounded-full border-[3px] border-double border-white/20"></div>
                    <div className="w-52 h-52 opacity-85 scale-80" style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.6)) drop-shadow(-1px -1px 2px rgba(255,255,255,0.15))" }}>
                      <LogoRenderer
                        id={inspectedId}
                        initials={initials}
                        partner1={partner1}
                        partner2={partner2}
                        date={weddingDate}
                        themeColor="#5C0512" // Deep debossed indent coloring
                        bgColor="transparent"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-4 text-center">
                    <span className="text-[10px] font-semibold text-[#888] uppercase tracking-widest">
                      Con dấu sáp niêm phong (Luxury Scarlet Wax Seal)
                    </span>
                  </div>
                </div>
              ) : mockupView === "paper" ? (
                // VELLUM LETTERPRESS EMBOSSING PREVIEW
                <div className="absolute inset-0 bg-[#181612] flex flex-col items-center justify-center p-6">
                  <div className="w-64 h-[320px] bg-[#0d0d0d] rounded-lg shadow-xl p-6 border border-[#332a1f] flex flex-col justify-between">
                    <div className="text-[9px] font-mono tracking-widest text-[#555] text-center uppercase border-b border-[#1a1a1a] pb-2">
                      WEDDING STATIONERY PREVIEW
                    </div>
                    <div className="flex-1 flex items-center justify-center opacity-80 py-4 scale-90" style={{ filter: "drop-shadow(1px 1px 1px #fff) drop-shadow(-1px -1px 1px rgba(0,0,0,0.12))" }}>
                      <LogoRenderer
                        id={inspectedId}
                        initials={initials}
                        partner1={partner1}
                        partner2={partner2}
                        date={weddingDate}
                        themeColor="#C0A060" // Elegant subtle stamp foil color
                        bgColor="transparent"
                      />
                    </div>
                    <div className="text-center text-[8px] font-sans text-[#888]">
                      Vellum Paper 250gsm · Gold Foil Embossed
                    </div>
                  </div>
                  <div className="absolute bottom-4 text-center">
                    <span className="text-[10px] font-semibold text-[#888] uppercase tracking-widest">
                      Ép kim nóng trên giấy mỹ thuật (Vellum Letterpress)
                    </span>
                  </div>
                </div>
              ) : mockupView === "embroidery" ? (
                // EMBROIDERY PREVIEW
                <div className="absolute inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center p-6" style={{ backgroundImage: "radial-gradient(#1a1a1a 15%, transparent 16%)", backgroundSize: "6px 6px" }}>
                  <div className="w-64 h-64 bg-[#121212] rounded-lg shadow-2xl flex items-center justify-center relative border border-[#332a1f]">
                    {/* Simulated linen stitch texture lines */}
                    <div className="absolute inset-2 border border-dashed border-[#1a1a1a]"></div>
                    <div className="w-52 h-52 opacity-95 scale-80" style={{ filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.15))" }}>
                      <LogoRenderer
                        id={inspectedId}
                        initials={initials}
                        partner1={partner1}
                        partner2={partner2}
                        date={weddingDate}
                        themeColor="#c5a059" // elegant dark gold thread
                        bgColor="transparent"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-4 text-center">
                    <span className="text-[10px] font-semibold text-[#888] uppercase tracking-widest">
                      Thêu tay thủ công trên khăn ăn (Linen Napkin Stitching)
                    </span>
                  </div>
                </div>
              ) : (
                // STANDARD FLAT PREVIEW
                <div className="w-64 h-64 transform transition-all duration-300">
                  <LogoRenderer
                    id={inspectedId}
                    initials={initials}
                    partner1={partner1}
                    partner2={partner2}
                    date={weddingDate}
                    themeColor={strokeColor}
                    bgColor={backgroundColor}
                  />
                </div>
              )}

              {/* Graphical Mode Toggles */}
              <div className="absolute bottom-16 flex items-center space-x-1.5 bg-black/80 border border-[#332a1f] backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-sans font-medium text-slate-200">
                <button
                  onClick={() => {
                    setGoboProjected(false);
                    setMockupView("flat");
                  }}
                  className={`px-2.5 py-1 rounded-full transition-colors ${
                    !goboProjected && mockupView === "flat" ? "bg-[#c5a059] text-black font-semibold" : "text-[#888] hover:text-[#c5a059]"
                  }`}
                >
                  Gốc (Flat)
                </button>
                <button
                  onClick={() => {
                    setGoboProjected(false);
                    setMockupView("wax");
                  }}
                  className={`px-2.5 py-1 rounded-full transition-colors ${
                    mockupView === "wax" ? "bg-[#c5a059] text-black font-semibold" : "text-[#888] hover:text-[#c5a059]"
                  }`}
                >
                  Wax Seal
                </button>
                <button
                  onClick={() => {
                    setGoboProjected(false);
                    setMockupView("paper");
                  }}
                  className={`px-2.5 py-1 rounded-full transition-colors ${
                    mockupView === "paper" ? "bg-[#c5a059] text-black font-semibold" : "text-[#888] hover:text-[#c5a059]"
                  }`}
                >
                  Vellum
                </button>
                <button
                  onClick={() => {
                    setGoboProjected(false);
                    setMockupView("embroidery");
                  }}
                  className={`px-2.5 py-1 rounded-full transition-colors ${
                    mockupView === "embroidery" ? "bg-[#c5a059] text-black font-semibold" : "text-[#888] hover:text-[#c5a059]"
                  }`}
                >
                  Thêu Napkin
                </button>
                <button
                  onClick={() => {
                    setGoboProjected(true);
                    setMockupView("flat");
                  }}
                  className={`px-2.5 py-1 rounded-full transition-colors flex items-center space-x-1 ${
                    goboProjected ? "bg-[#c5a059] text-black font-semibold" : "text-[#888] hover:text-[#c5a059]"
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>Chiếu GOBO</span>
                </button>
              </div>

            </div>

            {/* Right side: Detailed Specs, Prompts & Export controls */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-full bg-[#0d0d0d]">
              
              {/* Header Title */}
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5 text-xs text-[#c5a059] font-semibold uppercase tracking-widest">
                  <span>Logo cưới mã #{String(inspectedId).padStart(3, "0")}</span>
                </div>
                <h3 className="text-xl font-cinzel font-light text-[#e5e5e5]">
                  {currentTrend.vietnameseName} <span className="text-[#c5a059] font-normal">(Style {currentTrend.name})</span>
                </h3>
              </div>

              {/* Technical Spec sheet from PDF */}
              <div className="mt-4 space-y-3 text-xs border-y border-[#1a1a1a] py-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-[#555] font-sans">Tone màu khuyên dùng:</div>
                  <div className="col-span-2 font-medium text-[#e5e5e5]">{currentTrend.palette}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-[#555] font-sans">Chất liệu vật lý đi kèm:</div>
                  <div className="col-span-2 font-medium text-[#e5e5e5]">{currentTrend.material}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-[#555] font-sans">Không gian tiệc phù hợp:</div>
                  <div className="col-span-2 font-medium text-[#e5e5e5]">{currentTrend.venue}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-[#555] font-sans">Ý nghĩa thị giác chủ đạo:</div>
                  <div className="col-span-2 font-medium text-[#e5e5e5]">{currentTrend.meaning}</div>
                </div>
              </div>

              {/* Midjourney Prompt Section */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#555] uppercase tracking-widest font-sans">
                    Prompt tối ưu Midjourney v6/v7
                  </span>
                  <span className="text-[9px] bg-[#0a0a0a] text-[#c5a059] border border-[#1a1a1a] px-2 py-0.5 rounded-full font-semibold font-sans">
                    Style Raw / Stylize
                  </span>
                </div>
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-3 text-[11px] font-mono leading-relaxed text-[#c5a059] relative group/prompt select-all">
                  {midjourneyPromptFilled}
                </div>
                <p className="text-[10px] text-[#555] italic font-sans">
                  *Cấu trúc câu lệnh chuẩn xác: bao đóng initials trong ngoặc kép kép, style raw, stylize ở mức khuyên dùng để có thiết kế vector phẳng (flat vector ready).
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => downloadSVG(inspectedId)}
                  className="bg-[#111] hover:bg-[#1a1a1a] text-[#c5a059] border border-[#332a1f] py-3 px-4 rounded-xl text-xs font-semibold tracking-wide flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-95 font-sans"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải File Vector SVG</span>
                </button>
                <button
                  onClick={() => download2KPNG(inspectedId)}
                  className="bg-[#c5a059] hover:bg-[#b48d4c] text-black py-3 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-95 font-sans"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải File Ảnh 2K PNG</span>
                </button>
              </div>

              {/* Quick AI Advice Helper */}
              <div className="mt-4 bg-[#0a0a0a] rounded-2xl p-4 border border-[#332a1f] flex items-start space-x-3 text-xs text-[#888] leading-relaxed">
                <Sparkles className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#e5e5e5] block mb-0.5">Lời khuyên của cố vấn AI:</span>
                  <span>
                    Bản thiết kế này cực kỳ hoàn hảo cho ép kim dập nổi. Bạn có muốn cố vấn AI hướng dẫn chi tiết cách chế tác và phối màu mâm quả, thiệp cưới hay GOBO cho logo này không?
                  </span>
                  <button
                    onClick={() => {
                      setInspectedId(null);
                      const activeTheme = TRENDS[currentCategoryNum].name;
                      setChatInput(`Tôi muốn dùng logo #${inspectedId} style ${activeTheme} để chiếu GOBO và thêu napkin, hãy cho tôi lộ trình chế tác cụ thể?`);
                      // Scroll to chat
                      setTimeout(() => {
                        document.getElementById("ai-chat-assistant-panel")?.scrollIntoView({ behavior: "smooth" });
                      }, 200);
                    }}
                    className="mt-2 text-[#c5a059] hover:text-[#e5e5e5] font-bold underline block"
                  >
                    Hỏi Cố vấn AI ngay →
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
