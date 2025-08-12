"use client";
import React, { useState } from "react";
import { UserIcon, Cog6ToothIcon, ChevronLeftIcon, ChevronRightIcon, HomeIcon, PlusIcon } from "@heroicons/react/24/solid";
import ClientDetails from "./components/ClientDetails";
import DashboardContent from "./components/DashboardContent";

// Dummy clients with unique info
const initialClients = [
  {
    id: 1,
    name: "Acme Corp",
    info: "B2B SaaS for logistics. Based in NY.",
    logo: '',
    industry: "Logistics",
    links: ["https://acmecorp.com", "https://twitter.com/acmecorp"],
    niche: "Supply Chain Automation",
    businessAge: "5 years",
    description: "Acme Corp provides cloud-based logistics solutions for enterprises.",
    coreProducts: ["LogiTrack", "FleetSync"],
    idealCustomer: "Large logistics companies",
    brandEmotion: "Reliable, Innovative",
    uniqueSelling: "Real-time tracking with AI optimization",
    mainGoal: "Expand to Europe",
    competitors: ["Flexport", "Project44"],
    inspo: ["Amazon Logistics", "DHL"],
    brandColors: "#2563eb, #181A20",
    fontUsed: "Inter, Arial"
  },
  {
    id: 2,
    name: "Banana Media",
    info: "Cebu",
    logo: '',
    industry: "Marketing",
    links: ["https://bananamedia.com"],
    niche: "E-commerce Growth",
    businessAge: "3 years",
    description: "Helping online stores grow with paid ads and content.",
    coreProducts: ["AdBoost", "ContentPro"],
    idealCustomer: "Shopify store owners",
    brandEmotion: "Energetic, Creative",
    uniqueSelling: "ROI-focused ad campaigns",
    mainGoal: "Double client ROAS",
    competitors: ["Hawke Media", "Disruptive Advertising"],
    inspo: ["Gymshark", "Allbirds"],
    brandColors: "#FFD600, #23262F",
    fontUsed: "Montserrat, Helvetica"
  },
  {
    id: 3,
    name: "Zenith Health",
    info: "Private clinic network in California.",
    logo: '',
    industry: "Healthcare",
    links: ["https://zenithhealth.com"],
    niche: "Private Clinics",
    businessAge: "10 years",
    description: "Multi-location clinics offering family and urgent care.",
    coreProducts: ["Family Care", "Urgent Care"],
    idealCustomer: "Families in California",
    brandEmotion: "Caring, Trustworthy",
    uniqueSelling: "Same-day appointments",
    mainGoal: "Increase patient retention",
    competitors: ["One Medical", "Carbon Health"],
    inspo: ["Kaiser Permanente"],
    brandColors: "#00BFAE, #F1F5F9",
    fontUsed: "Roboto, Arial"
  },
  // Add more clients as needed...
];

const colors = {
  bg: "#181A20",
  side: "#23262F",
  card: "#23262F",
  accent: "#2563eb",
  text: "#F1F5F9",
  muted: "#94A3B8",
  border: "#2D3142",
  hover: "#1E40AF"
};

type SidePanelProps = {
  collapsed: boolean;
  onCollapse: () => void;
  selectedClient: any;
  setSelectedClient: (client: any) => void;
  clients?: any[];
  onAddClientClick?: () => void;
};

function SidePanel({ collapsed, onCollapse, selectedClient, setSelectedClient, clients = initialClients, onAddClientClick }: SidePanelProps) {
  return (
    <aside
      style={{
        background: colors.side,
        color: colors.text,
        width: collapsed ? 72 : 260,
        transition: "width 0.2s",
        borderRight: `1px solid ${colors.border}`,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "fixed",
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          padding: collapsed ? '24px 0 16px 0' : '16px 20px',
          gap: 12,
          position: 'relative',
        }}
      >
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: colors.accent }} />
        {!collapsed && <span style={{ fontWeight: 600 }}>Boombox Marketing</span>}
        {/* Arrow inside when open */}
        {!collapsed && (
          <button
            aria-label="Collapse"
            style={{
              marginLeft: 8,
              background: colors.side,
              color: colors.text,
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onClick={onCollapse}
          >
            <ChevronLeftIcon width={20} />
          </button>
        )}
      </div>
      {/* Dashboard button */}
      <div style={{ padding: collapsed ? "0 8px" : "0 20px", marginBottom: 8 }}>
        <button
          onClick={() => setSelectedClient(null)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: selectedClient == null ? colors.hover : colors.card,
            color: colors.text,
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            padding: collapsed ? 8 : "8px 12px",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
            justifyContent: collapsed ? "center" : "flex-start",
            marginBottom: 8,
          }}
        >
          <HomeIcon width={20} />
          {!collapsed && "Dashboard"}
        </button>
        {!collapsed && (
          <input
            type="text"
            placeholder="Search for clients"
            style={{
              width: "100%",
              padding: "6px 12px",
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
              background: colors.bg,
              color: colors.text,
              marginBottom: 12,
              fontSize: 14,
            }}
          />
        )}
      </div>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: collapsed ? '0 0' : '0 8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: collapsed ? 'center' : 'stretch',
          justifyContent: 'flex-start',
          gap: collapsed ? 8 : 0,
        }}
      >
        {clients.map((client) => (
          <div
            key={client.id}
            onClick={() => setSelectedClient(client)}
            style={{
              display: 'flex',
              flexDirection: collapsed ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: collapsed ? 0 : 12,
              padding: collapsed ? '8px 0' : '8px 12px',
              cursor: 'pointer',
              background: selectedClient?.id === client.id ? colors.hover : 'none',
              borderRadius: 8,
              margin: collapsed ? '0 0 4px 0' : '0 0 4px 0',
              color: colors.text,
              width: collapsed ? 48 : 'auto',
            }}
          >
            {client.logo && client.logo !== '' ? (
              <img src={client.logo} alt="Logo" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', background: colors.muted }} />
            ) : (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: colors.muted }} />
            )}
            {!collapsed && <span>{client.name}</span>}
          </div>
        ))}
      </div>
      <div
        style={{
          padding: collapsed ? 8 : 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <button
          style={{
            background: colors.accent,
            color: colors.text,
            border: 'none',
            borderRadius: 8,
            padding: collapsed ? 8 : '8px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            width: '100%',
            minWidth: collapsed ? 48 : undefined,
            minHeight: 40,
          }}
          onClick={onAddClientClick}
        >
          {collapsed ? <PlusIcon width={20} /> : "+ ADD CLIENT"}
        </button>
        <button
          style={{
            background: colors.card,
            color: colors.text,
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            padding: collapsed ? 8 : '8px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            width: '100%',
            minWidth: collapsed ? 48 : undefined,
            minHeight: 40,
          }}
        >
          {collapsed ? <Cog6ToothIcon width={20} /> : "SETTINGS"}
        </button>
      </div>
    </aside>
  );
}


export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [clients, setClients] = useState(initialClients);
  const [newClient, setNewClient] = useState({
    name: '',
    info: '',
    logo: null as File | null,
    logoUrl: '',
    industry: '',
    links: '',
    niche: '',
    businessAge: '',
    description: '',
    coreProducts: '',
    idealCustomer: '',
    brandEmotion: '',
    uniqueSelling: '',
    mainGoal: '',
    competitors: '',
    inspo: '',
    brandColors: '',
    brandColorsFile: null as File | null,
    brandColorsFileUrl: '',
    brandGuideFile: null as File | null,
    brandGuideFileUrl: '',
    fontUsed: ''
  });
  // Removed duplicate misplaced fields
  function handleBrandGuideChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setNewClient(prev => ({ ...prev, brandGuideFile: file, brandGuideFileUrl: URL.createObjectURL(file) }));
    }
  }

  function handleBrandColorsFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setNewClient(prev => ({ ...prev, brandColorsFile: file, brandColorsFileUrl: URL.createObjectURL(file) }));
    }
  }

  function handleAddClientSubmit(e: React.FormEvent) {
    e.preventDefault();
    setClients([
      ...clients,
      {
        ...newClient,
        id: Date.now(),
        links: newClient.links.split(',').map(s => s.trim()).filter(Boolean),
        coreProducts: newClient.coreProducts.split(',').map(s => s.trim()).filter(Boolean),
        competitors: newClient.competitors.split(',').map(s => s.trim()).filter(Boolean),
        inspo: newClient.inspo.split(',').map(s => s.trim()).filter(Boolean),
        logo: newClient.logoUrl,
      },
    ]);
    setShowAddClient(false);
    setNewClient({
      name: '',
      info: '',
      logo: null,
      logoUrl: '',
      industry: '',
      links: '',
      niche: '',
      businessAge: '',
      description: '',
      coreProducts: '',
      idealCustomer: '',
      brandEmotion: '',
      uniqueSelling: '',
      mainGoal: '',
      competitors: '',
      inspo: '',
      brandColors: '',
      brandColorsFile: null,
      brandColorsFileUrl: '',
      brandGuideFile: null,
      brandGuideFileUrl: '',
      fontUsed: ''
    });
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setNewClient(prev => ({ ...prev, logo: file, logoUrl: URL.createObjectURL(file) }));
    }
  }

  const handleEditClient = (updated: any) => {
    setClients((prev: any[]) => {
      const newClients = prev.map(c => c.id === updated.id ? { ...c, ...updated } : c);
      // Set selectedClient to the updated object from the new array
      setSelectedClient(newClients.find(c => c.id === updated.id));
      return newClients;
    });
    setShowAddClient(false);
  };

  return (
    <div style={{ display: "flex", background: colors.bg, minHeight: "100vh", position: 'relative' }}>
      <SidePanel
        collapsed={collapsed}
        onCollapse={() => setCollapsed((c) => !c)}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        clients={clients}
        onAddClientClick={() => setShowAddClient(true)}
      />
      {/* Collapse/Expand Arrow outside the sidebar, beside the logo when closed */}
      {collapsed && (
        <div
          style={{
            position: 'fixed',
            left: 72,
            top: 24,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            background: 'none',
          }}
        >
          <button
            aria-label="Expand"
            style={{
              background: 'none',
              border: 'none',
              color: colors.text,
              borderRadius: 0,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            onClick={() => setCollapsed(false)}
          >
            {/* Custom sidebar open icon SVG */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="2" height="12" rx="1" fill="#F1F5F9"/>
              <rect x="7" y="4" width="10" height="12" rx="2" stroke="#F1F5F9" strokeWidth="2" fill="none"/>
            </svg>
          </button>
        </div>
      )}
      <main style={{ flex: 1, background: colors.bg, color: colors.text, padding: "min(5vw, 32px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {!selectedClient ? <DashboardContent /> : <ClientDetails client={selectedClient} />}
        </div>
        {/* Add Client Modal */}
        {showAddClient && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(24,26,32,0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflowY: 'auto',
            padding: '4vw 2vw',
          }}>
            <form onSubmit={handleAddClientSubmit} style={{
              background: colors.card,
              color: colors.text,
              borderRadius: 18,
              border: `1.5px solid ${colors.border}`,
              padding: 'clamp(18px, 4vw, 36px)',
              minWidth: 0,
              width: '100%',
              maxWidth: '85em',
              boxSizing: 'border-box',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 8px 40px 0 rgba(0,0,0,0.30)',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              transition: 'box-shadow 0.2s',
            }}>
              <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 10, letterSpacing: '-0.5px' }}>Add New Client</div>
              {/* Logo, Business Name, Address (info) */}
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: colors.muted, overflow: 'hidden', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {newClient.logoUrl ? (
                      <img src={newClient.logoUrl} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <UserIcon width={36} height={36} color={colors.bg} />
                    )}
                  </div>
                  <input type="file" accept="image/*" style={{ display: 'none' }} id="client-logo-upload" onChange={handleLogoChange} />
                  <label htmlFor="client-logo-upload" style={{ fontSize: 13, color: colors.text, background: colors.accent, border: `1px solid ${colors.accent}`, borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontWeight: 600, marginTop: 2 }}>Upload Logo</label>
                </div>
                <input required placeholder="Business Name" value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })} style={{ flex: 2, minWidth: 220, padding: 10, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 15 }} />
                <input required placeholder="Business Address" value={newClient.info} onChange={e => setNewClient({ ...newClient, info: e.target.value })} style={{ flex: 3, minWidth: 220, padding: 10, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 15 }} />
              </div>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 8 }}>
                <input required placeholder="Industry" value={newClient.industry} onChange={e => setNewClient({ ...newClient, industry: e.target.value })} style={{ flex: 1, minWidth: 220, padding: 10, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 15 }} />
                <input placeholder="Links (comma separated)" value={newClient.links || ''} onChange={e => setNewClient({ ...newClient, links: e.target.value })} style={{ flex: 1, minWidth: 220, padding: 10, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 15 }} />
                <input placeholder="Niche" value={newClient.niche} onChange={e => setNewClient({ ...newClient, niche: e.target.value })} style={{ flex: 1, minWidth: 220, padding: 10, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 15 }} />
                <input placeholder="Business Age" value={newClient.businessAge} onChange={e => setNewClient({ ...newClient, businessAge: e.target.value })} style={{ flex: 1, minWidth: 220, padding: 10, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 15 }} />
              </div>
              <textarea placeholder="Short Description" value={newClient.description} onChange={e => setNewClient({ ...newClient, description: e.target.value })} style={{ padding: 10, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 15, resize: 'vertical', minHeight: 48, marginBottom: 8 }} />
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 8 }}>
                <input placeholder="Core Products/Services (comma separated)" value={newClient.coreProducts} onChange={e => setNewClient({ ...newClient, coreProducts: e.target.value })} style={{ flex: 1, minWidth: 220, padding: 10, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 15 }} />
                <input placeholder="Ideal Customer" value={newClient.idealCustomer} onChange={e => setNewClient({ ...newClient, idealCustomer: e.target.value })} style={{ flex: 1, minWidth: 220, padding: 10, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 15 }} />
                <input placeholder="Desired Brand Emotion" value={newClient.brandEmotion} onChange={e => setNewClient({ ...newClient, brandEmotion: e.target.value })} style={{ flex: 1, minWidth: 220, padding: 10, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 15 }} />
                <input placeholder="Unique Selling Proposition" value={newClient.uniqueSelling} onChange={e => setNewClient({ ...newClient, uniqueSelling: e.target.value })} style={{ flex: 1, minWidth: 220, padding: 10, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 15 }} />
                <input placeholder="Main Social Media Goal" value={newClient.mainGoal} onChange={e => setNewClient({ ...newClient, mainGoal: e.target.value })} style={{ flex: 1, minWidth: 220, padding: 10, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 15 }} />
              </div>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 8 }}>
                <input placeholder="Competitors (comma separated)" value={newClient.competitors} onChange={e => setNewClient({ ...newClient, competitors: e.target.value })} style={{ flex: 1, minWidth: 220, padding: 10, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 15 }} />
                <input placeholder="Inspiration Businesses (comma separated)" value={newClient.inspo} onChange={e => setNewClient({ ...newClient, inspo: e.target.value })} style={{ flex: 1, minWidth: 220, padding: 10, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 15 }} />
                {/* Brand Guide/Brand Image upload */}
                <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="file" accept="image/*,application/pdf" id="brand-guide-upload" style={{ display: 'none' }} onChange={handleBrandGuideChange} />
                    <label htmlFor="brand-guide-upload" style={{ fontSize: 13, color: colors.text, background: colors.accent, border: `1px solid ${colors.accent}`, borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontWeight: 600 }}>Upload Brand Guide/Image</label>
                    {newClient.brandGuideFileUrl && (
                      <a href={newClient.brandGuideFileUrl} target="_blank" rel="noopener noreferrer" style={{ color: colors.accent, fontSize: 13 }}>Preview</a>
                    )}
                  </div>
                </div>
                {/* Brand Colors input and upload */}
                <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input placeholder="Brand Colors (e.g. #2563eb, #181A20)" value={newClient.brandColors} onChange={e => setNewClient({ ...newClient, brandColors: e.target.value })} style={{ padding: 10, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 15, marginBottom: 4 }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="file" accept="image/*,application/pdf" id="brand-colors-upload" style={{ display: 'none' }} onChange={handleBrandColorsFileChange} />
                    <label htmlFor="brand-colors-upload" style={{ fontSize: 13, color: colors.text, background: colors.accent, border: `1px solid ${colors.accent}`, borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontWeight: 600 }}>Upload Brand Colors</label>
                    {newClient.brandColorsFileUrl && (
                      <a href={newClient.brandColorsFileUrl} target="_blank" rel="noopener noreferrer" style={{ color: colors.accent, fontSize: 13 }}>Preview</a>
                    )}
                  </div>
                </div>
                <input placeholder="Font Used" value={newClient.fontUsed} onChange={e => setNewClient({ ...newClient, fontUsed: e.target.value })} style={{ flex: 1, minWidth: 220, padding: 10, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 15 }} />
              </div>
              <div style={{ display: 'flex', gap: 14, marginTop: 10, justifyContent: 'flex-end' }}>
                <button type="submit" style={{ background: colors.accent, color: colors.text, border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: 15, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}>Add</button>
                <button type="button" onClick={() => setShowAddClient(false)} style={{ background: colors.card, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: 8, padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
