import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  href,
  cta,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  cta?: string;
}) => {
  const content = (
    <div
      className={cn(
        "row-span-1 rounded-2xl group/bento hover:shadow-2xl hover:shadow-gold-500/8 transition duration-300 p-5 bg-gradient-to-b from-obsidian-800/90 to-obsidian-850 border border-gold-500/12 justify-between flex flex-col space-y-4 hover:border-gold-500/35 relative overflow-hidden h-full",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-1 transition duration-200">
        <div className="text-gold-400 mb-2">{icon}</div>
        <div className="font-serif font-bold text-white text-lg mb-1 tracking-wide">
          {title}
        </div>
        <div className="font-sans font-light text-zinc-300 text-xs leading-relaxed mb-3">
          {description}
        </div>
        {cta && (
          <div className="text-[11px] font-semibold text-gold-400 flex items-center gap-1 group-hover/bento:text-gold-300 transition-colors">
            <span>{cta}</span>
            <ArrowRight className="w-3 h-3 group-hover/bento:translate-x-1 transition-transform" />
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
};
