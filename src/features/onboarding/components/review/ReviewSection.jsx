import { Edit3 } from "lucide-react";

const ReviewSection = ({ step, title, fields, isAddressBlock }) => {
  return (
    <div className="bg-[#13131A] p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-[#a855f7] font-bold tracking-tighter">{step}</span>
          <h3 className="text-[11px] font-bold tracking-[0.2em] text-white uppercase">{title}</h3>
        </div>
        <button className="flex items-center gap-2 text-[10px] font-bold text-white/30 hover:text-[#a855f7] uppercase transition-colors">
          <Edit3 size={12} />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-2 gap-y-6">
        {fields.map((field, idx) => (
          <div key={idx}>
            <p className="text-[9px] font-mono tracking-[0.15em] text-white/20 uppercase mb-1.5">
              {field.label}
            </p>
            {field.isBadge ? (
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded border border-[#f59e0b] text-[#f59e0b] text-[9px] font-bold">MEDIUM</span>
                <span className="text-[13px] font-medium text-white/80">{field.value.split(' ')[1]}</span>
              </div>
            ) : (
              <p className="text-[13px] font-medium text-white/80">{field.value || "—"}</p>
            )}
          </div>
        ))}
      </div>

      {isAddressBlock && (
        <div className="mt-6 p-5 bg-[#0B0B0F] border border-white/[0.03] rounded-xl flex items-start gap-4">
          <div className="mt-1 w-2 h-2 rounded-full bg-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
          <div className="text-[12px] text-white/60 leading-relaxed">
            <p>123 Example Street</p>
            <p>Apt 4B</p>
            <p>New York, NY 10001</p>
            <p>United States</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;