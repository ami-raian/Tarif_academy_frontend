// app/components/common/common-badge.tsx
enum StatusType {
  Default = "Default",
  Success = "Success",
  Failure = "Failure",
  Warning = "Warning",
  hold = "hold",
  equal = "equal",
  Manual = "Manual",
  Auto = "Auto",
  Buy = "Buy",
  Sell = "Sell",
  Cash = "Cash",
  Gold = "Gold",
  Silver = "Silver",
  Blue = "Blue",
  Cyan = "Cyan",
  NeutralBlue = "NeutralBlue",
}

const statusStyles: Record<StatusType, { bg: string; text: string }> = {
  [StatusType.Default]: { bg: "bg-[#f3f4f6]", text: "text-[#4b5563]" },
  [StatusType.Success]: { bg: "bg-[#DEF7EC]", text: "text-[#03543F]" },
  [StatusType.Failure]: { bg: "bg-[#FDE8E8]", text: "text-[#9B1C1C]" },
  [StatusType.Warning]: { bg: "bg-[#FEF3C7]", text: "text-[#92400E]" },
  [StatusType.hold]: { bg: "bg-status-hold", text: "text-white" },
  [StatusType.equal]: { bg: "bg-status-equal", text: "text-white" },
  [StatusType.Manual]: { bg: "bg-[#f50]", text: "text-white" },
  [StatusType.Auto]: { bg: "bg-[#D9F7BE]", text: "text-[#389E0D]" },
  [StatusType.Buy]: { bg: "bg-buy", text: "text-white" },
  [StatusType.Sell]: { bg: "bg-sell", text: "text-white" },
  [StatusType.Cash]: { bg: "bg-[#E0F7EF]", text: "text-[#0B7A53]" },
  [StatusType.Gold]: { bg: "bg-[#FFF7E0]", text: "text-[#8B5E00]" },
  [StatusType.Silver]: { bg: "bg-[#E5E7EB]", text: "text-[#374151]" },
  [StatusType.Blue]: { bg: "bg-[#0056b3]/10", text: "text-[#0056b3]" },
  [StatusType.Cyan]: { bg: "bg-[#00a3e0]/10", text: "text-[#00a3e0]" },
  [StatusType.NeutralBlue]: { bg: "bg-[#dbeafe]", text: "text-[#1e40af]" },
};

const statusTypeMap: Record<string, StatusType> = {
  ACTIVE: StatusType.Success,
  VERIFIED: StatusType.Success,
  SUBMITTED: StatusType.Warning,
  REJECTED: StatusType.Failure,
  INACTIVE: StatusType.Failure,
  FAILED: StatusType.Failure,
  NOT_SUBMITTED: StatusType.Failure,
  PENDING: StatusType.Warning,
  SUCCESS: StatusType.Success,
  PAID: StatusType.Success,
  APPROVAL: StatusType.Warning,
  APPROVED: StatusType.Success,
  UNPAID: StatusType.Failure,
  INCOMPLETE: StatusType.Failure,
  COMPLETE: StatusType.Success,
  COMPLETED: StatusType.Success,
  REQUESTED: StatusType.Warning,
  DEPOSIT: StatusType.Success,
  WITHDRAW: StatusType.Warning,
  TRANSFER_OUT: StatusType.Warning,
  TRANSFER_IN: StatusType.Success,
  Hold: StatusType.Warning,
  Manual: StatusType.Manual,
  Auto: StatusType.Auto,
  Buy: StatusType.Buy,
  Sell: StatusType.Sell,
  ADMIN: StatusType.Success,
  USER: StatusType.Warning,
  HOLD: StatusType.hold,
  EQUAL: StatusType.equal,
  SUBSCRIBED: StatusType.Success,
  UNSUBSCRIBED: StatusType.Failure,
  YES: StatusType.Success,
  NO: StatusType.Warning,
  CONNECTED: StatusType.Success,
  "NOT CONNECTED": StatusType.Failure,
  GLOBAL: StatusType.Success,
  BUSINESS: StatusType.Warning,
  ENABLED: StatusType.Success,
  BUSINESS_OWNER: StatusType.Success,
  EXPIRED: StatusType.Warning,

  EXPENSE: StatusType.Failure,
  INCOME: StatusType.Success,

  CASH: StatusType.Cash,
  GOLD: StatusType.Gold,
  SILVER: StatusType.Silver,

  // DISABLED: StatusType.Warning,
};

type CommonBadgeProps = {
  status: string;
  size?: "sm" | "md" | "lg";
  variant?: "Blue" | "Cyan" | "NeutralBlue";
};

const sizeClasses = {
  sm: "text-[10px] px-2 py-0.5",
  md: "text-xs px-2 py-1",
  lg: "text-base px-6 py-2",
};

export const CommonBadge = ({
  status,
  size = "md",
  variant,
}: CommonBadgeProps) => {
  const statusType = variant
    ? StatusType[variant]
    : statusTypeMap[status] || StatusType.Default;

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
