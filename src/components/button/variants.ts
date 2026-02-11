import { tv } from 'tailwind-variants';

export const buttonStyles = tv(
    {
        base: "cursor-pointer flex gap-2 justify-center items-center rounded-full text-sm font-medium duration-300 ease-out disabled:cursor-default",
        variants: {
            variant: {
                primary: "text-white disabled:text-white",
                outline: "bg-transparent border border-border text-muted-foreground",
                warning: "rounded-lg bg-warning-bg/10 border border-warning-border text-warning-text gap-1",
                failure: "rounded-lg bg-failed/10 border border-failed text-failed gap-1",
                badge: "rounded-lg bg-section leading-4 border border-[#4D4D4D] text-muted-foreground text-sm font-medium",
            },

            size: {
                md: "h-8 px-3",
                lg: "h-10 px-8",
                sm: "h-[21px] w-[39px]",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    },
    { responsiveVariants: true }
);
