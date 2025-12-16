import React from "react";

import { Slot, Slottable } from "@radix-ui/react-slot";
import { VariantProps } from "tailwind-variants";
import { buttonStyles } from "./variants";

import { cn } from "../../utils";
import { AlertIcon } from "../icons";

/* -----------------------------------------------------------------------------
 * Button Types
 * ---------------------------------------------------------------------------*/

type ButtonElements = React.ElementRef<"button">;
type ButtonPrimitiveProps = React.ComponentPropsWithoutRef<"button">;
type ButtonVariants = VariantProps<typeof buttonStyles>;

interface ButtonProps extends ButtonPrimitiveProps, ButtonVariants {
    asChild?: boolean;
    alert?: boolean;
}

/* ----------------------------------------------------------------------------
 * Component
 * ---------------------------------------------------------------------------*/

const Button = React.forwardRef<ButtonElements, ButtonProps>((props, ref) => {
    const { asChild = false, alert = false, variant, className, size, children, type = "button", disabled, ...buttonProps } = props;

    const Comp = asChild ? Slot : "button";

    // Apply custom button styling for primary variant, but not when disabled
    const style =
        variant === "primary" && !asChild && !disabled
            ? {
                  backgroundColor: "hsl(var(--button-bg))",
                  color: "hsl(var(--button-text))",
              }
            : undefined;

    return (
        <Comp type={type} className={buttonStyles({ variant, size, className })} style={style} ref={ref} disabled={disabled} {...buttonProps}>
            {alert && (
                <AlertIcon className={cn("size-5", variant === "failure" ? "text-failed" : variant === "warning" ? "text-warning-text" : "")} />
            )}
            <Slottable>{children}</Slottable>
        </Comp>
    );
});

Button.displayName = "Button";

/* ----------------------------------------------------------------------------
 * Export
 * ---------------------------------------------------------------------------*/

export { Button };
