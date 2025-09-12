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
    <div className="p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#F1F5F9] mb-2">Dashboard</h2>
        <p className="text-[#94A3B8]">
          Hi {firstName}, Welcome to your dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Clients Card */}
        <div className="bg-[#23262F] rounded-xl border border-[#2D3142] p-6 hover:border-[#2563eb] transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm font-medium mb-2">
                Total Clients
              </p>
              <h3 className="text-2xl font-bold text-[#F1F5F9]">
                {clients.length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#2563eb]/10 flex items-center justify-center">
              <UserGroupIcon className="w-5 h-5 text-[#2563eb]" />
            </div>
          </div>
        </div>

        {/* Account Type Card */}
        <div className="bg-[#23262F] rounded-xl border border-[#2D3142] p-6 hover:border-[#2563eb] transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm font-medium mb-2">
                Account Type
              </p>
              <h3 className="text-2xl font-bold text-[#F1F5F9]">
                {authState.user?.role}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#2563eb]/10 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-[#2563eb]" />
            </div>
          </div>
        </div>

        {/* Templates Card */}
        <div className="bg-[#23262F] rounded-xl border border-[#2D3142] p-6 hover:border-[#2563eb] transition-colors">
          <div className="flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <p className="text-[#94A3B8] text-sm font-medium">
                Quick Templates
              </p>
              <button 
                className="text-[#2563eb] text-sm hover:text-[#1E40AF] transition-colors"
                onClick={() => window.open("https://drive.google.com", "_blank")}
              >
                
              </button>
            </div>
            <div className="space-y-3">
              {templates.map((template) => (
                <a
                  key={template.name}
                  href={template.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
                >
                  <span>{template.emoji}</span>
                  <span className="text-sm">{template.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section - Rest of the code remains the same */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-[#F1F5F9] mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.slice(0, 3).map((client) => (
            <div 
              key={client.id}
              className="bg-[#23262F] rounded-lg border border-[#2D3142] p-4 flex items-center gap-4 hover:border-[#2563eb] transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#2563eb] flex items-center justify-center text-[#F1F5F9] font-bold">
                {client.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-[#F1F5F9] font-medium">{client.name}</h4>
                <p className="text-sm text-[#94A3B8]">{client.industry}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}