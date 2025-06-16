import * as React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "./Card";
import { StatCard } from "./StatCard";

interface GridCardProps {
  title: string;
  data: Array<{ name: string; jumlah: number }>;
  columns?: 2 | 3 | 4;
  icon: React.ElementType;
  customItemIcon?: (name: string) => React.ElementType;
  footer?: React.ReactNode;
}

export const GridCard = ({
  title,
  data,
  columns = 3,
  icon: Icon,
  customItemIcon,
  footer,
}: GridCardProps) => (
  <Card className="transition-all duration-500 hover:shadow-2xl">
    <CardHeader>
      <CardTitle icon={Icon}>{title}</CardTitle>
      <CardDescription>
        Data statistik terkini dengan visualisasi interaktif untuk analisis
        mendalam
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div
        className={`grid gap-6 ${columns === 2 ? "md:grid-cols-2" : columns === 3 ? "md:grid-cols-3" : "md:grid-cols-4"}`}
      >
        {data.map((item, index) => (
          <StatCard
            key={index}
            title={item.name}
            value={item.jumlah}
            unit="jiwa"
            icon={customItemIcon ? customItemIcon(item.name) : Icon}
            gradient={true}
          />
        ))}
      </div>
      {footer}
    </CardContent>
  </Card>
);
