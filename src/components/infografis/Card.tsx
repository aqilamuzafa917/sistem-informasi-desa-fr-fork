import * as React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  icon?: React.ElementType;
  className?: string;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({
  children,
  className = "",
  gradient = false,
}: CardProps) => (
  <div
    className={`rounded-3xl border border-gray-100/50 bg-white shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${gradient ? "bg-gradient-to-br from-cyan-50/50 to-green-50/50" : ""} ${className} `}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className = "" }: CardHeaderProps) => (
  <div className={`p-8 pb-4 ${className}`}>{children}</div>
);

export const CardContent = ({ children, className = "" }: CardContentProps) => (
  <div className={`px-8 pb-8 ${className}`}>{children}</div>
);

export const CardTitle = ({
  children,
  icon: Icon,
  className = "",
}: CardTitleProps) => (
  <div
    className={`mb-3 flex items-center gap-4 text-2xl font-bold text-gray-800 ${className}`}
  >
    {Icon && (
      <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-green-500 p-2 shadow-lg">
        <Icon className="h-6 w-6 text-white" />
      </div>
    )}
    <span className="bg-gradient-to-r from-cyan-600 to-green-600 bg-clip-text text-transparent">
      {children}
    </span>
  </div>
);

export const CardDescription = ({
  children,
  className = "",
}: CardDescriptionProps) => (
  <p className={`ml-14 text-base leading-relaxed text-gray-600 ${className}`}>
    {children}
  </p>
);
