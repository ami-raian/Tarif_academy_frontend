// app/components/common/common-badge.tsx
enum StatusType {
  Default = "Default",
  Success = "Success",
  Failure = "Failure",
  Warning = "Warning",
}

const statusStyles: Record<StatusType, { bg: string; text: string }> = {
  [StatusType.Default]: { bg: "bg-[#f3f4f6]", text: "text-[#4b5563]" },
  [StatusType.Success]: { bg: "bg-[#DEF7EC]", text: "text-[#03543F]" },
  [StatusType.Failure]: { bg: "bg-[#FDE8E8]", text: "text-[#9B1C1C]" },
  [StatusType.Warning]: { bg: "bg-[#FEF3C7]", text: "text-[#92400E]" },
};

const statusTypeMap: Record<string, StatusType> = {
  // Common English mappings
  ACTIVE: StatusType.Success,
  INACTIVE: StatusType.Failure,
  SUCCESS: StatusType.Success,
  FAILED: StatusType.Failure,
  FAILURE: StatusType.Failure,
  PENDING: StatusType.Warning,
  APPROVED: StatusType.Success,
  REJECTED: StatusType.Failure,
  COMPLETED: StatusType.Success,
  INCOMPLETE: StatusType.Failure,

  // Bangla status mappings (used in this app)
  পাস: StatusType.Success,
  ফেল: StatusType.Failure,
  চলমান: StatusType.Warning,
  "প্রকাশিত ✓": StatusType.Success,
  ড্রাফট: StatusType.Default,
  অপেক্ষমাণ: StatusType.Warning,
  অনুমোদিত: StatusType.Success,
  প্রত্যাখ্যাত: StatusType.Failure,
};

type CommonBadgeProps = {
  status: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "text-[10px] px-2 py-0.5",
  md: "text-xs px-2 py-1",
  lg: "text-base px-6 py-2",
};

export const CommonBadge = ({ status, size = "md" }: CommonBadgeProps) => {
  const statusType = statusTypeMap[status] || StatusType.Default;

  const { bg, text } = statusStyles[statusType];

  return (
    <div
      className={`inline-flex items-center justify-center rounded-md ${bg} ${sizeClasses[size]}`}
    >
      <span className={`font-medium ${text}`}>
        {status?.replace(/_/g, " ")}
      </span>
    </div>
  );
};
