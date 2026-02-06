
// import express from "express";
// import axios from "axios";
// import * as cheerio from "cheerio";
// import dotenv from "dotenv";
// import cors from "cors";

// dotenv.config();
// const app = express();
// app.use(express.json());





// app.use(cors({
//   origin: "*", // allow all during dev
//   methods: ["GET", "POST"],
// }));
// app.use(express.json());


// function extractJSON(text) {
//   if (!text) return "";
//   return text
//     .replace(/```json/gi, "")
//     .replace(/```/g, "")
//     .trim();
// }


// async function fetchWebsiteData(domain) {
//   const url = domain.startsWith("http") ? domain : `https://${domain}`;
//   const { data: html } = await axios.get(url, { timeout: 10000 });

//   const $ = cheerio.load(html);

//   return {
//     title: $("title").text(),
//     metaDescription: $('meta[name="description"]').attr("content") || "",
//     headings: $("h1, h2")
//       .map((_, el) => $(el).text())
//       .get()
//       .slice(0, 10),
//     bodyText: $("body").text().replace(/\s+/g, " ").slice(0, 4000)
//   };
// }

// async function analyzeWithAI(websiteData) {
//   const prompt = `
// You are an AI domain and brand profiler.

// STRICT RULES:
// - Return ONLY raw JSON
// - NO markdown
// - NO backticks
// - NO explanations

// Return exactly this structure:
// {
//   "interpretation": "",
//   "domainType": "",
//   "brandType": "",
//   "coreOffering": "",
//   "associatedTopics": [],
//   "brandSentiment": "",
//   "competitors": [],
//   "commonKeywords": [],
//   "gaps": [],
// }

// Website Data:
// ${JSON.stringify(websiteData, null, 2)}
// `;

//   const response = await axios.post(
//     "https://openrouter.ai/api/v1/chat/completions",
//     {
//       model: "openai/gpt-4o-mini",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.3
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json"
//       }
//     }
//   );

//   const raw = response.data.choices[0].message.content;
//   const clean = extractJSON(raw);

//   try {
//     return JSON.parse(clean);
//   } catch (err) {
//     console.error(" AI returned invalid JSON:\n", clean);
//     throw new Error("AI JSON parsing failed");
//   }
// }


// app.post("/api/analyze-domain", async (req, res) => {
//   try {
//     const { domain } = req.body;
//     if (!domain) return res.status(400).json({ error: "Domain required" });

//     const websiteData = await fetchWebsiteData(domain);
//     const aiResult = await analyzeWithAI(websiteData);

//     res.json(aiResult);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Analysis failed" });
//   }
// });

// app.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// });



// import express from "express";
// import axios from "axios";
// import * as cheerio from "cheerio";
// import dotenv from "dotenv";
// import cors from "cors";

// dotenv.config();
// const app = express();
// app.use(express.json());

// app.use(cors({
//   origin: "*", // allow all during dev
//   methods: ["GET", "POST"],
// }));
// app.use(express.json());

// function extractJSON(text) {
//   if (!text) return "";
//   return text
//     .replace(/```json/gi, "")
//     .replace(/```/g, "")
//     .trim();
// }

// async function fetchWebsiteData(domain) {
//   const url = domain.startsWith("http") ? domain : `https://${domain}`;
//   const { data: html } = await axios.get(url, { timeout: 10000 });

//   const $ = cheerio.load(html);

//   return {
//     title: $("title").text(),
//     metaDescription: $('meta[name="description"]').attr("content") || "",
//     headings: $("h1, h2")
//       .map((_, el) => $(el).text())
//       .get()
//       .slice(0, 10),
//     bodyText: $("body").text().replace(/\s+/g, " ").slice(0, 4000),
//     // Additional data for AI readiness
//     scripts: $("script[src]")
//       .map((_, el) => $(el).attr("src"))
//       .get()
//       .slice(0, 20),
//     images: $("img[src], img[data-src]")
//       .map((_, el) => $(el).attr("src") || $(el).attr("data-src"))
//       .get()
//       .slice(0, 20),
//     structuredData: $('script[type="application/ld+json"]')
//       .map((_, el) => $(el).html())
//       .get()
//   };
// }

// async function analyzeWithAI(websiteData) {
//   const prompt = `
// You are an AI domain and brand profiler.

// STRICT RULES:
// - Return ONLY raw JSON
// - NO markdown
// - NO backticks
// - NO explanations

// Return exactly this structure:
// {
//   "interpretation": "",
//   "domainType": "",
//   "brandType": "",
//   "coreOffering": "",
//   "associatedTopics": [],
//   "brandSentiment": "",
//   "competitors": [],
//   "commonKeywords": [],
//   "gaps": []
// }

// Website Data:
// ${JSON.stringify(websiteData, null, 2)}
// `;

//   const response = await axios.post(
//     "https://openrouter.ai/api/v1/chat/completions",
//     {
//       model: "openai/gpt-4o-mini",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.3
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json"
//       }
//     }
//   );

//   const raw = response.data.choices[0].message.content;
//   const clean = extractJSON(raw);

//   try {
//     return JSON.parse(clean);
//   } catch (err) {
//     console.error("AI returned invalid JSON:\n", clean);
//     throw new Error("AI JSON parsing failed");
//   }
// }

// async function analyzeAIReadiness(websiteData) {
//   const prompt = `
// You are an AI readiness assessment expert analyzing website structure for LLM integration potential.

// STRICT RULES:
// - Return ONLY raw JSON
// - NO markdown
// - NO backticks
// - NO explanations

// Analyze the website for AI/LLM readiness and return exactly this structure:
// {
//   "overallScore": 75,
//   "businessClassification": "General",
//   "qualityCoverage": 67,
//   "criticalPages": 3,
//   "totalPages": 9,
//   "recommendations": 6,
//   "visibilityPredictions": [
//     {
//       "query": "best tools for creative collaboration",
//       "path": "/help",
//       "status": "Passed",
//       "actionNeeded": "No Action Needed",
//       "recommendation": "Keep article well-structured and ensure users"
//     },
//     {
//       "query": "complete guide for content creators",
//       "path": "/guides",
//       "status": "Missing",
//       "actionNeeded": "Create Page",
//       "recommendation": "Create comprehensive guides that target this query and best practices"
//     },
//     {
//       "query": "sign up form/landing page for blog",
//       "path": "/signup",
//       "status": "Missing",
//       "actionNeeded": "Create Page",
//       "recommendation": "Better page context metadata and user journey"
//     },
//     {
//       "query": "newsletter page",
//       "path": "/newsletter",
//       "status": "Missing",
//       "actionNeeded": "Create Page",
//       "recommendation": "Newsletter keep users updated on new content"
//     }
//   ],
//   "fanOutQueries": [
//     {
//       "query": "How can I use AI for customer support?",
//       "path": "/help",
//       "topic": "Informational",
//       "intent": "Research Support",
//       "status": "Missing",
//       "relevance": 8
//     },
//     {
//       "query": "Best practices for AI integration",
//       "path": "/guides",
//       "topic": "How-to",
//       "intent": "Solution Focused",
//       "status": "Missing",
//       "relevance": 9
//     },
//     {
//       "query": "AI tools comparison",
//       "path": "/tools",
//       "topic": "Informational",
//       "intent": "Research Support",
//       "status": "Missing",
//       "relevance": 7
//     }
//   ],
//   "actionPlan": [
//     {
//       "phase": "Quick Wins",
//       "title": "Create Missing High Priority Pages",
//       "items": [
//         {
//           "task": "Schema Enhancement - Add Structured Data",
//           "priority": "High",
//           "effort": "Low Med",
//           "impact": 15
//         },
//         {
//           "task": "Mobile Schema",
//           "priority": "Med",
//           "effort": "Med",
//           "impact": 10
//         }
//       ]
//     },
//     {
//       "phase": "Content Optimization",
//       "title": "Enhance Existing Pages",
//       "items": [
//         {
//           "task": "Content Optimization - Enhance Existing Pages",
//           "priority": "Med",
//           "effort": "Med",
//           "impact": 20
//         }
//       ]
//     }
//   ],
//   "technicalFindings": {
//     "hasStructuredData": false,
//     "hasMetaDescriptions": true,
//     "hasOpenGraph": false,
//     "contentQuality": "medium",
//     "crawlability": "good"
//   }
// }

// Analyze based on:
// - Content structure and organization
// - Meta tags and structured data presence
// - Content quality and depth
// - Common user query gaps
// - SEO and discoverability factors

// Website Data:
// Title: ${websiteData.title}
// Meta: ${websiteData.metaDescription}
// Headings: ${websiteData.headings.join(", ")}
// Has Scripts: ${websiteData.scripts.length > 0}
// Has Images: ${websiteData.images.length > 0}
// Structured Data: ${websiteData.structuredData.length > 0 ? "Yes" : "No"}
// Content Sample: ${websiteData.bodyText.slice(0, 1000)}
// `;

//   const response = await axios.post(
//     "https://openrouter.ai/api/v1/chat/completions",
//     {
//       model: "openai/gpt-4o-mini",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.4
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json"
//       }
//     }
//   );

//   const raw = response.data.choices[0].message.content;
//   const clean = extractJSON(raw);

//   try {
//     return JSON.parse(clean);
//   } catch (err) {
//     console.error(" AI returned invalid JSON:\n", clean);
//     throw new Error("AI JSON parsing failed");
//   }
// }

// // Domain profiler endpoint
// app.post("/api/analyze-domain", async (req, res) => {
//   try {
//     const { domain } = req.body;
//     if (!domain) return res.status(400).json({ error: "Domain required" });

//     const websiteData = await fetchWebsiteData(domain);
//     const aiResult = await analyzeWithAI(websiteData);

//     res.json(aiResult);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Analysis failed" });
//   }
// });

// // AI Readiness Analyzer endpoint
// app.post("/api/analyze-readiness", async (req, res) => {
//   try {
//     const { domain } = req.body;
//     if (!domain) return res.status(400).json({ error: "Domain required" });

//     const websiteData = await fetchWebsiteData(domain);
//     const readinessResult = await analyzeAIReadiness(websiteData);

//     res.json(readinessResult);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Analysis failed" });
//   }
// });

// app.listen(3000, () => {
//   console.log(" Server running on http://localhost:3000");
// });



// import express from "express";
// import axios from "axios";
// import * as cheerio from "cheerio";
// import dotenv from "dotenv";
// import cors from "cors";

// dotenv.config();
// const app = express();
// app.use(express.json());

// app.use(cors({
//   origin: "*", // allow all during dev
//   methods: ["GET", "POST"],
// }));
// app.use(express.json());

// function extractJSON(text) {
//   if (!text) return "";
//   return text
//     .replace(/```json/gi, "")
//     .replace(/```/g, "")
//     .trim();
// }

// async function fetchWebsiteData(domain) {
//   const url = domain.startsWith("http") ? domain : `https://${domain}`;
//   const { data: html } = await axios.get(url, { timeout: 10000 });

//   const $ = cheerio.load(html);

//   return {
//     title: $("title").text(),
//     metaDescription: $('meta[name="description"]').attr("content") || "",
//     headings: $("h1, h2")
//       .map((_, el) => $(el).text())
//       .get()
//       .slice(0, 10),
//     bodyText: $("body").text().replace(/\s+/g, " ").slice(0, 4000),
//     // Additional data for AI readiness
//     scripts: $("script[src]")
//       .map((_, el) => $(el).attr("src"))
//       .get()
//       .slice(0, 20),
//     images: $("img[src], img[data-src]")
//       .map((_, el) => $(el).attr("src") || $(el).attr("data-src"))
//       .get()
//       .slice(0, 20),
//     structuredData: $('script[type="application/ld+json"]')
//       .map((_, el) => $(el).html())
//       .get()
//   };
// }

// async function analyzeWithAI(websiteData) {
//   const prompt = `
// You are an AI domain and brand profiler.

// STRICT RULES:
// - Return ONLY raw JSON
// - NO markdown
// - NO backticks
// - NO explanations

// Return exactly this structure:
// {
//   "interpretation": "",
//   "domainType": "",
//   "brandType": "",
//   "coreOffering": "",
//   "associatedTopics": [],
//   "brandSentiment": "",
//   "competitors": [],
//   "commonKeywords": [],
//   "gaps": []
// }

// Website Data:
// ${JSON.stringify(websiteData, null, 2)}
// `;

//   const response = await axios.post(
//     "https://openrouter.ai/api/v1/chat/completions",
//     {
//       model: "openai/gpt-4o-mini",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.3
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json"
//       }
//     }
//   );

//   const raw = response.data.choices[0].message.content;
//   const clean = extractJSON(raw);

//   try {
//     return JSON.parse(clean);
//   } catch (err) {
//     console.error("❌ AI returned invalid JSON:\n", clean);
//     throw new Error("AI JSON parsing failed");
//   }
// }

// async function analyzeAIReadiness(websiteData) {
//   const prompt = `
// You are an AI readiness assessment expert. Analyze this SPECIFIC website for LLM integration potential.

// CRITICAL INSTRUCTIONS:
// - Return ONLY raw JSON (no markdown, no backticks, no explanations)
// - Analyze the ACTUAL website data provided below
// - Generate REALISTIC scores and insights based on the content
// - Create SPECIFIC, ACTIONABLE recommendations
// - Identify REAL gaps and opportunities from the website content

// Required JSON structure:
// {
//   "overallScore": <number 0-100>,
//   "businessClassification": "<type based on content>",
//   "qualityCoverage": <number 0-100>,
//   "criticalPages": <number>,
//   "totalPages": <estimated number>,
//   "recommendations": <number of recommendations>,
//   "visibilityPredictions": [
//     {
//       "query": "<specific predicted user query>",
//       "path": "<relevant path>",
//       "status": "Passed" or "Missing" or "Warning",
//       "actionNeeded": "<action type>",
//       "recommendation": "<specific recommendation>"
//     }
//   ],
//   "fanOutQueries": [
//     {
//       "query": "<user intent query>",
//       "path": "<suggested path>",
//       "topic": "<topic category>",
//       "intent": "<user intent>",
//       "status": "Passed" or "Missing",
//       "relevance": <1-10>
//     }
//   ],
//   "actionPlan": [
//     {
//       "phase": "<phase name>",
//       "title": "<phase description>",
//       "items": [
//         {
//           "task": "<specific task>",
//           "priority": "High" or "Med" or "Low",
//           "effort": "<effort estimate>",
//           "impact": <percentage number>
//         }
//       ]
//     }
//   ],
//   "technicalFindings": {
//     "hasStructuredData": <boolean>,
//     "hasMetaDescriptions": <boolean>,
//     "hasOpenGraph": <boolean>,
//     "contentQuality": "excellent" or "good" or "medium" or "poor",
//     "crawlability": "excellent" or "good" or "medium" or "poor"
//   }
// }

// ANALYSIS GUIDELINES:
// 1. overallScore: Calculate based on content quality, structure, metadata, and completeness (0-100)
//    - 90-100: Excellent structure, rich metadata, comprehensive content
//    - 70-89: Good foundation, some gaps in metadata or content
//    - 50-69: Basic structure, missing key elements
//    - 30-49: Poor structure, significant gaps
//    - 0-29: Minimal AI readiness
   
// 2. visibilityPredictions: Generate 4-8 realistic queries users might search for this business
//    - Mix of "Passed" (content exists), "Missing" (gaps), and "Warning" (needs improvement)
//    - Queries should match the actual business/industry
   
// 3. fanOutQueries: Identify 3-6 related intent queries this site should rank for
//    - Should reflect actual user needs for this industry
//    - Relevance scores should vary (5-10)
   
// 4. actionPlan: Create 2-4 phases with specific, prioritized tasks
//    - Phase 1: Quick Wins (high impact, low effort)
//    - Phase 2: Content Optimization
//    - Phase 3: Technical Enhancements (optional)
//    - Phase 4: Advanced Features (optional)
   
// 5. Recommendations should be SPECIFIC to this website's industry and content gaps

// 6. Business Classification should match the actual site (e.g., E-commerce, SaaS, Blog, Agency, etc.)

// WEBSITE DATA TO ANALYZE:
// =========================
// Title: ${websiteData.title || "No title found"}
// Meta Description: ${websiteData.metaDescription || "No meta description"}
// Main Headings: ${websiteData.headings.length > 0 ? websiteData.headings.join(" | ") : "No headings found"}
// Has JavaScript: ${websiteData.scripts.length > 0 ? "Yes (" + websiteData.scripts.length + " scripts)" : "No"}
// Has Images: ${websiteData.images.length > 0 ? "Yes (" + websiteData.images.length + " images)" : "No"}
// Structured Data Present: ${websiteData.structuredData.length > 0 ? "Yes" : "No"}

// Content Sample (first 1500 chars):
// ${websiteData.bodyText.slice(0, 1500)}

// =========================

// Now analyze this SPECIFIC website and return the JSON structure with insights tailored to this business.
// `;

//   const response = await axios.post(
//     "https://openrouter.ai/api/v1/chat/completions",
//     {
//       model: "openai/gpt-4o-mini",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.5  // Slightly higher for more creative/varied analysis
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json"
//       }
//     }
//   );

//   const raw = response.data.choices[0].message.content;
//   const clean = extractJSON(raw);

//   try {
//     return JSON.parse(clean);
//   } catch (err) {
//     console.error("❌ AI returned invalid JSON:\n", clean);
//     throw new Error("AI JSON parsing failed");
//   }
// }

// // Domain profiler endpoint
// app.post("/api/analyze-domain", async (req, res) => {
//   try {
//     const { domain } = req.body;
//     if (!domain) return res.status(400).json({ error: "Domain required" });

//     const websiteData = await fetchWebsiteData(domain);
//     const aiResult = await analyzeWithAI(websiteData);

//     res.json(aiResult);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Analysis failed" });
//   }
// });

// // AI Readiness Analyzer endpoint
// app.post("/api/analyze-readiness", async (req, res) => {
//   try {
//     const { domain } = req.body;
//     if (!domain) return res.status(400).json({ error: "Domain required" });

//     const websiteData = await fetchWebsiteData(domain);
//     const readinessResult = await analyzeAIReadiness(websiteData);

//     res.json(readinessResult);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Analysis failed" });
//   }
// });

// app.listen(3000, () => {
//   console.log("🚀 Server running on http://localhost:3000");
// });



import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
import cors from "cors";
// const { extractJSON, literalMention } = require("./helpers");
// import {  literalMention } from "./helper.js";

dotenv.config();
const app = express();
app.use(express.json());

// app.use(cors({
//   origin: "*",
//   methods: ["GET", "POST"],
// }));

const allowedOrigins = [
  "https://llm-ai-tools.netlify.app",
  "http://localhost:5500",
  "http://localhost:3000"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  credentials: true
}));


app.get("/", (req, res) => {
  res.json({ status: "OK", service: "AI Backend Running" });
});

function literalMention(text, brand) {
  return text.toLowerCase().includes(brand.toLowerCase());
}

function extractJSON(text) {
  if (!text) return null;

  // Extract first valid JSON object from text
  const match = text.match(/\{[\s\S]*\}/);

  if (!match) return null;

  return match[0];
}


async function fetchWebsiteData(domain) {
  const url = domain.startsWith("http") ? domain : `https://${domain}`;
  const { data: html } = await axios.get(url, { timeout: 30000 });

  const $ = cheerio.load(html);

  return {
    title: $("title").text(),
    metaDescription: $('meta[name="description"]').attr("content") || "",
    headings: $("h1, h2")
      .map((_, el) => $(el).text())
      .get()
      .slice(0, 10),
    bodyText: $("body").text().replace(/\s+/g, " ").slice(0, 4000),
    scripts: $("script[src]")
      .map((_, el) => $(el).attr("src"))
      .get()
      .slice(0, 20),
    images: $("img[src], img[data-src]")
      .map((_, el) => $(el).attr("src") || $(el).attr("data-src"))
      .get()
      .slice(0, 20),
    structuredData: $('script[type="application/ld+json"]')
      .map((_, el) => $(el).html())
      .get()
  };
}

// Check visibility in ChatGPT
// Check visibility in ChatGPT using actual ChatGPT model
// Check visibility in ChatGPT using actual ChatGPT model
// Check visibility in ChatGPT using actual ChatGPT model
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\------------------------------------//////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



// async function checkChatGPTVisibility(brandName, query) {
//   try {
//     // First, get the actual ChatGPT response
//     const chatgptResponse = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         model: "openai/gpt-4o-mini",
//         messages: [{ 
//           role: "user", 
//           content: query 
//         }],
//         temperature: 0.3
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const chatgptAnswer = chatgptResponse.data.choices[0].message.content;
    
//     // Now analyze if brand is mentioned in the response
//     const analysisPrompt = `Analyze this ChatGPT response to determine if the brand "${brandName}" is mentioned or recommended.

// User Query: "${query}"

// ChatGPT Response:
// ${chatgptAnswer}

// Return ONLY raw JSON (no markdown, no backticks):
// {
//   "mentioned": true/false,
//   "relevanceScore": 0-10,
//   "context": "brief explanation of how the brand was/wasn't mentioned",
//   "alternativesProvided": ["list of competitors/alternatives mentioned"],
//   "reasoning": "detailed reasoning",
//   "actualResponse": "brief excerpt showing brand mention or explaining absence"
// }`;

//     const analysisResponse = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         model: "openai/gpt-4o-mini",
//         messages: [{ 
//           role: "user", 
//           content: analysisPrompt 
//         }],
//         temperature: 0.2
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const raw = analysisResponse.data.choices[0].message.content;
//     const clean = extractJSON(raw);
//     return JSON.parse(clean);
    
//   } catch (err) {
//     console.error("ChatGPT check error:", err.response?.data || err.message);
//     return {
//       mentioned: false,
//       relevanceScore: 0,
//       context: "Error checking visibility",
//       alternativesProvided: [],
//       reasoning: "API error occurred",
//       actualResponse: ""
//     };
//   }
// }

// // Check visibility in Gemini using actual Gemini model
// async function checkGeminiVisibility(brandName, query) {
//   try {
//     // First, get the actual Gemini response using meta-llama (free alternative)
//     const geminiResponse = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         model: "google/gemma-3n-e4b-it:free",
//         messages: [{ 
//           role: "user", 
//           content: query 
//         }],
//         temperature: 0.3
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const geminiAnswer = geminiResponse.data.choices[0].message.content;
    
//     // Now analyze if brand is mentioned in the response
//     const analysisPrompt = `Analyze this AI response to determine if the brand "${brandName}" is mentioned or recommended.

// User Query: "${query}"

// AI Response:
// ${geminiAnswer}

// Return ONLY raw JSON (no markdown, no backticks):
// {
//   "mentioned": true/false,
//   "relevanceScore": 0-10,
//   "context": "brief explanation of how the brand was/wasn't mentioned",
//   "alternativesProvided": ["list of competitors/alternatives mentioned"],
//   "reasoning": "detailed reasoning",
//   "actualResponse": "brief excerpt showing brand mention or explaining absence"
// }`;

//     const analysisResponse = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         model: "openai/gpt-4o-mini",
//         messages: [{ 
//           role: "user", 
//           content: analysisPrompt 
//         }],
//         temperature: 0.2
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const raw = analysisResponse.data.choices[0].message.content;
//     const clean = extractJSON(raw);
//     return JSON.parse(clean);
    
//   } catch (err) {
//     console.error("Gemini check error:", err.response?.data || err.message);
//     return {
//       mentioned: false,
//       relevanceScore: 0,
//       context: "Error checking visibility",
//       alternativesProvided: [],
//       reasoning: "API error occurred",
//       actualResponse: ""
//     };
//   }
// }

// // Main visibility checker endpoint
// app.post("/api/check-visibility", async (req, res) => {
//   try {
//     const { brandName, queries } = req.body;

//     if (!brandName) {
//       return res.status(400).json({ error: "Brand name required" });
//     }

//     if (!queries || !Array.isArray(queries) || queries.length === 0) {
//       return res.status(400).json({ error: "At least one query required" });
//     }

//     if (queries.length > 5) {
//       return res.status(400).json({ error: "Maximum 5 queries allowed" });
//     }

//     // Process all queries in parallel
//     const results = await Promise.all(
//       queries.map(async (query) => {
//         const [chatgptResult, geminiResult] = await Promise.all([
//           checkChatGPTVisibility(brandName, query),
//           checkGeminiVisibility(brandName, query)
//         ]);

//         return {
//           query,
//           chatgpt: {
//             found: chatgptResult.mentioned,
//             relevanceScore: chatgptResult.relevanceScore,
//             context: chatgptResult.context,
//             alternatives: chatgptResult.alternativesProvided || [],
//             reasoning: chatgptResult.reasoning,
//             actualResponse: chatgptResult.actualResponse || ""
//           },
//           gemini: {
//             found: geminiResult.mentioned,
//             relevanceScore: geminiResult.relevanceScore,
//             context: geminiResult.context,
//             alternatives: geminiResult.alternativesProvided || [],
//             reasoning: geminiResult.reasoning,
//             actualResponse: geminiResult.actualResponse || ""
//           }
//         };
//       })
//     );

//     // Calculate overall statistics
//     const chatgptMentions = results.filter(r => r.chatgpt.found).length;
//     const geminiMentions = results.filter(r => r.gemini.found).length;
//     const totalQueries = queries.length;

//     const overallScore = Math.round(
//       ((chatgptMentions + geminiMentions) / (totalQueries * 2)) * 100
//     );

//     res.json({
//       brandName,
//       overallScore,
//       summary: {
//         totalQueries,
//         chatgpt: {
//           mentions: chatgptMentions,
//           percentage: Math.round((chatgptMentions / totalQueries) * 100)
//         },
//         gemini: {
//           mentions: geminiMentions,
//           percentage: Math.round((geminiMentions / totalQueries) * 100)
//         }
//       },
//       results
//     });

//   } catch (err) {
//     console.error("Visibility check error:", err);
//     res.status(500).json({ error: "Visibility check failed" });
//   }
// });

// // Auto-generate queries endpoint
// app.post("/api/generate-queries", async (req, res) => {
//   try {
//     const { brandName } = req.body;

//     if (!brandName) {
//       return res.status(400).json({ error: "Brand name required" });
//     }

//     const prompt = `Generate 5 relevant search queries that potential customers might use to find products/services related to the brand: "${brandName}"

// These should be realistic queries someone would type into an AI assistant or search engine.

// Return ONLY raw JSON (no markdown, no backticks):
// {
//   "queries": [
//     "query 1",
//     "query 2",
//     "query 3",
//     "query 4",
//     "query 5"
//   ]
// }`;

//     const response = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         model: "openai/gpt-4o-mini",
//         messages: [{ role: "user", content: prompt }],
//         temperature: 0.7
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const raw = response.data.choices[0].message.content;
//     const clean = extractJSON(raw);
//     const result = JSON.parse(clean);

//     res.json({ queries: result.queries || [] });

//   } catch (err) {
//     console.error("Query generation error:", err);
//     res.status(500).json({ error: "Query generation failed" });
//   }
// });





///////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\




///-----------------------------------------\\\\\



const OPENROUTER_HEADERS = {
  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  "Content-Type": "application/json"
};

/* ------------------------------
   GENERATE ANSWER (MODEL CALL)
--------------------------------*/

async function generateAnswer(model, query) {
  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model,
      messages: [{ role: "user", content: query }],
      temperature: 0.3
    },
    { headers: OPENROUTER_HEADERS }
  );

  return res.data.choices[0].message.content;
}

/* ------------------------------
   RELEVANCE EVALUATION (STRICT)
--------------------------------*/

async function evaluateRelevance(answer, brand, query) {
  const prompt = `
You are a strict evaluator.

Rules:
- Brand must be EXPLICITLY mentioned by name.
- Do NOT infer or assume relevance.
- Score relevance only if the brand name appears verbatim.

Return ONLY raw JSON:
{
  "relevanceScore": 0-10,
  "context": "",
  "reasoning": ""
}

User Query:
"${query}"

AI Response:
"${answer}"
`;

  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0
    },
    { headers: OPENROUTER_HEADERS }
  );

  const raw = res.data.choices[0].message.content;
  return JSON.parse(extractJSON(raw));
}

/* ------------------------------
   CHECK VISIBILITY (GENERIC)
--------------------------------*/

async function checkVisibility({ model, brand, query }) {
  const answer = await generateAnswer(model, query);
  const mentioned = literalMention(answer, brand);

  let evaluation = {
    relevanceScore: 0,
    context: "Brand not explicitly mentioned",
    reasoning: "Literal string match failed"
  };

  if (mentioned) {
    evaluation = await evaluateRelevance(answer, brand, query);
  }

  return {
    found: mentioned,
    relevanceScore: evaluation.relevanceScore,
    context: evaluation.context,
    reasoning: evaluation.reasoning,
    actualResponse: mentioned
      ? answer.substring(0, 300)
      : ""
  };
}

/* ------------------------------
   MAIN API ENDPOINT
--------------------------------*/

app.post("/api/check-visibility", async (req, res) => {
  try {
    const { brandName, queries } = req.body;

    if (!brandName || !queries?.length)
      return res.status(400).json({ error: "Invalid input" });

    if (queries.length > 5)
      return res.status(400).json({ error: "Max 5 queries allowed" });

    const results = await Promise.all(
      queries.map(async query => {
        const [chatgpt, gemma] = await Promise.all([
          checkVisibility({
            model: "openai/gpt-4o-mini",
            brand: brandName,
            query
          }),
          checkVisibility({
            model: "google/gemma-3n-e4b-it:free",
            brand: brandName,
            query
          })
        ]);

        return {
          query,
          chatgpt,
          gemma
        };
      })
    );

    const total = queries.length;
    const chatgptHits = results.filter(r => r.chatgpt.found).length;
    const gemmaHits = results.filter(r => r.gemma.found).length;

    res.json({
      brandName,
      overallScore: Math.round(
        ((chatgptHits + gemmaHits) / (total * 2)) * 100
      ),
      summary: {
        chatgpt: {
          mentions: chatgptHits,
          percentage: Math.round((chatgptHits / total) * 100)
        },
        gemma: {
          mentions: gemmaHits,
          percentage: Math.round((gemmaHits / total) * 100)
        }
      },
      results
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Visibility check failed" });
  }
});

/* ------------------------------
   AUTO QUERY GENERATION
--------------------------------*/

app.post("/api/generate-queries", async (req, res) => {
  const { brandName } = req.body;
  if (!brandName) return res.status(400).json({ error: "Brand required" });

  const prompt = `
Generate 5 realistic user queries where someone may or may not mention "${brandName}".

Return ONLY raw JSON:
{
  "queries": []
}
`;

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    },
    { headers: OPENROUTER_HEADERS }
  );

  const raw = response.data.choices[0].message.content;
  res.json(JSON.parse(extractJSON(raw)));
});

/* ------------------------------
   SERVER
--------------------------------*/





///-----------------------------------------\\\\\

// Domain profiler endpoint (existing)
app.post("/api/analyze-domain", async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: "Domain required" });

    const websiteData = await fetchWebsiteData(domain);
    
    const prompt = `
You are an AI domain and brand profiler.

STRICT RULES:
- Return ONLY raw JSON
- NO markdown
- NO backticks
- NO explanations

Return exactly this structure:
{
  "interpretation": "",
  "domainType": "",
  "brandType": "",
  "coreOffering": "",
  "associatedTopics": [],
  "brandSentiment": "",
  "competitors": [],
  "commonKeywords": [],
  "gaps": []
}

Website Data:
${JSON.stringify(websiteData, null, 2)}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const raw = response.data.choices[0].message.content;
    const clean = extractJSON(raw);
    const aiResult = JSON.parse(clean);

    res.json(aiResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

// AI Readiness Analyzer endpoint
app.post("/api/analyze-readiness", async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: "Domain required" });

    const websiteData = await fetchWebsiteData(domain);
    const readinessResult = await analyzeAIReadiness(websiteData);

    res.json(readinessResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
  }
});
async function analyzeAIReadiness(websiteData) {
  const prompt = `
You are an AI readiness assessment expert. Analyze this SPECIFIC website for LLM integration potential.

CRITICAL INSTRUCTIONS:
- Return ONLY raw JSON (no markdown, no backticks, no explanations)
- Analyze the ACTUAL website data provided below
- Generate REALISTIC scores and insights based on the content
- Create SPECIFIC, ACTIONABLE recommendations
- Identify REAL gaps and opportunities from the website content

Required JSON structure:
{
  "overallScore": <number 0-100>,
  "businessClassification": "<type based on content>",
  "qualityCoverage": <number 0-100>,
  "criticalPages": <number>,
  "totalPages": <total number>,
  "recommendations": <number of recommendations>,
  "visibilityPredictions": [
    {
      "query": "<specific predicted user query>",
      "path": "<relevant path>",
      "status": "Passed" or "Missing" or "Warning",
      "actionNeeded": "<action type>",
      "recommendation": "<specific recommendation>"
    }
  ],
  "fanOutQueries": [
    {
      "query": "<user intent query>",
      "path": "<suggested path>",
      "topic": "<topic category>",
      "intent": "<user intent>",
      "status": "Passed" or "Missing",
      "relevance": <1-10>
    }
  ],
  "actionPlan": [
    {
      "phase": "<phase name>",
      "title": "<phase description>",
      "items": [
        {
          "task": "<specific task>",
          "priority": "High" or "Med" or "Low",
          "effort": "<effort estimate>",
          "impact": <percentage number>
        }
      ]
    }
  ],
  "technicalFindings": {
    "hasStructuredData": <boolean>,
    "hasMetaDescriptions": <boolean>,
    "hasOpenGraph": <boolean>,
    "contentQuality": "excellent" or "good" or "medium" or "poor",
    "crawlability": "excellent" or "good" or "medium" or "poor"
  }
}

ANALYSIS GUIDELINES:
1. overallScore: Calculate based on content quality, structure, metadata, and completeness (0-100)
   - 90-100: Excellent structure, rich metadata, comprehensive content
   - 70-89: Good foundation, some gaps in metadata or content
   - 50-69: Basic structure, missing key elements
   - 30-49: Poor structure, significant gaps
   - 0-29: Minimal AI readiness
   
2. visibilityPredictions: Generate 4-8 realistic queries users might search for this business
   - Mix of "Passed" (content exists), "Missing" (gaps), and "Warning" (needs improvement)
   - Queries should match the actual business/industry
   
3. fanOutQueries: Identify 3-6 related intent queries this site should rank for
   - Should reflect actual user needs for this industry
   - Relevance scores should vary (5-10)
   
4. actionPlan: Create 2-4 phases with specific, prioritized tasks
   - Phase 1: Quick Wins (high impact, low effort)
   - Phase 2: Content Optimization
   - Phase 3: Technical Enhancements (optional)
   - Phase 4: Advanced Features (optional)
   
5. Recommendations should be SPECIFIC to this website's industry and content gaps

6. Business Classification should match the actual site (e.g., E-commerce, SaaS, Blog, Agency, etc.)

WEBSITE DATA TO ANALYZE:
=========================
Title: ${websiteData.title || "No title found"}
Meta Description: ${websiteData.metaDescription || "No meta description"}
Main Headings: ${websiteData.headings.length > 0 ? websiteData.headings.join(" | ") : "No headings found"}
Has JavaScript: ${websiteData.scripts.length > 0 ? "Yes (" + websiteData.scripts.length + " scripts)" : "No"}
Has Images: ${websiteData.images.length > 0 ? "Yes (" + websiteData.images.length + " images)" : "No"}
Structured Data Present: ${websiteData.structuredData.length > 0 ? "Yes" : "No"}

Content Sample (first 1500 chars):
${websiteData.bodyText.slice(0, 1500)}

=========================

Now analyze this SPECIFIC website and return the JSON structure with insights tailored to this business.
`;

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5  // Slightly higher for more creative/varied analysis
    },
    {
      
      headers: {
        
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const raw = response.data.choices[0].message.content;
  const clean = extractJSON(raw);

  if (!clean) {
    console.error("❌ No JSON found in AI response:\n", raw);
    throw new Error("AI did not return valid JSON");
  }

  let parsed;
  try {
    parsed = JSON.parse(clean);
  } catch (e) {
    console.error("❌ JSON parse failed:\n", clean);
    throw new Error("Invalid JSON from AI");
  }

  return parsed;
}



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started successfully`);
  console.log(`📡 Listening on port ${PORT}`);
});