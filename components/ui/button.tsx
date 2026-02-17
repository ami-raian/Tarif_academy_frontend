import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-purple-600 text-white shadow-md hover:bg-purple-700 hover:shadow-lg active:scale-[0.98]",
        destructive:
          "bg-rose-500 text-white shadow-md hover:bg-rose-600 hover:shadow-lg active:scale-[0.98]",
        outline:
          "border border-input bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-gray-700 hover:border-slate-300 dark:border-gray-600 dark:hover:border-gray-500 active:scale-[0.98]",
        secondary:
          "bg-slate-100 dark:bg-gray-700 text-slate-900 dark:text-slate-100 shadow-sm hover:bg-slate-200 dark:hover:bg-gray-600 active:scale-[0.98]",
        ghost: "hover:bg-slate-100 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white dark:text-slate-300",
        link: "text-purple-600 underline-offset-4 hover:underline",
        success:
          "bg-emerald-500 text-white shadow-md hover:bg-emerald-600 hover:shadow-lg active:scale-[0.98]",
        warning:
          "bg-amber-500 text-white shadow-md hover:bg-amber-600 hover:shadow-lg active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
