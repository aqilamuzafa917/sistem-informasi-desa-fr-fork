import * as React from "react";
import { TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  unit: string;
  icon?: React.ElementType;
  trend?: string;
  gradient?: boolean;
}

export const StatCard = ({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  gradient = false,
}: StatCardProps) => (
  <div
    className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${gradient ? "bg-gradient-to-br from-white to-gray-50/50" : "bg-white"} `}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-green-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
    <div className="relative p-6">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-700">{title}</h4>
        {Icon && (
          <div className="rounded-xl bg-gradient-to-br from-cyan-100 to-green-100 p-2 transition-transform duration-200 group-hover:scale-110">
            <Icon className="h-5 w-5 text-cyan-600" />
          </div>
        )}
      </div>
      <div className="text-right">
        <div className="flex items-baseline justify-end gap-2">
          <span className="bg-gradient-to-r from-cyan-600 to-green-600 bg-clip-text text-3xl font-bold text-transparent">
            {typeof value === "number" ? value.toLocaleString() : value}
          </span>
          <span className="text-base font-medium text-gray-500">{unit}</span>
        </div>
        {trend && (
          <div className="mt-2 flex items-center justify-end gap-1">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-600">{trend}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);
