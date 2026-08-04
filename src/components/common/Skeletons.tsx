"use client";

import React from "react";

export function EventCardSkeleton() {
  return (
    <div className="w-full bg-secondary/5 border border-secondary/15 rounded-3xl overflow-hidden animate-pulse">
      <div className="h-60 w-full bg-secondary/10" />
      <div className="p-6 space-y-4">
        <div className="h-6 w-3/4 bg-secondary/10 rounded-md" />
        <div className="space-y-2">
          <div className="h-4 w-1/2 bg-secondary/10 rounded-md" />
          <div className="h-4 w-2/3 bg-secondary/10 rounded-md" />
          <div className="h-4 w-1/3 bg-secondary/10 rounded-md" />
        </div>
        <div className="h-10 w-full bg-secondary/10 rounded-xl" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-pulse pt-12">
      <div className="h-32 w-full bg-secondary/5 rounded-3xl border border-secondary/10" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="h-24 bg-secondary/5 rounded-2xl border border-secondary/10" />
        <div className="h-24 bg-secondary/5 rounded-2xl border border-secondary/10" />
        <div className="h-24 bg-secondary/5 rounded-2xl border border-secondary/10" />
      </div>
      <div className="h-64 w-full bg-secondary/5 rounded-3xl border border-secondary/10" />
    </div>
  );
}
