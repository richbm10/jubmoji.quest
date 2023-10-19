import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex items-center rounded-full font-medium px-4 w-full flex justify-center gap-2 focus:ring-0 focus:outline-none active:scale-95",
  {
    variants: {
      size: {
        sm: "text-[13px] py-2",
        md: "text-[16px] py-3 leading-none",
        lg: "",
      },
      variant: {
        primary: "primary border border-white text-white ",
        secondary: "secondary bg-white text-black border border-shark-400",
        transparent: "bg-transparent",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "primary",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: any;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, loading, icon, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {icon}
        <span className="text-base font-medium">
          {loading ? "Loading..." : children}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
