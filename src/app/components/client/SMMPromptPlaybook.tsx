"use client";
import React, { useState, useEffect } from "react";
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
  const [hasAiStrategyLink, setHasAiStrategyLink] = useState<boolean | null>(
    null
  );
  const [hasOverviewLink, setHasOverviewLink] = useState<boolean | null>(null);

  // Fetch if there is an AI Strategy link
  useEffect(() => {
    const fetchAiStrategyLink = async () => {
      if (!client.id) return;
      try {
        const res = await fetch(`/api/clients/${client.id}/ai-strategy-link`);
        const data = await res.json();
        setHasAiStrategyLink(!!data.strategyAiLink);
      } catch {
        setHasAiStrategyLink(false);
      }
    };
    fetchAiStrategyLink();
  }, [client.id]);

  // Fetch if there is an Overview link
  useEffect(() => {
    const fetchOverviewLink = async () => {
      if (!client.id) return;
      try {
        const res = await fetch(`/api/clients/${client.id}/overview-link`);
        const data = await res.json();
        setHasOverviewLink(!!data.businessSummaryLink);
      } catch {
        setHasOverviewLink(false);
      }
    };
    fetchOverviewLink();
  }, [client.id]);

  // Generate client profile string for prompts
  const generateClientProfile = () => {
    return `
Client Profile:
• Brand Name: ${client.name}
• Address: ${client.address || "Not provided"}
• Slogan/Tagline: ${client.slogan || "Not provided"}
• Industry: ${client.industry || "Not specified"}
• Business Links: ${client.links?.join(", ") || "Not provided"}
• Value Proposition: ${client.uniqueProposition || "Not specified"}
• Target Audience: ${client.idealCustomers || "Not specified"}
• Brand Voice & Emotion: ${client.brandEmotion || "Professional"}
• Primary Goals: ${client.mainGoal || "Not specified"}
• Short Term Goal: ${client.shortTermGoal || "Not specified"}
• Long Term Goal: ${client.longTermGoal || "Not specified"}
• Why Choose Us: ${client.whyChooseUs || "Not specified"}
• Core Products/Services: ${client.coreProducts?.join(", ") || "Not specified"}
• Direct Competitors: ${client.competitors?.join(", ") || "None specified"}
• Indirect Competitors: ${
      client.indirectCompetitors?.join(", ") || "None specified"
    }
• Social Links: ${client.links?.join(", ") || "Not provided"}
• Marketing Challenges: [Please specify current business or marketing obstacles, focusing on planning, execution, tracking, and sustainability]
• Contract Deliverables: ${client.contractDeliverables || "Not specified"}
• Existing Budget for Paid Media: [Please specify paid media budget]`.trim();
  };

  // Steps, conditionally include Master Prompt and Business Overview tabs
  const steps = [
    ...(hasAiStrategyLink
      ? []
      : [
          {
            title: "Master Prompt Strategy",
            description: "Feed AI with client data",
          },
        ]),
    ...(hasOverviewLink
      ? []
      : [
          {
            title: "Business Overview",
            description: "Generate overview",
          },
        ]),
    { title: "Content Creation", description: "Generate specific content" },
    { title: "Show all prompts", description: "See all prompt templates" },
  ];

  // Adjust currentStep if needed when hiding tabs
  useEffect(() => {
    if (hasAiStrategyLink === null || hasOverviewLink === null) return;
    if (currentStep >= steps.length) setCurrentStep(0);
  }, [hasAiStrategyLink, hasOverviewLink, steps.length, currentStep]);

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

  // Master Prompt Card with new comprehensive 8-section structure
  const masterPromptCard = (
    <PromptCard
      title="🎯 Complete Strategy Prompt (8-Section Deep Research)"
      prompts={[
        {
          label: "Comprehensive Brand & Campaign Strategy",
          content: `Role: You are a senior social media strategist for a marketing agency. Your task is to develop a comprehensive and actionable brand strategy for the client. This strategy must strictly adhere to the client's defined content and platform contract deliverables (e.g., Eight static posts, four trendy videos, social listening, and weekly content calendars for Facebook). The strategy must address the client's marketing challenges, leverage any competitive advantages, and be designed to achieve measurable business goals, utilizing a structure modeled after a detailed campaign document.

--------------------------------------------------------------------------------

Required Client Profile Inputs (Must be specified before generating the strategy):
The strategist must receive the following detailed information about the client brand (Current client is ${
            client.name
          }):

${generateClientProfile()}

--------------------------------------------------------------------------------

Mandatory Output Structure (8 Sections for Deep Research):
Your response must be divided into the following eight comprehensive sections, aligning with the detailed campaign document structure:

1. Executive Summary
Generate a brief overview of the campaign. This summary must include the Campaign Aim (stating the overall objective, e.g., launching an online presence primarily driving awareness then traffic to e-commerce platforms like Shopee and Lazada), the Key Message (defining the core brand promise), the Key Metrics (listing the core awareness metrics that will be tracked, e.g., Visits, Content Interaction, Views, Reach, Follower Growth, Link Clicks), and a Paid Media Overview (summarizing focus and budget).

2. About
Provide a detailed profile of the brand. This section must detail:
• Products/Services.
• Brand Voice and Personality (describing the tone, e.g., simple and practical, fun and friendly, never boring).
• Marketing Challenges (summarizing obstacles related to planning, execution, tracking, and long-term sustainability).

3. Competitive & Market Analysis
Analyze the environment by providing detailed insights and a situational analysis:
• Competitor Breakdowns (for each direct competitor): Include the Competitor Overview, their primary product focus, their main marketing channels, and a specific strategy for "How we can win" against them.
• SWOT Analysis: Detail the brand's Strengths (What customers like), Weaknesses (What needs fixing), Opportunities (What the industry wants), and Threats (What could hinder goals).
• Industry Trends & Insights: Identify at least 3-5 current market insights and state the required Campaign Application for each insight (e.g., applying ease and trust given increasing e-commerce sales).

4. Target Audience
Outline the customer's interaction with the brand:
• Target Audience Profile: Detail the specific Age group, Sex, Location, Interests (occupation/hobbies), and Keywords that resonate with them.
• Customer Journey Map: Detail the three stages—Awareness Stage, Consideration Stage, and Traffic Stage.
• For each stage, identify the key Touchpoint, the Goal for that stage, and the specific Actions users will take (e.g., Clicking on "Learn More" buttons leading to product pages).

5. Creative Direction
Define the visual, thematic, and messaging blueprint:
• Campaign Theme & Tagline: Define the central idea (e.g., "Enjoy Life Together").
• Key Message Pillars: List the 3-4 core values or benefits that will be consistently emphasized (e.g., Affordability, Reliability, Family-Centric).
• Campaign Tone: Specify the emotional feeling and interaction style (e.g., fun & friendly, active & engaging, Never Boring).
• Visual and Typographical Elements: Specify core design elements, including primary typography (e.g., Futuru for Product Education) and key visual elements (e.g., the hexagon shape and hexagon ripple) that will strengthen brand association.

6. Campaign Overview & Strategy
Detail the tactical approach based on the research:
• Goals & Targets: State the campaign objective (e.g., Build brand awareness). Include specific Metric Baselines, Benchmarks (Organic), and Paid Media Targets for Reach, Views, Visits, Link Clicks, Content Interactions, and Follower Growth.
• Content Pillars: List the core content themes (e.g., Product Education & Features, Promotions & Special Offers) and describe what this type of content is and how it will be relevant.
• Core Tactics: Detail the specific actions that will be executed (e.g., Social Media Optimization, Paid Social Ads, Launch Discounts, Giveaways).

7. Media Strategy
Outline how different platforms will be utilized:
• Channel Strategy Overview: Define the Primary Channels (e.g., Facebook for awareness, Shopee/Lazada for conversions) and Secondary Channels (e.g., Instagram for supporting awareness).
• Platform-Specific Strategies (e.g., Facebook Strategy): Detail the unique content pillars, post types/formats (e.g., Static Posts vs. Reels/videos), and engagement tactics (e.g., Community Interaction, Contests & Giveaways, Polls & Q&A) for the main social platform(s).
• Paid Media/Ads Strategy: Detail the Objectives (Brand Awareness, E-Commerce Traffic), Targeting Strategy, Platforms & Placements (Facebook, Shopee, Lazada), Ad Formats, and Budget Allocation (e.g., ₱15,000 for Facebook ads).

8. Performance Tracking & Optimization
Conclude with a measurement and optimization plan:
• Key Performance Indicators (KPIs): List the primary metrics to track (aligned with section 1 and 6).
• Reporting Cadence: Specify how often performance will be reviewed (e.g., weekly, monthly).
• Optimization Strategy: Describe how insights will be used to refine content, targeting, and tactics over time.`,
        },
      ]}
    />
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

**Don't Miss** – Any special considerations like seasonal trends, industry sensitivities, or compliance rules.

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
          content: `You are a senior social media strategist. Using the client's Data Form responses (including contract deliverables, goals, and brand profile), create social media content for ${
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
- Content Theme/Pillar (aligned with client's brand pillars)
- Sample Caption/Copy (drafted in client's brand voice)
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
              client.coreProducts?.join(", ") || "[client's product/service]"
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
4. **Differentiation strategy** - How can we stand out?`,
            },
          ]}
        />
      )}
    </>
  );

  // Wait for links check before rendering steps
  if (hasAiStrategyLink === null || hasOverviewLink === null) {
    return (
      <div
        style={{
          background: colors.card,
          borderRadius: 16,
          padding: 24,
          minWidth: 0,
          minHeight: 0,
          color: colors.muted,
        }}
      >
        Loading...
      </div>
    );
  }

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
      {steps[0]?.title === "Master Prompt Strategy" && currentStep === 0 && (
        <>
          {masterPromptCard}
          {renderNextButton()}
        </>
      )}
      {steps.find((s) => s.title === "Business Overview") &&
        steps.findIndex((s) => s.title === "Business Overview") ===
          currentStep && (
          <>
            {businessOverviewCard}
            {renderNextButton()}
          </>
        )}
      {steps.find((s) => s.title === "Content Creation") &&
        steps.findIndex((s) => s.title === "Content Creation") ===
          currentStep && (
          <>
            {contentCreationCard}
            {renderNextButton()}
          </>
        )}
      {currentStep === steps.length - 1 && (
        <>
          {steps.find((s) => s.title === "Master Prompt Strategy") &&
            masterPromptCard}
          {steps.find((s) => s.title === "Business Overview") &&
            businessOverviewCard}
          {contentCreationCard}
          {additionalPromptCards}
        </>
      )}
    </div>
  );
}
