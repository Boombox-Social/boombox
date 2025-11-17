"use client";
import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useClientManagement } from "../hooks/useClientManagement";
import { UserIcon, UserGroupIcon } from "@heroicons/react/24/solid";

export default function DashboardContent() {
  const { authState } = useAuth();
  const { clients } = useClientManagement();

  const firstName = authState.user?.name?.split(' ')[0] || 'User';

  const templates = [
    { name: "Marketing Plan Template", emoji: "📅", link: "https://www.canva.com/design/DAGUWpAtTeE/fizA8Exsk3Hsu7F20Y52ng/edit?utm_content=DAGUWpAtTeE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton" },
    { name: "Client Content Calendar Template", emoji: "📝", link: "https://docs.google.com/presentation/d/1WX0pkyKVOKIvXtSSKjs2Wi_1vTGmBrtvpDLguvfHL2k/edit?usp=sharing" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h2 
          className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight"
          style={{ color: "var(--card-foreground)" }}
        >
          Dashboard
        </h2>
        <p 
          className="text-sm sm:text-base"
          style={{ color: "var(--muted)" }}
        >
          Hi {firstName}, Welcome to your dashboard
        </p>
      </div>

      {/* Stats Grid - Responsive columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {/* Total Clients Card */}
        <div 
          className="rounded-xl p-4 sm:p-6 transition-all duration-200 cursor-pointer"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--primary)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p 
                className="text-sm font-medium mb-2 uppercase tracking-wide"
                style={{ color: "var(--muted)" }}
              >
                Total Clients
              </p>
              <h3 
                className="text-xl sm:text-2xl font-bold"
                style={{ color: "var(--card-foreground)" }}
              >
                {clients.length}
              </h3>
            </div>
            <div 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center"
              style={{ 
                background: "rgba(37, 99, 235, 0.1)",
              }}
            >
              <UserGroupIcon 
                className="w-4 h-4 sm:w-5 sm:h-5" 
                style={{ color: "var(--primary)" }}
              />
            </div>
          </div>
        </div>

        {/* Active Projects Card */}
        <div 
          className="rounded-xl p-4 sm:p-6 transition-all duration-200 cursor-pointer"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--success)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p 
                className="text-sm font-medium mb-2 uppercase tracking-wide"
                style={{ color: "var(--muted)" }}
              >
                Active Projects
              </p>
              <h3 
                className="text-xl sm:text-2xl font-bold"
                style={{ color: "var(--card-foreground)" }}
              >
                {clients.filter(c => !c.archived).length}
              </h3>
            </div>
            <div 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center"
              style={{ 
                background: "rgba(16, 185, 129, 0.1)",
              }}
            >
              <UserIcon 
                className="w-4 h-4 sm:w-5 sm:h-5" 
                style={{ color: "var(--success)" }}
              />
            </div>
          </div>
        </div>

        {/* Templates Card - Spans full width on mobile */}
        <div 
          className="rounded-xl p-4 sm:p-6 sm:col-span-2 lg:col-span-1"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <h3 
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--card-foreground)" }}
          >
            Quick Templates
          </h3>
          <div className="flex flex-col gap-3">
            {templates.map((template, index) => (
              <a
                key={index}
                href={template.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group no-underline"
                style={{
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--secondary)";
                  e.currentTarget.style.borderColor = "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--background)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                <span className="text-2xl flex-shrink-0">{template.emoji}</span>
                <span 
                  className="text-sm font-medium transition-colors"
                  style={{ color: "var(--card-foreground)" }}
                >
                  {template.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Clients Section */}
      <div>
        <h3 
          className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6"
          style={{ color: "var(--card-foreground)" }}
        >
          Recent Clients
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {clients.slice(0, 6).map((client) => (
            <div
              key={client.id}
              className="flex items-center gap-3 p-3 sm:p-4 rounded-lg transition-all duration-200 cursor-pointer"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--secondary)";
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--card)";
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              onClick={() => window.location.href = `/dashboard/client/${client.id}`}
            >
              <div 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base"
                style={{
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                {client.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h4 
                  className="font-medium text-sm sm:text-base truncate"
                  style={{ color: "var(--card-foreground)" }}
                >
                  {client.name}
                </h4>
                <p 
                  className="text-xs sm:text-sm truncate"
                  style={{ color: "var(--muted)" }}
                >
                  {client.industry}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}