import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipPrimitiveProvider = TooltipPrimitive.Provider as any;
const TooltipPrimitiveRoot = TooltipPrimitive.Root as any;
const TooltipPrimitiveTrigger = TooltipPrimitive.Trigger as any;
const TooltipPrimitiveContent = TooltipPrimitive.Content as any;
const TooltipPrimitiveArrow = TooltipPrimitive.Arrow as any;

function TooltipProvider({
  delayDuration = 0,
  ...props
}: any) {
  return (
    <TooltipPrimitiveProvider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: any) {
  return (
    <TooltipProvider>
      <TooltipPrimitiveRoot data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: any) {
  return <TooltipPrimitiveTrigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: any) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitiveContent
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitiveArrow className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitiveContent>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
