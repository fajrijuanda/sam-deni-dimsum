import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                "rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl",
                "dark:bg-slate-950/30 dark:border-slate-800/50",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
