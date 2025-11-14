"use client";

import { cn } from "@/lib/utils/cn";

export type GalleryMode = "Carousel" | "Grid";

export function ModeToggle({ mode, onMode, className }: { mode: GalleryMode; onMode: (m: GalleryMode) => void; className?: string }) {
  return (
    <div className={cn("inline-flex rounded-md border border-gunmetal/20 bg-white p-1 shadow-sm", className)}>
      {(["Carousel", "Grid"] as const).map((m) => (
        <button
          key={m}
          className={cn(
            "px-3 py-1.5 text-sm rounded-md transition-colors",
            m === mode ? "bg-blue-green text-white" : "text-gunmetal hover:bg-gunmetal/5"
          )}
          onClick={() => onMode(m)}
          aria-pressed={m === mode}
        >
          {m}
        </button>
      ))}
    </div>
  );
}

export default function GalleryToolbar({
  tabs,
  tab,
  onTab,
  mode,
  onMode,
  className,
}: {
  tabs: readonly string[];
  tab: string;
  onTab: (t: string) => void;
  mode: GalleryMode;
  onMode: (m: GalleryMode) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 mb-4 mt-4 sm:mt-0", className)}>
      <div className="w-full overflow-x-auto sm:overflow-visible">
        <div className="inline-flex whitespace-nowrap rounded-md border border-gunmetal/20 bg-white p-1 shadow-sm">
          {tabs.map((t) => (
            <button
              key={t}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                t === tab ? "bg-blue-green text-white" : "text-gunmetal hover:bg-gunmetal/5"
              )}
              onClick={() => onTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <ModeToggle mode={mode} onMode={onMode} className="ml-auto hidden md:inline-flex" />
    </div>
  );
}
