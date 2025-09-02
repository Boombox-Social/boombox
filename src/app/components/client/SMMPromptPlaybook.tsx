// File Structure: src/app/components/client/SMMPromptPlaybook.tsx - Updated with Agency AI Content Playbook workflow
"use client";
import React, { useState } from "react";
import { Client } from "../../types";
import { PromptCard } from "./PromptCard";

const colors = {
  bg: "#181A20",
  side: "#23262F",
  card: "#23262F",
  accent: "#2563eb",
  text: "#F1F5F9",
  muted: "#94A3B8",
  border: "#2D3142",
  hover: "#1E40AF",
  success: "#10B981",
  warning: "#F59E0B",
};

interface SMMPromptPlaybookProps {
  client: Client;
}

export function SMMPromptPlaybook({ client }: SMMPromptPlaybookProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "Master Prompt", description: "Feed AI with client data" },
    { title: "Business Summary", description: "Generate overview" },
    { title: "Content Creation", description: "Generate specific content" },
  ];

  // Generate client profile string for prompts
  const generateClientProfile = () => {
    return `
Client Profile:
* Brand Name: ${client.name}
* Slogan: ${client.slogan || "Not provided"}
* Industry: ${client.industry || "Not specified"}
* Value Proposition: ${client.uniqueProposition || "Not specified"}
* Target Audience: ${client.idealCustomers || "Not specified"}
* Brand Voice & Emotion: ${client.brandEmotion || "Professional"}
* Primary Goals: ${client.mainGoal || "Not specified"}
* Short Term Goal: ${client.shortTermGoal || "Not specified"}
* Long Term Goal: ${client.longTermGoal || "Not specified"}
* Why Choose Us: ${client.whyChooseUs || "Not specified"}
* Core Products/Services: ${client.coreProducts?.join(", ") || "Not specified"}
* Direct Competitors: ${client.competitors?.join(", ") || "None specified"}
* Indirect Competitors: ${
      client.indirectCompetitors?.join(", ") || "None specified"
    }
* Social Links: ${client.links?.join(", ") || "Not provided"}
* Contract Deliverables: ${
      client.contractDeliverables || "Not specified"
    }`.trim();
  };

  return (
    <div
      style={{
        background: colors.card,
        borderRadius: 16,
        padding: 24,
        gridColumn: "2",
        gridRow: "1 / span 2",
        minWidth: 0,
        minHeight: 0,
        overflowY: "auto",
        maxHeight: "calc(100vh - 120px)",
        position: "relative",
      }}
      className="boombox-scrollbar"
    >
      <style>{`
        .boombox-scrollbar::-webkit-scrollbar {
          width: 10px;
          background: transparent;
        }
        .boombox-scrollbar::-webkit-scrollbar-thumb {
          background: #2563eb;
          border-radius: 8px;
          border: 2px solid #181A20;
          box-shadow: 0 0 6px 2px rgba(37,99,235,0.25);
          min-height: 40px;
          transition: background 0.2s;
        }
        .boombox-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3b82f6;
        }
        .boombox-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .boombox-scrollbar {
          scrollbar-color: #2563eb transparent;
          scrollbar-width: thin;
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          fontWeight: 700,
          fontSize: 18,
          marginBottom: 8,
          color: colors.accent,
        }}
      >
        📘 The Agency AI Content Playbook
      </div>

      <div
        style={{
          fontSize: 14,
          color: colors.muted,
          marginBottom: 20,
          lineHeight: 1.4,
        }}
      >
        This project hub is designed as a training manual and quick-reference
        guide for your team. By integrating AI into your workflow, you can
        empower your team to be more strategic and efficient.
      </div>

      {/* AI Platform Links */}
      <div
        style={{
          background: colors.bg,
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
          border: `1px solid ${colors.border}`,
        }}
      >
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: colors.text,
            marginBottom: 12,
          }}
        >
          🤖 Quick AI Access
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {/* ChatGPT Link */}
          <a
            href="https://chat.openai.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: colors.accent,
              color: colors.text,
              padding: "12px 16px",
              borderRadius: 8,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 14,
              fontWeight: 600,
              transition: "background 0.2s",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.accent;
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
              }}
            >
              🧠
            </div>
            <div>
              <div>ChatGPT</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>OpenAI's GPT-4</div>
            </div>
          </a>

          {/* Google Gemini Link */}
          <a
            href="https://gemini.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#34A853",
              color: colors.text,
              padding: "12px 16px",
              borderRadius: 8,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 14,
              fontWeight: 600,
              transition: "background 0.2s",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#2E7D32";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#34A853";
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
              }}
            >
              ✨
            </div>
            <div>
              <div>Gemini</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>Google AI</div>
            </div>
          </a>
        </div>

        <div
          style={{
            background: `${colors.success}20`,
            border: `1px solid ${colors.success}40`,
            borderRadius: 8,
            padding: 12,
            marginTop: 16,
            color: colors.text,
            fontSize: 13,
          }}
        >
          💡 <strong>Pro Tip:</strong> Use Deep Research Mode in ChatGPT or
          enable web search in Gemini for better results with current data.
        </div>
      </div>

      {/* Step Navigation */}
      <div
        style={{
          display: "flex",
          marginBottom: 20,
          background: colors.bg,
          borderRadius: 8,
          padding: 4,
          border: `1px solid ${colors.border}`,
        }}
      >
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 6,
              border: "none",
              background: currentStep === index ? colors.accent : "transparent",
              color: currentStep === index ? colors.text : colors.muted,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div>{step.title}</div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>{step.description}</div>
          </button>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 0 && (
        <div>
          <div
            style={{
              background: `${colors.warning}20`,
              border: `1px solid ${colors.warning}40`,
              borderRadius: 8,
              padding: 16,
              marginBottom: 20,
              color: colors.text,
            }}
          >
            <h4
              style={{
                color: colors.warning,
                margin: 0,
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              ⚠️ Before using this prompt:
            </h4>
            <ul
              style={{
                margin: 0,
                paddingLeft: 16,
                fontSize: 13,
                lineHeight: 1.4,
              }}
            >
              <li>Always input answers from the Client Data Form first</li>
              <li>
                Run in Deep Research Mode so it can pull and summarize current
                data
              </li>
              <li>Copy the client profile data below to feed into your AI</li>
            </ul>
          </div>

          {/* Client Profile Data */}
          <div
            style={{
              background: colors.bg,
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
              border: `1px solid ${colors.border}`,
            }}
          >
            <h4
              style={{
                color: colors.text,
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              📋 Client Profile Data (Copy this first)
            </h4>
            <pre
              style={{
                background: colors.border,
                padding: 12,
                borderRadius: 6,
                fontSize: 11,
                color: colors.text,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                margin: 0,
                lineHeight: 1.4,
                maxHeight: 200,
                overflowY: "auto",
              }}
            >
              {generateClientProfile()}
            </pre>
          </div>

          {/* Master Prompt */}
          <PromptCard
            title="🎯 Master Social Media Expert Idea Prompt"
            prompts={[
              {
                label: "Complete Master Strategy Prompt",
                content: `You are a senior social media strategist for a marketing agency. Your task is to develop a comprehensive and actionable brand strategy for ${
                  client.name
                }. This strategy must address the client&apos;s marketing challenges, leverage their competitive advantages, and be designed to achieve measurable business goals.

${generateClientProfile()}

Your Task:
Create a detailed social media content and brand strategy for the upcoming months. Your response should include the following sections, each with specific recommendations:

1. Brand Strategy Overview: A brief summary of the core brand message and how the content will be used to enhance online presence and foster an emotional connection with the audience.

2. Content Pillars & Tactics: Based on the brand's goals and unique value proposition, outline 3-4 key content pillars. For each pillar, provide specific content ideas and formats (e.g., static posts, video reels, interactive content) that directly address the clients challenges and goals.

3. Platform-Specific Recommendations: Detail how to leverage each of the primary channels and secondary channels to create a cohesive funnel.

4. Performance & Measurement: Conclude with a plan for how the success of the strategy will be measured, linking your content ideas to key metrics like Page Reach, Follower Growth, and Link Clicks.`,
              },
            ]}
          />
        </div>
      )}

      {currentStep === 1 && (
        <div>
          <PromptCard
            title="📝 Business Summary Prompt"
            prompts={[
              {
                label: "Complete Business Summary Generator",
                content: `You are a senior marketing strategist. Your task is to create a clear, beginner-friendly summary of ${
                  client.name
                } so that a new social media marketer can quickly understand the business.

Please structure your response with the following sections:

**Business Overview** – A 3–4 sentence summary of what the business does, its products/services, and its unique selling points.

**Target Audience** – Who the business serves, including demographics, behaviors, and pain points, written in plain language.

**Brand Personality & Voice** – The tone and style the business uses when communicating (e.g., friendly, professional, witty).

**Key Selling Points** – 3–5 bullet points that explain why customers choose this business over competitors.

**Marketing Goals** – The main outcomes the business wants from social media (e.g., awareness, lead generation, online sales).

**Dont Miss** – Any special considerations like seasonal trends, industry sensitivities, or compliance rules.

**Instructions:**
- Write the summary in simple, non-technical language so that someone new to the industry can immediately understand it
- Avoid jargon
- Base your response on this client data:

${generateClientProfile()}`,
              },
            ]}
          />
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <PromptCard
            title="🎨 Content Creation Template"
            prompts={[
              {
                label: "Complete Content Creation Process",
                content: `You are a senior social media strategist. Using the clients Data Form responses (including contract deliverables, goals, and brand profile), create social media content for ${
                  client.name
                }.

Follow this process:

1. Generate an initial version of the content plan based on the deliverables.
2. Critically evaluate your own output, identifying at least 3 specific weaknesses.
3. Create an improved version addressing those weaknesses.
4. Repeat steps 2–3 two more times, with each iteration focusing on different aspects of improvement (clarity, creativity, alignment with client goals).
5. Present the final, most refined version.

**Content Requirements:**
${
  client.contractDeliverables
    ? `Contract Deliverables: ${client.contractDeliverables}`
    : "Please specify content requirements based on client needs"
}

For each deliverable, include:
- Post Type & Format (Static, Reel, Carousel, etc.)
- Content Theme/Pillar (aligned with clients brand pillars)
- Sample Caption/Copy (drafted in clients brand voice)
- CTA (Call-to-Action) (aligned with campaign goal)
- Visual/Creative Idea (clear direction for design team)

**Client Context:**
${generateClientProfile()}`,
              },
            ]}
          />

          {/* Practical Prompt Frameworks */}
          <PromptCard
            title="📋 Practical Prompt Frameworks"
            prompts={[
              {
                label: "Ad Copy Prompt",
                content: `Write 3 variations of a [platform] ad headline and caption for ${
                  client.coreProducts?.join(", ") || "[clients product/service]"
                }.
Tone: ${client.brandEmotion || "[insert brand voice]"}.
Each headline max 10 words.
Each caption should include a strong CTA and highlight the ${
                  client.uniqueProposition || "[unique value proposition]"
                }.`,
              },
              {
                label: "Carousel Content Prompt",
                content: `Generate a 5-slide Instagram carousel for ${
                  client.name
                } about [theme/product].
For each slide, provide:
- Slide Title
- Key Insight/Message
- Suggested Visual
- CTA (if applicable)
Brand voice: ${client.brandEmotion || "Professional"}`,
              },
              {
                label: "Video/Reel Script Prompt",
                content: `Write a 30-second script for an Instagram Reel about ${
                  client.coreProducts?.join(" or ") || "[product/service]"
                }.
Requirements:
- Hook viewers in the first 3 seconds
- Highlight main product benefit
- Include brand personality: ${client.brandEmotion || "[insert tone/voice]"}
- End with a clear CTA
- Target audience: ${client.idealCustomers || "[target audience]"}`,
              },
              {
                label: "Static Post Caption Prompt",
                content: `Write 5 static post captions for Instagram focused on ${
                  client.coreProducts?.join(", ") || "[theme/product]"
                }.
Each caption should:
- Stay within 150 words
- Align with the brand voice: ${client.brandEmotion || "[insert voice]"}
- End with a relevant CTA
- Suggest 1–2 matching visual ideas
- Target: ${client.idealCustomers || "[target audience]"}`,
              },
              {
                label: "Monthly Calendar Prompt",
                content: `Using ${client.name}'s deliverables (${
                  client.contractDeliverables ||
                  "[X static, X dynamic, X carousel, etc.]"
                }), create a 1-month content calendar.
For each week, provide:
- Post type & platform
- Theme/pillar
- Caption draft
- Suggested visual
- CTA
Brand context: ${client.brandEmotion || "Professional tone"}, targeting ${
                  client.idealCustomers || "[target audience]"
                }`,
              },
            ]}
          />

          {/* Competitor Analysis (if available) */}
          {client.competitors && client.competitors.length > 0 && (
            <PromptCard
              title="🔍 Competitor Analysis"
              prompts={[
                {
                  label: "Competitor & Inspiration Analysis",
                  content: `Analyze these competitor brands: ${client.competitors.join(
                    ", "
                  )}.
${
  client.indirectCompetitors && client.indirectCompetitors.length > 0
    ? `Also consider these indirect competitors: ${client.indirectCompetitors.join(
        ", "
      )}.`
    : ""
}

Summarize:
1. **Strengths in their social content** - What are they doing well?
2. **Weaknesses/gaps we can exploit** - Where are the opportunities?
3. **Content ideas we can adapt** for ${
                    client.name
                  } while maintaining our unique brand voice (${
                    client.brandEmotion || "professional"
                  })
4. **Platform strategies** - Which platforms are they using effectively?
5. **Differentiation opportunities** - How can ${client.name} stand out?

Context: ${client.name} serves ${
                    client.idealCustomers || "[target audience]"
                  } and specializes in ${
                    client.coreProducts?.join(", ") || "[products/services]"
                  }.`,
                },
              ]}
            />
          )}

          {/* Measurement & Iteration */}
          <div
            style={{
              background: colors.bg,
              borderRadius: 12,
              padding: 16,
              marginTop: 20,
              border: `1px solid ${colors.border}`,
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: colors.text,
                marginBottom: 12,
              }}
            >
              📊 Measurement & Iteration Loop
            </h3>
            <div style={{ color: colors.muted, fontSize: 13, lineHeight: 1.6 }}>
              <strong>Week 1:</strong> Gather analytics → find top performers
              <br />
              <strong>Week 2:</strong> AI ideation based on insights
              <br />
              <strong>Weeks 3–4:</strong> Refine, create variations, A/B test
              <br />
              <br />
              <em>
                This creates a closed-loop system where AI isn't just used once,
                but continuously adapted to client data.
              </em>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
