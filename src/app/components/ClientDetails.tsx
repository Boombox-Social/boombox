type ClientDetailsProps = { client: any };
import React, { useState, useRef } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
// Modal for viewing images or PDFs
function FileModal({
  file,
  onClose,
}: {
  file: File | { name: string; type: string; url: string } | null;
  onClose: () => void;
}) {
  if (!file) return null;
  const isImage = file.type.startsWith("image/");
  const isPDF = file.type === "application/pdf";
  const url = file instanceof File ? URL.createObjectURL(file) : file.url;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(24,26,32,0.85)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#23262F",
          padding: 24,
          borderRadius: 12,
          maxWidth: "90vw",
          maxHeight: "90vh",
          boxShadow: "0 8px 40px 0 rgba(0,0,0,0.30)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            float: "right",
            background: "none",
            color: "#F1F5F9",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
            marginBottom: 8,
          }}
        >
          ×
        </button>
        {isImage && (
          <img
            src={url}
            alt={file.name}
            style={{ maxWidth: "80vw", maxHeight: "80vh", borderRadius: 8 }}
          />
        )}
        {isPDF && (
          <iframe
            src={url}
            title={file.name}
            style={{
              width: "80vw",
              height: "80vh",
              border: "none",
              background: "#fff",
            }}
          />
        )}
        {!isImage && !isPDF && (
          <span style={{ color: "#F1F5F9" }}>{file.name}</span>
        )}
      </div>
    </div>
  );
}
import FilePreview from "./FilePreview";

const colors = {
  bg: "#181A20",
  side: "#23262F",
  card: "#23262F",
  accent: "#2563eb",
  text: "#F1F5F9",
  muted: "#94A3B8",
  border: "#2D3142",
  hover: "#1E40AF",
};

import { useEffect } from "react";
export default function ClientDetails({ client }: ClientDetailsProps) {
  const [modalFile, setModalFile] = useState<
    File | { name: string; type: string; url: string } | null
  >(null);
  const [editing, setEditing] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  // Info fields
  const [industry, setIndustry] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [linksInput, setLinksInput] = useState("");
  const [niche, setNiche] = useState("");
  const [businessAge, setBusinessAge] = useState("");
  const [description, setDescription] = useState("");
  const [coreProducts, setCoreProducts] = useState<string[]>([]);
  const [coreProductsInput, setCoreProductsInput] = useState("");
  const [idealCustomer, setIdealCustomer] = useState("");
  const [brandEmotion, setBrandEmotion] = useState("");
  const [uniqueSelling, setUniqueSelling] = useState("");
  const [mainGoal, setMainGoal] = useState("");
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [competitorsInput, setCompetitorsInput] = useState("");
  const [inspo, setInspo] = useState<string[]>([]);
  const [inspoInput, setInspoInput] = useState("");
  const [brandGuideFiles, setBrandGuideFiles] = useState<any[]>([]);
  const [brandColors, setBrandColors] = useState("");
  const [brandColorsFiles, setBrandColorsFiles] = useState<any[]>([]);
  const [fontUsed, setFontUsed] = useState("");

  // When client changes, update all fields
  useEffect(() => {
    setIndustry(client.industry || "");
    setLinks([]); // or client.links if you add links to client data
    setLinksInput("");
    setNiche(client.niche || "");
    setBusinessAge(client.businessAge || "");
    setDescription(client.description || "");
    setCoreProducts(client.coreProducts || []);
    setCoreProductsInput("");
    setIdealCustomer(client.idealCustomer || "");
    setBrandEmotion(client.brandEmotion || "");
    setUniqueSelling(client.uniqueSelling || "");
    setMainGoal(client.mainGoal || "");
    setCompetitors(client.competitors || []);
    setCompetitorsInput("");
    setInspo(client.inspo || []);
    setInspoInput("");
    setBrandGuideFiles([]);
    setBrandColors(client.brandColors || "");
    setBrandColorsFiles([]);
    setFontUsed(client.fontUsed || "");
    setGeneratedPrompt("");
  }, [client]);
  // File input refs
  const brandGuideInput = useRef<HTMLInputElement>(null);
  const brandColorsInput = useRef<HTMLInputElement>(null);
  // Existing fields
  const [brandVoiceFiles, setBrandVoiceFiles] = useState<any[]>([]);
  const [marketingAssets, setMarketingAssets] = useState<any[]>([]);
  const brandVoiceInput = useRef<HTMLInputElement>(null);
  const marketingAssetsInput = useRef<HTMLInputElement>(null);
  // Tag adders
  const addCoreProduct = () => {
    if (coreProductsInput.trim()) {
      setCoreProducts([
        ...coreProducts,
        ...coreProductsInput
          .trim()
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      ]);
      setCoreProductsInput("");
    }
  };
  const removeCoreProduct = (idx: number) =>
    setCoreProducts(coreProducts.filter((_, i) => i !== idx));
  const addCompetitor = () => {
    if (competitorsInput.trim()) {
      setCompetitors([
        ...competitors,
        ...competitorsInput
          .trim()
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      ]);
      setCompetitorsInput("");
    }
  };
  const removeCompetitor = (idx: number) =>
    setCompetitors(competitors.filter((_, i) => i !== idx));
  const addInspo = () => {
    if (inspoInput.trim()) {
      setInspo([
        ...inspo,
        ...inspoInput
          .trim()
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      ]);
      setInspoInput("");
    }
  };
  const removeInspo = (idx: number) =>
    setInspo(inspo.filter((_, i) => i !== idx));
  const addLink = () => {
    if (linksInput.trim()) {
      setLinks([
        ...links,
        ...linksInput
          .trim()
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      ]);
      setLinksInput("");
    }
  };
  const removeLink = (idx: number) =>
    setLinks(links.filter((_, i) => i !== idx));
  // File handlers
  const handleBrandGuideUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files)
      setBrandGuideFiles([...brandGuideFiles, ...Array.from(e.target.files)]);
  };
  const handleBrandColorsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files)
      setBrandColorsFiles([...brandColorsFiles, ...Array.from(e.target.files)]);
  };

  // Handlers
  const handleBrandVoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setBrandVoiceFiles([...brandVoiceFiles, ...Array.from(e.target.files)]);
    }
  };
  const handleMarketingAssetsUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setMarketingAssets([...marketingAssets, ...Array.from(e.target.files)]);
    }
  };

  // Bento grid layout with 60%-40% ratio
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "60% 40%",
    gridTemplateRows: "70px 1fr",
    gap: 24,
    padding: "min(5vw, 32px)",
    margin: "0 auto",
    maxWidth: 1200,
    boxSizing: "border-box",
    minHeight: 600,
  };

  return (
    <div style={gridStyle}>
      {/* Top left: Profile container */}
      <div
        style={{
          background: colors.card,
          borderRadius: 16,
          padding: "42px 40px",
          gridColumn: 1,
          gridRow: 1,
          minWidth: 0,
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          gap: 36,
        }}
      >
        <div
          style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}
        >
          {client.logo ? (
            <img
              src={client.logo}
              alt="Logo"
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                objectFit: "cover",
                background: colors.muted,
              }}
            />
          ) : (
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: colors.accent,
              }}
            />
          )}
          {editing && (
            <>
              <input
                type="file"
                accept="image/*"
                id="edit-logo-upload"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      if (typeof client === "object")
                        client.logo = ev.target?.result;
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label
                htmlFor="edit-logo-upload"
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  background: colors.accent,
                  color: colors.text,
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  cursor: "pointer",
                  border: `2px solid ${colors.card}`,
                  boxShadow: "0 1px 4px 0 rgba(0,0,0,0.10)",
                }}
                title="Edit Logo"
              >
                ✎
              </label>
            </>
          )}
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {editing ? (
            <input
              value={client.name}
              onChange={(e) => {
                if (typeof client === "object") client.name = e.target.value;
              }}
              style={{
                fontWeight: 700,
                fontSize: 20,
                width: "100%",
                background: colors.bg,
                color: colors.text,
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                padding: "5px 6px", // more comfortable padding
              }}
            />
          ) : (
            <div
              style={{
                fontWeight: 700,
                fontSize: 20,
                wordBreak: "break-word",
              }}
            >
              {client.name}
            </div>
          )}
          {editing ? (
            <input
              value={client.info}
              onChange={(e) => {
                if (typeof client === "object") client.info = e.target.value;
              }}
              style={{
                color: colors.muted,
                fontSize: 15,
                width: "100%",
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                padding: "5px 6px", // matches name input padding
              }}
            />
          ) : (
            <div
              style={{
                color: colors.muted,
                fontSize: 15,
                wordBreak: "break-word",
              }}
            >
              {client.info}
            </div>
          )}
        </div>
      </div>

      {/* Top right: SMM Prompt Playbook (spans 2 rows, 40% width) */}
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
          maxHeight: 800,
          position: "relative",
        }}
        className="boombox-scrollbar"
      >
        {/* Add custom scrollbar styles for this container only */}
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
        <div
          style={{
            fontWeight: 700,
            fontSize: 18,
            marginBottom: 16,
            color: colors.accent,
          }}
        >
          Boombox-Ready Prompt-Engineered Version
        </div>
        {/* Prompt Categories */}
        <div
          style={{
            fontWeight: 700,
            fontSize: 16,
            marginBottom: 10,
            color: colors.text,
          }}
        >
          Content Ideas & Strategy
        </div>
        <div style={{ marginBottom: 12 }}>
          <b>Post Ideas</b>
          <div style={{ fontSize: 14, color: colors.muted, marginBottom: 6 }}>
            "Act as a social media straasdasdtegist for a [industry] brand
            targeting [audience type]. Suggest 10 post ideas that include a
            balanced mix of educational, entertaining, and promotional content.
            Output in a 3-column table: Post Idea, Content Type, Suggested
            Caption."
          </div>
          <b>Monthly Content Calendar</b>
          <div style={{ fontSize: 14, color: colors.muted, marginBottom: 6 }}>
            "You are a content strategist creating a 1-month social media
            calendar for [business name]. Include platform, post type, draft
            caption, and posting frequency. Ensure variety and relevance to the
            brand’s audience."
          </div>
          <b>Trending Topics</b>
          <div style={{ fontSize: 14, color: colors.muted, marginBottom: 6 }}>
            "List 10 trending topics in the [industry] niche relevant for this
            week. For each, suggest a post idea and the platform where it would
            perform best."
          </div>
          <b>Campaign Angles</b>
          <div style={{ fontSize: 14, color: colors.muted, marginBottom: 6 }}>
            "Based on the following brand description: [paste description],
            generate 5 creative campaign angles optimized for brand awareness,
            engagement, and conversions. Include a one-line hook for each
            angle."
          </div>
          <b>Story-Based Ideas</b>
          <div style={{ fontSize: 14, color: colors.muted }}>
            "Suggest 5 emotionally engaging Instagram or Facebook story ideas
            for a [industry] brand targeting [audience type]. Include a
            suggested visual and short caption for each."
          </div>
        </div>
        <hr
          style={{
            border: 0,
            borderTop: `1px solid ${colors.border}`,
            margin: "18px 0",
          }}
        />
        <div
          style={{
            fontWeight: 700,
            fontSize: 16,
            marginBottom: 10,
            color: colors.text,
          }}
        >
          Caption & Copywriting
        </div>
        <div style={{ marginBottom: 12 }}>
          <b>Humorous Captions</b>
          <div style={{ fontSize: 14, color: colors.muted, marginBottom: 6 }}>
            "Write 5 humorous Instagram captions for [product/service] that
            subtly encourage purchases. Limit to 150 characters and include 1-2
            emojis."
          </div>
          <b>Professional LinkedIn Post</b>
          <div style={{ fontSize: 14, color: colors.muted, marginBottom: 6 }}>
            "Create a professional yet friendly LinkedIn post about [topic],
            under 150 words, including a strong opening hook and a closing
            call-to-action."
          </div>
          <b>Playful Rewrite</b>
          <div style={{ fontSize: 14, color: colors.muted, marginBottom: 6 }}>
            "Rewrite this caption to be more playful and engaging while keeping
            the same core message: [paste caption here]. Limit to 2 sentences."
          </div>
          <b>Twitter/X Thread</b>
          <div style={{ fontSize: 14, color: colors.muted, marginBottom: 6 }}>
            "Write a 5-part Twitter/X thread about [topic] that educates the
            audience and encourages replies. Each tweet should be under 250
            characters."
          </div>
          <b>CTA Variations</b>
          <div style={{ fontSize: 14, color: colors.muted }}>
            "Create 3 different call-to-action options for this post: [paste
            post here]. Provide one soft, one direct, and one urgency-based
            CTA."
          </div>
        </div>
        <hr
          style={{
            border: 0,
            borderTop: `1px solid ${colors.border}`,
            margin: "18px 0",
          }}
        />
        <div
          style={{
            fontWeight: 700,
            fontSize: 16,
            marginBottom: 10,
            color: colors.text,
          }}
        >
          Engagement & Interactive Content
        </div>
        <div style={{ marginBottom: 12 }}>
          <b>Poll Ideas</b>
          <div style={{ fontSize: 14, color: colors.muted, marginBottom: 6 }}>
            "Generate 5 poll ideas for [platform] related to [topic]. Each
            should include a short poll question and 3–4 answer options."
          </div>
          <b>Quiz-Style Stories</b>
          <div style={{ fontSize: 14, color: colors.muted, marginBottom: 6 }}>
            "Suggest 10 Instagram quiz-style story ideas for a [industry] brand.
            Include the quiz question, 3 answer choices, and the correct
            answer."
          </div>
          <b>Conversation Starters</b>
          <div style={{ fontSize: 14, color: colors.muted, marginBottom: 6 }}>
            "List 5 conversation starter questions for Facebook that will
            encourage comments and shares for a [industry] audience."
          </div>
          <b>Social Media Challenge</b>
          <div style={{ fontSize: 14, color: colors.muted }}>
            "Suggest a fun social media challenge idea related to
            [product/service] that encourages user-generated content. Include
            participation instructions and a branded hashtag."
          </div>
        </div>
        <hr
          style={{
            border: 0,
            borderTop: `1px solid ${colors.border}`,
            margin: "18px 0",
          }}
        />
        <div
          style={{
            fontWeight: 700,
            fontSize: 16,
            marginBottom: 10,
            color: colors.text,
          }}
        >
          Platform-Specific
        </div>
        <div style={{ marginBottom: 12 }}>
          <b>TikTok Script</b>
          <div style={{ fontSize: 14, color: colors.muted, marginBottom: 6 }}>
            "Act as a TikTok creator. Write a 15-second video script about
            [topic] using a trending sound, with a hook in the first 3 seconds
            and a call-to-action at the end."
          </div>
          <b>Instagram Carousel</b>
          <div style={{ fontSize: 14, color: colors.muted, marginBottom: 6 }}>
            "Develop a 5-slide Instagram carousel teaching [topic]. Include a
            headline for each slide and a closing call-to-action."
          </div>
          <b>Facebook Launch Post</b>
          <div style={{ fontSize: 14, color: colors.muted, marginBottom: 6 }}>
            "Write a Facebook post introducing [new product/service] that sparks
            discussion in the comments. Include a question at the end to prompt
            engagement."
          </div>
          <b>LinkedIn Thought Leadership</b>
          <div style={{ fontSize: 14, color: colors.muted }}>
            "Generate 3 LinkedIn post ideas that position [business name] as a
            thought leader in [industry]. Include suggested headlines and 2–3
            talking points for each."
          </div>
        </div>
        <hr
          style={{
            border: 0,
            borderTop: `1px solid ${colors.border}`,
            margin: "18px 0",
          }}
        />
        <div
          style={{
            fontWeight: 700,
            fontSize: 16,
            marginBottom: 10,
            color: colors.text,
          }}
        >
          Optimization & Refinement
        </div>
        <div>
          <b>Concise Caption</b>
          <div style={{ fontSize: 14, color: colors.muted, marginBottom: 6 }}>
            "Make the following caption more concise while keeping the same tone
            and message: [paste caption here]. Limit to 120 characters."
          </div>
          <b>Professional Rewrite</b>
          <div style={{ fontSize: 14, color: colors.muted, marginBottom: 6 }}>
            "Rewrite this casual caption into a professional LinkedIn-ready
            post: [paste caption here]. Keep under 100 words."
          </div>
          <b>Humor + Memes</b>
          <div style={{ fontSize: 14, color: colors.muted, marginBottom: 6 }}>
            "Add humor and 1 trending meme reference to this post idea: [paste
            post idea here]. Ensure it still aligns with the brand’s tone."
          </div>
          <b>Hashtag Suggestions</b>
          <div style={{ fontSize: 14, color: colors.muted }}>
            "Suggest 5 niche-specific and trending hashtags for a [industry]
            post aimed at [audience type]. Include mix of broad and targeted
            tags."
          </div>
        </div>
      </div>

      {/* Bottom left: Info container (inputs only in edit mode, button in header) */}
      <div
        style={{
          background: colors.card,
          borderRadius: 16,
          padding: 24,
          gridColumn: 1,
          gridRow: 2,
          minWidth: 0,
          minHeight: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 24 }}>
            Business/Brand Information
          </div>
          <button
            style={{
              background: colors.accent,
              color: colors.text,
              border: "none",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
            onClick={() => setEditing((e) => !e)}
            title={editing ? "Save" : "Edit"}
          >
            {editing ? (
              <>
                {/* Save icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  style={{ width: 20, height: 20 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </>
            ) : (
              <>
                {/* Pencil (edit) icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  style={{ width: 20, height: 20 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 3.487a2.1 2.1 0 1 1 2.97 2.97L7.5 18.79l-4 1 1-4 14.362-14.303z"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {/* Industry */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontWeight: 800, marginBottom: 4 }}>Industry</div>
            {editing ? (
              <input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                style={{
                  width: "100%",
                  background: colors.bg,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  padding: 4,
                  outline: editing ? `2px solid ${colors.accent}` : undefined,
                }}
              />
            ) : (
              <div>
                {industry ? (
                  industry
                ) : (
                  <span style={{ color: colors.muted }}>—</span>
                )}
              </div>
            )}
          </div>
          {/* Links */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontWeight: 800, marginBottom: 4 }}>
              Social Media & Website Links
            </div>
            {editing ? (
              <>
                <input
                  value={linksInput}
                  onChange={(e) => setLinksInput(e.target.value)}
                  placeholder="Add links, comma separated"
                  style={{
                    width: "100%",
                    background: colors.bg,
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 6,
                    padding: 4,
                    outline: editing ? `2px solid ${colors.accent}` : undefined,
                  }}
                />
                <button
                  onClick={addLink}
                  style={{
                    fontSize: 13,
                    margin: "8px 0", // space above and below
                    background: "transparent", // no solid fill
                    color: colors.accent, // text color matches outline
                    border: `2px solid ${colors.accent}`, // outlined
                    borderRadius: 6,
                    padding: "6px 14px", // more padding for comfort
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    cursor: "pointer",
                    boxShadow: "0 1px 4px 0 rgba(37,99,235,0.10)",
                  }}
                >
                  <PlusIcon width={16} height={16} style={{ marginRight: 2 }} />{" "}
                  Add
                </button>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 4,
                    marginTop: 4,
                  }}
                >
                  {links.map((link, idx) => (
                    <span
                      key={link + idx}
                      style={{
                        background: colors.accent,
                        color: colors.text,
                        borderRadius: 6,
                        padding: "2px 8px",
                        marginRight: 2,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: colors.text,
                          textDecoration: "underline",
                        }}
                      >
                        {link}
                      </a>
                      <button
                        onClick={() => removeLink(idx)}
                        style={{
                          marginLeft: 4,
                          background: "none",
                          border: "none",
                          color: colors.text,
                          cursor: "pointer",
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {links.length === 0 ? (
                  <span style={{ color: colors.muted }}>—</span>
                ) : (
                  links.map((link, idx) => (
                    <a
                      key={link + idx}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: colors.accent,
                        textDecoration: "underline",
                        marginRight: 6,
                      }}
                    >
                      {link}
                    </a>
                  ))
                )}
              </div>
            )}
          </div>
          {/* Niche */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontWeight: 800, marginBottom: 4 }}>Niche</div>
            {editing ? (
              <input
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                style={{
                  width: "100%",
                  background: colors.bg,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  padding: 4,
                  outline: editing ? `2px solid ${colors.accent}` : undefined,
                }}
              />
            ) : (
              <div>
                {niche ? niche : <span style={{ color: colors.muted }}>—</span>}
              </div>
            )}
          </div>
          {/* Business Age */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontWeight: 800, marginBottom: 4 }}>Business Age</div>
            {editing ? (
              <input
                value={businessAge}
                onChange={(e) => setBusinessAge(e.target.value)}
                style={{
                  width: "100%",
                  background: colors.bg,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  padding: 4,
                  outline: editing ? `2px solid ${colors.accent}` : undefined,
                }}
              />
            ) : (
              <div>
                {businessAge ? (
                  businessAge
                ) : (
                  <span style={{ color: colors.muted }}>—</span>
                )}
              </div>
            )}
          </div>
          {/* Description */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontWeight: 800, marginBottom: 4 }}>
              Short Description
            </div>
            {editing ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: "100%",
                  background: colors.bg,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  padding: 4,
                  outline: editing ? `2px solid ${colors.accent}` : undefined,
                }}
              />
            ) : (
              <div>
                {description ? (
                  description
                ) : (
                  <span style={{ color: colors.muted }}>—</span>
                )}
              </div>
            )}
          </div>
          {/* Core Products/Services */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontWeight: 800, marginBottom: 4 }}>
              Core Products/Services
            </div>
            {editing ? (
              <>
                <input
                  value={coreProductsInput}
                  onChange={(e) => setCoreProductsInput(e.target.value)}
                  placeholder="Add products/services, comma separated"
                  style={{
                    width: "100%",
                    background: colors.bg,
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 6,
                    padding: 4,
                    outline: editing ? `2px solid ${colors.accent}` : undefined,
                  }}
                />
                <button
                  onClick={addLink}
                  style={{
                    fontSize: 13,
                    margin: "8px 0", // space above and below
                    background: "transparent", // no solid fill
                    color: colors.accent, // text color matches outline
                    border: `2px solid ${colors.accent}`, // outlined
                    borderRadius: 6,
                    padding: "6px 14px", // more padding for comfort
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    cursor: "pointer",
                    boxShadow: "0 1px 4px 0 rgba(37,99,235,0.10)",
                  }}
                >
                  <PlusIcon width={16} height={16} style={{ marginRight: 2 }} />{" "}
                  Add
                </button>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 4,
                    marginTop: 4,
                  }}
                >
                  {coreProducts.map((prod, idx) => (
                    <span
                      key={prod + idx}
                      style={{
                        background: colors.accent,
                        color: colors.text,
                        borderRadius: 6,
                        padding: "2px 8px",
                        marginRight: 2,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {prod}
                      <button
                        onClick={() => removeCoreProduct(idx)}
                        style={{
                          marginLeft: 4,
                          background: "none",
                          border: "none",
                          color: colors.text,
                          cursor: "pointer",
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {coreProducts.length === 0 ? (
                  <span style={{ color: colors.muted }}>—</span>
                ) : (
                  coreProducts.map((prod, idx) => (
                    <span
                      key={prod + idx}
                      style={{
                        background: colors.accent,
                        color: colors.text,
                        borderRadius: 6,
                        padding: "2px 8px",
                        marginRight: 2,
                      }}
                    >
                      {prod}
                    </span>
                  ))
                )}
              </div>
            )}
          </div>
          {/* Ideal Customer */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontWeight: 800, marginBottom: 4 }}>
              Ideal Customer
            </div>
            {editing ? (
              <input
                value={idealCustomer}
                onChange={(e) => setIdealCustomer(e.target.value)}
                style={{
                  width: "100%",
                  background: colors.bg,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  padding: 4,
                  outline: editing ? `2px solid ${colors.accent}` : undefined,
                }}
              />
            ) : (
              <div>
                {idealCustomer ? (
                  idealCustomer
                ) : (
                  <span style={{ color: colors.muted }}>—</span>
                )}
              </div>
            )}
          </div>
          {/* Desired Brand Emotion */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontWeight: 800, marginBottom: 4 }}>
              Desired Brand Emotion
            </div>
            {editing ? (
              <input
                value={brandEmotion}
                onChange={(e) => setBrandEmotion(e.target.value)}
                style={{
                  width: "100%",
                  background: colors.bg,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  padding: 4,
                  outline: editing ? `2px solid ${colors.accent}` : undefined,
                }}
              />
            ) : (
              <div>
                {brandEmotion ? (
                  brandEmotion
                ) : (
                  <span style={{ color: colors.muted }}>—</span>
                )}
              </div>
            )}
          </div>
          {/* Unique Selling Proposition */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontWeight: 800, marginBottom: 4 }}>
              Unique Selling Proposition
            </div>
            {editing ? (
              <input
                value={uniqueSelling}
                onChange={(e) => setUniqueSelling(e.target.value)}
                style={{
                  width: "100%",
                  background: colors.bg,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  padding: 4,
                  outline: editing ? `2px solid ${colors.accent}` : undefined,
                }}
              />
            ) : (
              <div>
                {uniqueSelling ? (
                  uniqueSelling
                ) : (
                  <span style={{ color: colors.muted }}>—</span>
                )}
              </div>
            )}
          </div>
          {/* Main Social Media Goal */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontWeight: 800, marginBottom: 4 }}>
              Main Social Media Goal
            </div>
            {editing ? (
              <input
                value={mainGoal}
                onChange={(e) => setMainGoal(e.target.value)}
                style={{
                  width: "100%",
                  background: colors.bg,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  padding: 4,
                  outline: editing ? `2px solid ${colors.accent}` : undefined,
                }}
              />
            ) : (
              <div>
                {mainGoal ? (
                  mainGoal
                ) : (
                  <span style={{ color: colors.muted }}>—</span>
                )}
              </div>
            )}
          </div>
          {/* Competitors */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontWeight: 800, marginBottom: 4 }}>
              Competitors (3-5)
            </div>
            {editing ? (
              <>
                <input
                  value={competitorsInput}
                  onChange={(e) => setCompetitorsInput(e.target.value)}
                  placeholder="Add competitors, comma separated"
                  style={{
                    width: "100%",
                    background: colors.bg,
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 6,
                    padding: 4,
                    outline: editing ? `2px solid ${colors.accent}` : undefined,
                  }}
                />
                <button
                  onClick={addLink}
                  style={{
                    fontSize: 13,
                    margin: "8px 0", // space above and below
                    background: "transparent", // no solid fill
                    color: colors.accent, // text color matches outline
                    border: `2px solid ${colors.accent}`, // outlined
                    borderRadius: 6,
                    padding: "6px 14px", // more padding for comfort
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    cursor: "pointer",
                    boxShadow: "0 1px 4px 0 rgba(37,99,235,0.10)",
                  }}
                >
                  <PlusIcon width={16} height={16} style={{ marginRight: 2 }} />{" "}
                  Add
                </button>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 4,
                    marginTop: 4,
                  }}
                >
                  {competitors.map((comp, idx) => (
                    <span
                      key={comp + idx}
                      style={{
                        background: colors.accent,
                        color: colors.text,
                        borderRadius: 6,
                        padding: "2px 8px",
                        marginRight: 2,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {comp}
                      <button
                        onClick={() => removeCompetitor(idx)}
                        style={{
                          marginLeft: 4,
                          background: "none",
                          border: "none",
                          color: colors.text,
                          cursor: "pointer",
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {competitors.length === 0 ? (
                  <span style={{ color: colors.muted }}>—</span>
                ) : (
                  competitors.map((comp, idx) => (
                    <span
                      key={comp + idx}
                      style={{
                        background: colors.accent,
                        color: colors.text,
                        borderRadius: 6,
                        padding: "2px 8px",
                        marginRight: 2,
                      }}
                    >
                      {comp}
                    </span>
                  ))
                )}
              </div>
            )}
          </div>
          {/* Inspiration Businesses */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontWeight: 800, marginBottom: 4 }}>
              Inspiration Businesses (3-5)
            </div>
            {editing ? (
              <>
                <input
                  value={inspoInput}
                  onChange={(e) => setInspoInput(e.target.value)}
                  placeholder="Add inspiration, comma separated"
                  style={{
                    width: "100%",
                    background: colors.bg,
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 6,
                    padding: 4,
                    outline: editing ? `2px solid ${colors.accent}` : undefined,
                  }}
                />
                <button
                  onClick={addLink}
                  style={{
                    fontSize: 13,
                    margin: "8px 0", // space above and below
                    background: "transparent", // no solid fill
                    color: colors.accent, // text color matches outline
                    border: `2px solid ${colors.accent}`, // outlined
                    borderRadius: 6,
                    padding: "6px 14px", // more padding for comfort
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    cursor: "pointer",
                    boxShadow: "0 1px 4px 0 rgba(37,99,235,0.10)",
                  }}
                >
                  <PlusIcon width={16} height={16} style={{ marginRight: 2 }} />{" "}
                  Add
                </button>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 4,
                    marginTop: 4,
                  }}
                >
                  {inspo.map((insp, idx) => (
                    <span
                      key={insp + idx}
                      style={{
                        background: colors.accent,
                        color: colors.text,
                        borderRadius: 6,
                        padding: "2px 8px",
                        marginRight: 2,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {insp}
                      <button
                        onClick={() => removeInspo(idx)}
                        style={{
                          marginLeft: 4,
                          background: "none",
                          border: "none",
                          color: colors.text,
                          cursor: "pointer",
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {inspo.length === 0 ? (
                  <span style={{ color: colors.muted }}>—</span>
                ) : (
                  inspo.map((insp, idx) => (
                    <span
                      key={insp + idx}
                      style={{
                        background: colors.accent,
                        color: colors.text,
                        borderRadius: 6,
                        padding: "2px 8px",
                        marginRight: 2,
                      }}
                    >
                      {insp}
                    </span>
                  ))
                )}
              </div>
            )}
          </div>
          {/* Brand Guide/Brand Image */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontWeight: 800, marginBottom: 4 }}>
              Brand Guide/Brand Image
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {brandGuideFiles.map((file, idx) => (
                <div
                  key={file.name + idx}
                  style={{ cursor: "pointer" }}
                  onClick={() => setModalFile(file)}
                >
                  <FilePreview file={file} />
                </div>
              ))}
              {editing && (
                <>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    ref={brandGuideInput}
                    style={{ display: "none" }}
                    onChange={handleBrandGuideUpload}
                  />
                  <button
                    style={{
                      fontSize: 13,
                      color: colors.text,
                      background: colors.accent,
                      border: `1px solid ${colors.accent}`,
                      borderRadius: 6,
                      padding: "6px 14px",
                      cursor: "pointer",
                      textAlign: "center",
                      fontWeight: 600,
                      marginTop: 4,
                      transition: "background 0.2s, color 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = colors.hover)
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = colors.accent)
                    }
                    onClick={() => brandGuideInput.current?.click()}
                  >
                    + Add Image/PDF
                  </button>
                </>
              )}
            </div>
          </div>
          {/* Brand Colors */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontWeight: 800, marginBottom: 4 }}>Brand Colors</div>
            {editing ? (
              <input
                value={brandColors}
                onChange={(e) => setBrandColors(e.target.value)}
                style={{
                  width: "100%",
                  background: colors.bg,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  padding: 4,
                  outline: editing ? `2px solid ${colors.accent}` : undefined,
                }}
              />
            ) : (
              <div>
                {brandColors ? (
                  brandColors
                ) : (
                  <span style={{ color: colors.muted }}>—</span>
                )}
              </div>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                marginTop: 4,
              }}
            >
              {brandColorsFiles.map((file, idx) => (
                <div
                  key={file.name + idx}
                  style={{ cursor: "pointer" }}
                  onClick={() => setModalFile(file)}
                >
                  <FilePreview file={file} />
                </div>
              ))}
              {/* Modal for enlarged file preview */}
              <FileModal file={modalFile} onClose={() => setModalFile(null)} />
              {editing && (
                <>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    ref={brandColorsInput}
                    style={{ display: "none" }}
                    onChange={handleBrandColorsUpload}
                  />
                  <button
                    style={{
                      fontSize: 13,
                      color: colors.text,
                      background: colors.accent,
                      border: `1px solid ${colors.accent}`,
                      borderRadius: 6,
                      padding: "6px 14px",
                      cursor: "pointer",
                      textAlign: "center",
                      fontWeight: 600,
                      marginTop: 4,
                      transition: "background 0.2s, color 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = colors.hover)
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = colors.accent)
                    }
                    onClick={() => brandColorsInput.current?.click()}
                  >
                    + Add Image/PDF
                  </button>
                </>
              )}
            </div>
          </div>
          {/* Font Used */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontWeight: 800, marginBottom: 4 }}>Font Used</div>
            {editing ? (
              <input
                value={fontUsed}
                onChange={(e) => setFontUsed(e.target.value)}
                style={{
                  width: "100%",
                  background: colors.bg,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  padding: 4,
                  outline: editing ? `2px solid ${colors.accent}` : undefined,
                }}
              />
            ) : (
              <div>
                {fontUsed ? (
                  fontUsed
                ) : (
                  <span style={{ color: colors.muted }}>—</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
