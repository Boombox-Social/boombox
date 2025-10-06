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
    { name: "Social Media Calendar", emoji: "📅", link: "https://docs.google.com/spreadsheets/create" },
    { name: "Monthly Report", emoji: "📊", link: "https://docs.google.com/document/create" },
    { name: "Marketing Proposal", emoji: "📝", link: "https://docs.google.com/document/create" },
    { name: "Company Deck", emoji: "🎯", link: "https://docs.google.com/presentation/create" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F1F5F9] mb-2">Dashboard</h2>
        <p className="text-[#94A3B8] text-sm sm:text-base">
          Hi {firstName}, Welcome to your dashboard
        </p>
      </div>

      {/* Stats Grid - Responsive columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {/* Total Clients Card */}
        <div className="bg-[#23262F] rounded-xl border border-[#2D3142] p-4 sm:p-6 hover:border-[#2563eb] transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm font-medium mb-2">
                Total Clients
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-[#F1F5F9]">
                {clients.length}
              </h3>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#2563eb]/10 flex items-center justify-center">
              <UserGroupIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#2563eb]" />
            </div>
          </div>
        </div>

        {/* Active Projects Card */}
        <div className="bg-[#23262F] rounded-xl border border-[#2D3142] p-4 sm:p-6 hover:border-[#10B981] transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm font-medium mb-2">
                Active Projects
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-[#F1F5F9]">
                {clients.filter(c => !c.archived).length}
              </h3>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
              <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#10B981]" />
            </div>
          </div>
        </div>

        {/* Templates Card - Spans full width on mobile */}
        <div className="bg-[#23262F] rounded-xl border border-[#2D3142] p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
          <h3 className="text-lg font-semibold text-[#F1F5F9] mb-4">Quick Templates</h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {templates.map((template, index) => (
              <a
                key={index}
                href={template.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-[#181A20] rounded-lg hover:bg-[#2D3142] transition-colors"
              >
                <span className="text-lg sm:text-xl">{template.emoji}</span>
                <span className="text-xs sm:text-sm text-[#F1F5F9] font-medium truncate">{template.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Clients Section */}
      <div className="bg-[#23262F] rounded-xl border border-[#2D3142] p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-[#F1F5F9] mb-4 sm:mb-6">Recent Clients</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {clients.slice(0, 6).map((client) => (
            <div
              key={client.id}
              className="flex items-center gap-3 p-3 sm:p-4 bg-[#181A20] rounded-lg hover:bg-[#2D3142] transition-colors cursor-pointer"
              onClick={() => window.location.href = `/dashboard/client/${client.id}`}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#2563eb] flex items-center justify-center text-[#F1F5F9] font-bold text-sm sm:text-base">
                {client.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[#F1F5F9] font-medium text-sm sm:text-base truncate">{client.name}</h4>
                <p className="text-xs sm:text-sm text-[#94A3B8] truncate">{client.industry}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}