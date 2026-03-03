import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  trend?: string;
  trendColor?: "success" | "destructive" | "primary";
}

const StatCard = ({ label, value, icon, trend, trendColor = "success" }: StatCardProps) => {
  const trendColorClass = {
    success: "text-success",
    destructive: "text-destructive",
    primary: "text-primary",
  }[trendColor];

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        {icon && <span className="text-primary">{icon}</span>}
      </div>
      <p className="text-2xl md:text-3xl font-bold font-heading">{value}</p>
      {trend && <p className={`text-sm mt-1 ${trendColorClass}`}>↗ {trend}</p>}
    </div>
  );
};

export default StatCard;
