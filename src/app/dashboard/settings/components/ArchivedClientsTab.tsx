"use client";
import React from "react";
import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/solid";

interface ArchivedClient {
  id: number;
  name: string;
  industry: string;
  status: string;
}

interface ArchivedClientsTabProps {
  clients: ArchivedClient[];
  onRestore: (clientId: number) => void;
  onPermanentDelete: (clientId: number) => void;
}

export function ArchivedClientsTab({
  clients,
  onRestore,
  onPermanentDelete,
}: ArchivedClientsTabProps) {
  return (
    <div className="p-4 sm:p-6">
      <h2 
        className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6"
        style={{ color: "var(--card-foreground)" }}
      >
        Archived Clients
      </h2>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle px-4 sm:px-0">
          <table className="min-w-full">
            <thead>
              <tr 
                className="border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <th 
                  className="text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm"
                  style={{ color: "var(--card-foreground)" }}
                >
                  Name
                </th>
                <th 
                  className="text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm hidden sm:table-cell"
                  style={{ color: "var(--card-foreground)" }}
                >
                  Industry
                </th>
                <th 
                  className="text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm hidden md:table-cell"
                  style={{ color: "var(--card-foreground)" }}
                >
                  Status
                </th>
                <th 
                  className="text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm"
                  style={{ color: "var(--card-foreground)" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b transition-colors"
                  style={{ borderColor: "var(--border)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--secondary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <td 
                    className="py-3 sm:py-4 px-2 sm:px-4 font-medium text-xs sm:text-sm"
                    style={{ color: "var(--card-foreground)" }}
                  >
                    {client.name}
                  </td>
                  <td 
                    className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm hidden sm:table-cell"
                    style={{ color: "var(--muted)" }}
                  >
                    {client.industry}
                  </td>
                  <td className="py-3 sm:py-4 px-2 sm:px-4 hidden md:table-cell">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: "rgba(245, 158, 11, 0.2)",
                        color: "var(--warning)",
                      }}
                    >
                      Archived
                    </span>
                  </td>
                  <td className="py-3 sm:py-4 px-2 sm:px-4">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <button
                        onClick={() => onRestore(client.id)}
                        className="p-1.5 sm:p-2 rounded transition-all duration-200 flex items-center justify-center gap-1 text-xs font-medium"
                        style={{
                          background: "rgba(16, 185, 129, 0.2)",
                          color: "var(--success)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(16, 185, 129, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(16, 185, 129, 0.2)";
                        }}
                        title="Restore Client"
                      >
                        <ArrowPathIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="sm:inline">Restore</span>
                      </button>
                      <button
                        onClick={() => onPermanentDelete(client.id)}
                        className="p-1.5 sm:p-2 rounded transition-all duration-200 flex items-center justify-center gap-1 text-xs font-medium"
                        style={{
                          background: "rgba(239, 68, 68, 0.2)",
                          color: "var(--danger)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(239, 68, 68, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                        }}
                        title="Permanently Delete"
                      >
                        <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {clients.length === 0 && (
          <div 
            className="text-center py-8 text-sm sm:text-base"
            style={{ color: "var(--muted)" }}
          >
            No archived clients found
          </div>
        )}
      </div>
    </div>
  );
}