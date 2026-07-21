import express from "express";
import serverless from "serverless-http";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Initialize GoogleGenAI client lazily to avoid crashing on startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Create a router for endpoints
const router = express.Router();

// API Health Check
router.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString(), platform: "netlify-functions" });
});

// API Gemini Consult Route
router.post("/gemini/consult", async (req, res) => {
  try {
    const { initials, partner1, partner2, theme, customQuestion, venue } = req.body;

    const parsedInitials = (initials || "HM").trim().toUpperCase();
    const name1 = (partner1 || "Hậu").trim();
    const name2 = (partner2 || "My").trim();
    const selectedTheme = theme || "Classic Royal";

    const systemInstruction = `Bạn là Chuyên gia Tư vấn Thiết kế và Nhận diện Thương hiệu Tiệc cưới Cao cấp năm 2026, am hiểu sâu sắc về xu hướng thiết kế monogram cưới đương đại.
Nhiệm vụ của bạn là tư vấn cho cặp đôi một cách thật sang trọng, tinh tế, lịch thiệp, sử dụng ngôn từ cao cấp và chuyên nghiệp (không dùng ký tự AI lỗi, không sáo rỗng).

Dựa vào tài liệu Nghiên cứu Xu hướng Logo Cưới 2026:
1. PHONG CÁCH CHỌN:
   - "Classic Royal" (Cổ Điển Hoàng Gia): Tone màu Gold foil on white, vòng nguyệt quế hoàng gia, nét thư pháp đan lồng (Intertwined), sang trọng kiểu Black-tie sảnh khách sạn 5 sao.
   - "Modern Minimalist" (Tối giản đương đại): Tone màu Silver on dark chocolate, trục đứng đơn mảnh, chữ không chân (Sans-serif) dãn cách rộng, thanh lịch hơi thở châu Âu, sảnh công nghiệp/nhà kính.
   - "Vintage Art Deco Luxury" (Hoài cổ quý phái): Tone màu Bronze on white, khung đối xứng Art Deco hình học tinh xảo phong cách thập niên 1920, quý phái lộng lẫy.
   - "Botanical Garden" (Nghệ thuật thiên nhiên): Tone màu Matcha green on cream, lá bạch đàn và lá rẻ quạt, nét vẽ tay mảnh, phong cách mộc mạc Rustic/Bohemian sân vườn.

2. CẤU TRÚC PHẢN HỒI:
   Hãy viết một phản hồi cực kỳ chi tiết, lôi cuốn, có bố cục rõ ràng bằng tiếng Việt gồm các phần:
   - **Lời Chào Cao Cấp**: Chào đón cặp đôi ${name1} & ${name2} bằng ngôn từ sang trọng.
   - **Phân Tích Monogram Cho Cặp Đôi**: Giải thích ý nghĩa hình học của cặp chữ ghép "${parsedInitials}" theo phong cách "${selectedTheme}". Nêu cách các nét chữ lồng ghép hoàn hảo biểu đạt cho sự hòa hợp.
   - **Chiến Lược Ứng Dụng Vật Lý**: Hướng dẫn chi tiết cách áp dụng logo này vào các ấn phẩm cưới thực tế: con dấu sáp niêm phong, thêu tay trên khăn ăn, ép kim thiệp mời trên giấy xuyên thấu vellum, nhãn chai nước.
   - **Tiêu Chuẩn Chiếu GOBO Ánh Sáng**: Đưa ra lời khuyên cụ thể cho sảnh tiệc của họ. Khuyên dùng đĩa GOBO thủy tinh (Glass Gobo) cỡ Size B, máy chiếu công nghệ DLP có cường độ sáng trên 4500+ Lumens và tỷ lệ tương phản trên 8000:1 để hiển thị hoàn mỹ dưới ánh sáng nghệ thuật.
   - **Cú Pháp Prompt Midjourney v6/v7 Độc Quyền**: Viết một prompt tiếng Anh chuẩn xác nhất dành cho cặp chữ "${parsedInitials}" theo phong cách "${selectedTheme}", áp dụng đúng cấu trúc trong tài liệu (bao đóng bằng dấu ngoặc kép đôi chữ viết hoa, thêm tham số như --style raw, --stylize, --no photorealistic, 3d, gradient, mockup để ra được thiết kế vector phẳng hoàn hảo).`;

    const userPrompt = `Hãy viết bài tư vấn nhận diện thương hiệu tiệc cưới cao cấp cho cặp đôi:
- Tên chú rể/cô dâu: ${name1} & ${name2}
- Chữ cái viết tắt (Initials): "${parsedInitials}"
- Phong cách mong muốn: ${selectedTheme}
- Không gian tổ chức tiệc cưới (nếu có): ${venue || "Sảnh tiệc cao cấp"}
- Câu hỏi hoặc yêu cầu thêm từ cặp đôi: ${customQuestion || "Hãy gợi ý phương án tốt nhất để logo trông lộng lẫy và sắc nét."}`;

    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      advice: response.text,
    });
  } catch (error: any) {
    console.error("Gemini Consult Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Không thể kết nối với trí tuệ nhân tạo Gemini.",
    });
  }
});

// Since Netlify redirects /api/* to this function, the base path in the request might contain "/api" or not
// We use the router for both /api and / to handle both cases automatically and robustly
app.use("/api", router);
app.use("/", router);

export const handler = serverless(app);
