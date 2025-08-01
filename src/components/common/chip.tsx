// src/components/common/Chip.tsx
export default function Chip({
  icon,
  children,
  color = "oklch(21.8% 69.4% 176.1)",
  textColor = "white",
  className = "",
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  color?: string;
  textColor?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full font-medium shadow-sm ${className}`}
      style={{
        background: color,
        color: textColor,
        minHeight: 24,
      }}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
}
