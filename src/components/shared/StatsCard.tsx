"use client"

import { GlassCard } from "./GlassCard"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { StatsCardProps } from "@/lib/types"

/**
 * Reusable stats card component for dashboards
 */
export function StatsCard({
    icon: Icon,
    label,
    value,
    trend,
    variant = "default"
}: StatsCardProps) {
    // Variant-based styling
    const variantStyles = {
        default: "bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50",
        "gradient-red": "bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white border-none shadow-xl shadow-red-500/20",
        "gradient-green": "bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-xl",
        "gradient-dark": "bg-gradient-to-br from-slate-700 to-slate-800 text-white border-none shadow-xl",
    }

    const iconBgStyles = {
        default: "bg-slate-500/10",
        "gradient-red": "bg-white/20",
        "gradient-green": "bg-white/20",
        "gradient-dark": "bg-white/20",
    }

    const labelStyles = {
        default: "text-slate-500 dark:text-slate-400",
        "gradient-red": "opacity-90",
        "gradient-green": "opacity-80",
        "gradient-dark": "opacity-80",
    }

    const valueStyles = {
        default: "text-slate-900 dark:text-white",
        "gradient-red": "text-white",
        "gradient-green": "text-white",
        "gradient-dark": "text-white",
    }

    const isGradient = variant !== "default"
    const TrendIcon = trend?.direction === "up" ? ArrowUpRight : ArrowDownRight
    const trendColor = trend?.direction === "up" ? "text-green-500" : "text-red-500"

    return (
        <GlassCard
            className={`p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden ${variantStyles[variant]}`}
        >
            {/* Decorative blur for gradient variants */}
            {isGradient && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            )}

            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <h3 className={`text-sm font-medium ${labelStyles[variant]}`}>
                        {label}
                    </h3>
                    <p className={`text-3xl font-bold mt-2 ${valueStyles[variant]}`}>
                        {value}
                    </p>
                    {trend && (
                        <div className={`flex items-center gap-1 mt-2 ${isGradient
                                ? "bg-white/20 w-fit px-2 py-1 rounded-lg backdrop-blur-sm"
                                : ""
                            }`}>
                            <TrendIcon className={`w-3 h-3 ${isGradient ? "text-white" : trendColor}`} />
                            <span className={`text-xs font-medium ${isGradient ? "text-white" : trendColor
                                }`}>
                                {trend.text}
                            </span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-xl ${iconBgStyles[variant]} flex items-center justify-center group-hover:scale-110 transition-transform ${isGradient ? "shadow-inner" : ""}`}>
                    <Icon className={`w-6 h-6 ${isGradient ? "text-white" : "text-slate-600"}`} />
                </div>
            </div>
        </GlassCard>
    )
}
