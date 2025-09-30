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

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        marginBottom: 16,
        border: `1px solid ${colors.border}`,
        borderRadius: 8,
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          textAlign: "left",
          background: colors.bg,
          color: colors.accent,
          fontWeight: 700,
          fontSize: 15,
          padding: "12px 16px",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        {title} {open ? "▲" : "▼"}
      </button>
      {open && (
        <div
          style={{
            padding: 16,
            background: colors.card,
            color: colors.text,
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function SMMPromptPlaybook({ client }: SMMPromptPlaybookProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Master Prompt Strategy",
      description: "Feed AI with client data",
    },
    { title: "Business Overview", description: "Generate overview" },
    { title: "Content Creation", description: "Generate specific content" },
    { title: "Show all prompts", description: "See all prompt templates" },
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

  // Navigation bar
  const renderStepNav = () => (
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
      {steps.map((step, index) => {
        // Only allow navigation to completed or current steps, or "Show all prompts"
        const isAccessible = index <= currentStep || index === steps.length - 1;
        return (
          <button
            key={index}
            onClick={() => isAccessible && setCurrentStep(index)}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 6,
              border: "none",
              background: currentStep === index ? colors.accent : "transparent",
              color: currentStep === index ? colors.text : colors.muted,
              fontSize: 12,
              fontWeight: 600,
              cursor: isAccessible ? "pointer" : "not-allowed",
              opacity: isAccessible ? 1 : 0.5,
              transition: "all 0.2s",
            }}
            disabled={!isAccessible}
          >
            <div>{step.title}</div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>{step.description}</div>
          </button>
        );
      })}
    </div>
  );

  // "Next" button
  const renderNextButton = () =>
    currentStep < steps.length - 1 ? (
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}
      >
        <button
          onClick={() => setCurrentStep((s) => s + 1)}
          style={{
            background: colors.accent,
            color: colors.text,
            padding: "10px 28px",
            borderRadius: 8,
            border: "none",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          Next
        </button>
      </div>
    ) : null;

  // PromptCard content for each step
  const masterPromptAccordion = (
    <>
      <Accordion title="Complete Strategy Prompt (v1)" defaultOpen>
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
      </Accordion>
      <Accordion title="Complete Strategy Prompt (v2)">
        <PromptCard
          title="🎯 Master Social Media Expert Idea Prompt (v2)"
          prompts={[
            {
              label: "Detailed Campaign Strategy Prompt",
              content: `You are a senior social media strategist for a marketing agency. Your task is to develop a comprehensive and actionable brand strategy for a client. This strategy must address the client's marketing challenges, leverage their competitive advantages, and be designed to achieve measurable business goals, utilizing a structure modeled after a detailed campaign document.

Client Profile (Required Inputs): The strategist must receive the following information about the client brand before generating the strategy:
• Brand Name: ${client.name}
• Slogan/Tagline: ${client.slogan || "Not provided"}
• Industry: ${client.industry || "Not specified"}
• Value Proposition: ${client.uniqueProposition || "Not specified"}
• Target Audience: ${client.idealCustomers || "Not specified"}
• Brand Voice & Emotion: ${client.brandEmotion || "Professional"}
• Primary Goals: ${client.mainGoal || "Not specified"}
• Core Products/Services: ${client.coreProducts?.join(", ") || "Not specified"}
• Direct Competitors: ${client.competitors?.join(", ") || "None specified"}
• Marketing Challenges: [List current business or marketing obstacles, such as planning strategies, executing them effectively, or ensuring long-term sustainability]

Your Task: Create a detailed social media content and brand strategy. Your response must be divided into the following five sections, adopting a comprehensive strategy framework:
1. Executive Summary
Generate a brief but comprehensive overview of the campaign. This summary must include:
• Campaign Aim: State the overall objective (e.g., launching an online presence primarily driving awareness then traffic to e-commerce platforms like Shopee and Lazada).
• Key Message: Define the core brand promise or statement (e.g., Hexatron offers affordable, reliable, and high-quality electronics designed to bring families closer together).
• Key Metrics: List the core awareness metrics that will be tracked (e.g., Visits, Content Interaction, Views, Reach, Follower Growth, Link Clicks).
• Paid Media Overview: Include a summary of the paid media focus and budget (e.g., focusing on awareness, engagement, and traffic using a budget like ₱15,000 for Meta ads).
2. About
Provide a detailed profile of the brand. This section must detail:
• Products/Services: List the main offerings (e.g., Mid-range Smart TV, amplifiers, and party speakers).
• Brand Voice and Personality: Describe the tone and character the brand conveys online (e.g., simple and practical, fun and friendly, always active and engaging, and never boring).
• Marketing Challenges: Summarize the key obstacles the strategy is designed to overcome (e.g., challenges in planning the right strategies, executing them effectively, tracking results, and ensuring long-term sustainability).
3. Competitive & Market Analysis
Analyze the environment by providing detailed competitor insights and a situational analysis. This section must include:
• Competitor Breakdowns (for each direct competitor): Include an overview, their primary product focus, their main marketing channels, and a strategy for "How we can win" against them (e.g., position the brand as offering up-to-date technology at a more accessible price against Devant).
• SWOT Analysis: Structure the analysis clearly, detailing the brand's Strengths (e.g., Quality & Competitive Price, Family-Focused Brand Image), Weaknesses (e.g., Brand Recognition, Offline Presence), Opportunities (e.g., Rising Demand for Home Entertainment, Increasing E-commerce Sales), and Threats (e.g., Established Competitors, Price Sensitivity).
• Industry Trends & Insights: Identify 3-5 current market insights (e.g., More consumer electronics sales are happening online) and state the required Campaign Application for each insight (e.g., Strongly emphasize ease, trust, and accessibility of products through e-commerce platforms).
4. Target Audience
Outline the customer's interaction with the brand, focusing on the path to purchase. This section should include:
• Customer Journey Map: Detail the three stages of the journey—Awareness Stage, Consideration Stage, and Traffic Stage.
• For each stage, identify the key Touchpoint (e.g., Users scrolling through feeds), the Goal for that stage (e.g., Create brand recognition and intrigue), and the specific Actions users will take (e.g., Clicking on "Learn More" buttons leading to product pages).
5. Creative Direction
Define the visual, thematic, and messaging blueprint for the campaign. This section should include:
• Campaign Theme & Tagline: Define the central idea (e.g., "Enjoy Life Together") and the underlying message (e.g., "Because life is brighter, more connected, and more fun when enjoyed together").
• Key Message Pillars: List the 3-4 core values or benefits that will be consistently emphasized (e.g., Affordability, Reliability, Family-Centric, Fun & Enjoyment).
• Campaign Tone: Specify the emotional feeling and interaction style (e.g., fun & friendly, active & engaging, Never Boring).
• Visual and Typographical Elements: Specify core design elements, including primary typography (e.g., Futuru for Product Education and Features) and key visual elements (e.g., the hexagon shape and hexagon ripple) that will strengthen brand association.
`,
            },
          ]}
        />
      </Accordion>
    </>
  );

  const businessOverviewCard = (
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
  );

  const contentCreationCard = (
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
  );

  // All additional prompt cards (shown only in "Show all prompts" step)
  const additionalPromptCards = (
    <>
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
            This creates a closed-loop system where AI isn't just used once, but
            continuously adapted to client data.
          </em>
        </div>
      </div>
    </>
  );

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
      {renderStepNav()}

      {/* Step Content */}
      {currentStep === 0 && (
        <>
          {masterPromptAccordion}
          {renderNextButton()}
        </>
      )}
      {currentStep === 1 && (
        <>
          {businessOverviewCard}
          {renderNextButton()}
        </>
      )}
      {currentStep === 2 && (
        <>
          {contentCreationCard}
          {renderNextButton()}
        </>
      )}
      {currentStep === 3 && (
        <>
          {masterPromptCard}
          {businessOverviewCard}
          {contentCreationCard}
          {additionalPromptCards}
        </>
      )}
    </div>
  );
}
