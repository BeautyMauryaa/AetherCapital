const StepHeader = ({ step, total = 6, title, highlight, subtitle }) => {
  return (
    <div className="mb-10">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[1.5px] bg-purple-500 rounded-full" />
        <span className="font-mono text-[11px] tracking-[0.2em] text-purple-500 uppercase font-bold">
          Step {String(step).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* Heading */}
      <h1 className="text-[42px] font-bold leading-tight tracking-tight mb-3 text-foreground">
        {title}{" "}
        {highlight && (
          <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
            {highlight}
          </span>
        )}
      </h1>

      {/* Subtitle - Replaced text-muted with text-foreground/60 for better contrast control */}
      {subtitle && (
        <p className="text-[15px] text-foreground/60 leading-relaxed max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
};

export default StepHeader;