

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

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
}));

// const allowedOrigins = [
//   "https://llm-ai-tools.netlify.app",
//   "http://localhost:5500",
//   "http://localhost:3000"
// ];

// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST"],
//   credentials: true
// }));


app.get("/", (req, res) => {
  res.json({ status: "OK", service: "AI Backend Running" });
});

function literalMention(text, brand) {
  return text.toLowerCase().includes(brand.toLowerCase());
}

function extractJSON(text) {
  try {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1) return null;
    return text.slice(firstBrace, lastBrace + 1);
  } catch {
    return null;
  }
}


async function fetchWebsiteData(domain) {
  try {
    const url = domain.startsWith("http") ? domain : `https://${domain}`;

    const { data: html } = await axios.get(url, {
      timeout: 15000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
      }
    });

    const $ = cheerio.load(html);

    return {
      title: $("title").text(),
      metaDescription: $('meta[name="description"]').attr("content") || "",
      headings: $("h1, h2").map((_, el) => $(el).text()).get().slice(0, 10),
      bodyText: $("body").text().replace(/\s+/g, " ").slice(0, 4000),
      scripts: $("script[src]").map((_, el) => $(el).attr("src")).get().slice(0, 20),
      images: $("img[src], img[data-src]").map((_, el) => $(el).attr("src") || $(el).attr("data-src")).get().slice(0, 20),
      structuredData: $('script[type="application/ld+json"]').map((_, el) => $(el).html()).get()
    };

  } catch (err) {
    console.log("⚠️ Scraping blocked:", err.code || err.message);

    // DO NOT CRASH
    return {
      title: "",
      metaDescription: "",
      headings: [],
      bodyText: "",
      scripts: [],
      images: [],
      structuredData: []
    };
  }
}




// const OPENROUTER_HEADERS = {
//   Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//   "Content-Type": "application/json"
// };

/* ------------------------------
   GENERATE ANSWER (MODEL CALL)
--------------------------------*/

/**
 * Query GPT-4 via OpenRouter API
 */


const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

// Model configurations
const GPT_MODEL = 'openai/gpt-4-turbo';

const GEMINI_MODEL = 'gemini-2.5-flash-lite';  // ✅ Best free option


// ========================================
async function queryGPT(prompt) {
    // Check if OpenRouter API key is configured
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
        console.warn('OpenRouter API key not configured - skipping GPT query');
        return {
            response: 'OpenRouter API key not configured. Add your API key to .env file to enable GPT-4 comparison.',
            searchLinks: [],
            error: 'API key not configured'
        };
    }

    try {
        const response = await axios.post(
            `${OPENROUTER_BASE_URL}/chat/completions`,
            {
                model: GPT_MODEL,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 80, // Reduced to avoid credit issues
                temperature: 0.3
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:3000',
                    'X-Title': 'Brand Visibility Checker'
                }
            }
        );

        const messageContent = response.data.choices[0].message.content;
        
        // Extract search links if present (OpenRouter may include them)
        const searchLinks = extractSearchLinks(response.data);
        
        return {
            response: messageContent,
            searchLinks,
            error: null
        };
    } catch (error) {
        console.error('GPT Error:', error.response?.data || error.message);
        return {
            response: 'Error querying GPT-4. Please check your OpenRouter credits.',
            searchLinks: [],
            error: error.response?.data?.error?.message || error.message
        };
    }
}

/**
 * Query Gemini Pro via Google API with Google Search grounding
 */
// async function queryGemini(prompt) {
//     try {
//         const response = await axios.post(
//             `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
//             {
//                 contents: [
//                     {
//                         parts: [
//                             {
//                                 text: prompt
//                             }
//                         ]
//                     }
//                 ],
//                 generationConfig: {
//                     temperature: 0.7,
//                     maxOutputTokens: 500 // Reduced for efficiency
//                 },
//                 // Enable Google Search grounding (available in free tier)
//                 tools: [
//                     {
//                         googleSearchRetrieval: {
//                             dynamicRetrievalConfig: {
//                                 mode: "MODE_DYNAMIC",
//                                 dynamicThreshold: 0.3
//                             }
//                         }
//                     }
//                 ]
//             },
//             {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );

//         const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
//         // Extract grounding metadata (Gemini's search references)
//         const searchLinks = extractGeminiGrounding(response.data);
        
//         return {
//             response: content,
//             searchLinks,
//             error: null
//         };
//     } catch (error) {
//         console.error('Gemini Error:', error.response?.data || error.message);
//         return {
//             response: '',
//             searchLinks: [],
//             error: error.response?.data?.error?.message || error.message
//         };
//     }
// }

/**
 * Extract search links from OpenRouter response
 */


async function queryGemini(prompt) {
    try {
        const response = await axios.post(
            `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 80
                }
                // ✅ Removed tools section completely
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        return {
            response: content,
            searchLinks: [], // No search links without grounding
            error: null
        };
    } catch (error) {
        console.error('Gemini Error:', error.response?.data || error.message);
        return {
            response: '',
            searchLinks: [],
            error: error.response?.data?.error?.message || error.message
        };
    }
}


function extractSearchLinks(data) {
    const links = [];
    
    // Check if there's search metadata in the response
    if (data.metadata && data.metadata.sources) {
        data.metadata.sources.forEach(source => {
            links.push({
                url: source.url,
                title: source.title || source.url
            });
        });
    }
    
    return links;
}

/**
 * Extract grounding metadata from Gemini response
 */
function extractGeminiGrounding(data) {
    const links = [];
    
    try {
        // Check for grounding metadata with search chunks
        if (data.candidates?.[0]?.groundingMetadata?.groundingChunks) {
            data.candidates[0].groundingMetadata.groundingChunks.forEach(chunk => {
                if (chunk.web && chunk.web.uri) {
                    links.push({
                        url: chunk.web.uri,
                        title: chunk.web.title || chunk.web.uri
                    });
                }
            });
        }
        
        // Also check for grounding supports (alternative structure)
        if (data.candidates?.[0]?.groundingMetadata?.groundingSupports) {
            data.candidates[0].groundingMetadata.groundingSupports.forEach(support => {
                if (support.segment && support.groundingChunkIndices) {
                    // These reference the chunks above
                }
            });
        }
        
        // Check for search entry point
        if (data.candidates?.[0]?.groundingMetadata?.searchEntryPoint) {
            const searchData = data.candidates[0].groundingMetadata.searchEntryPoint;
            if (searchData.renderedContent) {
                // This contains the search query used
                console.log('Gemini search query:', searchData.renderedContent);
            }
        }
        
        // Check for web search queries (newer format)
        if (data.candidates?.[0]?.groundingMetadata?.webSearchQueries) {
            console.log('Gemini web search queries:', data.candidates[0].groundingMetadata.webSearchQueries);
        }
    } catch (error) {
        console.error('Error extracting Gemini grounding:', error);
    }
    
    return links;
}

/**
 * Check if brand is mentioned in response
 */
function checkBrandMention(response, brandName) {
    const lowerResponse = response.toLowerCase();
    const lowerBrand = brandName.toLowerCase();
    
    // Check for exact brand mention
    const mentioned = lowerResponse.includes(lowerBrand);
    
    // Extract sentences containing the brand
    const references = [];
    const sentences = response.match(/[^.!?]+[.!?]+/g) || [];
    
    sentences.forEach((sentence, idx) => {
        if (sentence.toLowerCase().includes(lowerBrand)) {
            references.push({
                text: sentence.trim(),
                index: idx
            });
        }
    });
    
    return { mentioned, references };
}

/**
 * Generate queries using AI based on brand information
 * Uses Gemini (free) instead of GPT for query generation
 */



function safeJsonArrayParse(text) {
    try {
        if (!text) throw new Error("Empty AI response");

        // Remove markdown code blocks if AI added them
        text = text.replace(/```json|```/gi, "").trim();

        // Extract first JSON array
        const match = text.match(/\[[\s\S]*?\]/);

        if (!match) throw new Error("No JSON array found");

        // Remove trailing commas (invalid JSON fix)
        const cleaned = match[0].replace(/,\s*]/g, "]");

        return JSON.parse(cleaned);
    } catch (err) {
        console.error("❌ RAW AI RESPONSE:\n", text);
        throw new Error("Failed to parse queries from response");
    }
}

// async function generateBrandQueries(brandName, websiteUrl = '', businessType = '') {
//     const prompt = `Generate 5 diverse search queries that potential customers might ask AI assistants when looking for products or services similar to "${brandName}".

// ${websiteUrl ? `Website: ${websiteUrl}` : ''}
// ${businessType ? `Business Type: ${businessType}` : ''}

// Requirements:
// - Each query should be natural and conversational
// - Queries should cover different angles: comparisons, alternatives, best practices, recommendations, how-to questions
// - Do not mention the brand name "${brandName}" directly in the queries
// - Focus on the problem space or category, not the specific brand
// - Return ONLY a JSON array of strings, nothing else

// Example format:
// ["query 1", "query 2", "query 3", ...]`;

//     try {
//         // Use Gemini to generate queries (it's free!)
//         const result = await queryGemini(prompt);
        
//         if (result.error) {
//             throw new Error(result.error);
//         }
        
//         // Parse the JSON response
//         const jsonMatch = result.response.match(/\[[\s\S]*\]/);
//         if (!jsonMatch) {
//             throw new Error('Failed to parse queries from response');
//         }
        
//         const queries = JSON.parse(jsonMatch[0]);
        
//         // Ensure we have at least some queries and not more than 10
//         return queries.slice(0, 5);
        
//     } catch (error) {
//         console.error('Error generating queries:', error);
//         throw error;
//     }
// }

// ========================================
// API Routes
// ========================================

async function generateBrandQueries(brandName, websiteUrl = '', businessType = '') {
    const prompt = `Generate 5 diverse search queries that potential customers might ask AI assistants when looking for products or services similar to "${brandName}".

${websiteUrl ? `Website: ${websiteUrl}` : ''}
${businessType ? `Business Type: ${businessType}` : ''}

Requirements:
- Each query should be natural and conversational
- Do not mention the brand name "${brandName}"
- Return ONLY valid JSON array of strings
- No markdown
- No explanations
`;

    try {
        const result = await queryGemini(prompt);

        if (result.error) throw new Error(result.error);

        // 🔥 NEW SAFE PARSER HERE
        const queries = safeJsonArrayParse(result.response);

        return queries.slice(0, 5);

    } catch (error) {
        console.error('Error generating queries:', error.message);

        // 🛡 Fallback queries (so server never crashes)
        return [
            "best tools in this category",
            "top services for small business",
            "affordable solutions for startups",
            "how to choose the right provider",
            "alternatives to popular platforms"
        ];
    }
}

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

/**
 * Generate brand queries endpoint
 */
app.post('/api/generate-queries', async (req, res) => {
    try {
        const { brandName, websiteUrl, businessType } = req.body;
        
        if (!brandName) {
            return res.status(400).json({ error: 'Brand name is required' });
        }
        
        const queries = await generateBrandQueries(brandName, websiteUrl, businessType);
        
        res.json({ queries });
        
    } catch (error) {
        console.error('Generate queries error:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to generate queries'
        });
    }
});

/**
 * Check brand visibility endpoint
 */
app.post('/api/check-visibility', async (req, res) => {
    try {
        const { brandName, queries } = req.body;
        
        // Validation
        if (!brandName) {
            return res.status(400).json({ error: 'Brand name is required' });
        }
        
        if (!queries || !Array.isArray(queries) || queries.length === 0) {
            return res.status(400).json({ error: 'At least one query is required' });
        }
        
        if (queries.length > 5) {
            return res.status(400).json({ error: 'Maximum 10 queries allowed' });
        }
        
        // Process each query
        const results = await Promise.all(
            queries.map(async (query) => {
                // Query both models
                const [gptResult, geminiResult] = await Promise.all([
                    queryGPT(query),
                    queryGemini(query)
                ]);
                
                // Check brand mentions
                const gptAnalysis = checkBrandMention(gptResult.response, brandName);
                const geminiAnalysis = checkBrandMention(geminiResult.response, brandName);
                
                return {
                    query,
                    gpt: {
                        response: gptResult.response,
                        mentioned: gptAnalysis.mentioned,
                        references: gptAnalysis.references,
                        searchLinks: gptResult.searchLinks,
                        error: gptResult.error
                    },
                    gemini: {
                        response: geminiResult.response,
                        mentioned: geminiAnalysis.mentioned,
                        references: geminiAnalysis.references,
                        searchLinks: geminiResult.searchLinks,
                        error: geminiResult.error
                    }
                };
            })
        );
        
        // Calculate summary statistics
        const totalQueries = results.length;
        const gptMentions = results.filter(r => r.gpt.mentioned).length;
        const geminiMentions = results.filter(r => r.gemini.mentioned).length;
        
        const summary = {
            gpt: {
                visibilityScore: (gptMentions / totalQueries) * 100,
                mentions: gptMentions,
                total: totalQueries
            },
            gemini: {
                visibilityScore: (geminiMentions / totalQueries) * 100,
                mentions: geminiMentions,
                total: totalQueries
            }
        };
        
        res.json({
            brandName,
            summary,
            results
        });
        
    } catch (error) {
        console.error('Check visibility error:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to check visibility'
        });
    }
});

// ========================================
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
      temperature: 0.3  // Slightly higher for more creative/varied analysis
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
  } catch {
    console.log("⚠️ AI JSON invalid. Returning fallback.");
    return {
      overallScore: 0,
      businessClassification: "Unknown",
      qualityCoverage: 0,
      criticalPages: 0,
      totalPages: 0,
      recommendations: 0,
      visibilityPredictions: [],
      fanOutQueries: [],
      actionPlan: [],
      technicalFindings: {
        hasStructuredData: false,
        hasMetaDescriptions: false,
        hasOpenGraph: false,
        contentQuality: "poor",
        crawlability: "poor"
      }
    };
  }


  return parsed;
}



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started successfully`);
  console.log(`📡 Listening on port ${PORT}`);
});