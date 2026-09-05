import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const AlertDialogPrimitiveRoot = AlertDialogPrimitive.Root as any;
const AlertDialogPrimitiveTrigger = AlertDialogPrimitive.Trigger as any;
const AlertDialogPrimitivePortal = AlertDialogPrimitive.Portal as any;
const AlertDialogPrimitiveOverlay = AlertDialogPrimitive.Overlay as any;
const AlertDialogPrimitiveContent = AlertDialogPrimitive.Content as any;
const AlertDialogPrimitiveTitle = AlertDialogPrimitive.Title as any;
const AlertDialogPrimitiveDescription = AlertDialogPrimitive.Description as any;
const AlertDialogPrimitiveAction = AlertDialogPrimitive.Action as any;
const AlertDialogPrimitiveCancel = AlertDialogPrimitive.Cancel as any;

function AlertDialog({
  ...props
}: any) {
  return <AlertDialogPrimitiveRoot data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({
  ...props
}: any) {
  return (
    <AlertDialogPrimitiveTrigger data-slot="alert-dialog-trigger" {...props} />
  );
}

function AlertDialogPortal({
  ...props
}: any) {
  return (
    <AlertDialogPrimitivePortal data-slot="alert-dialog-portal" {...props} />
  );
}

function AlertDialogOverlay({
  className,
  ...props
}: any) {
  return (
    <AlertDialogPrimitiveOverlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogContent({
  className,
  ...props
}: any) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitiveContent
        data-slot="alert-dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: any) {
  return (
    <AlertDialogPrimitiveTitle
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: any) {
  return (
    <AlertDialogPrimitiveDescription
      data-slot="alert-dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  ...props
}: any) {
  return (
    <AlertDialogPrimitiveAction
      className={cn(buttonVariants(), className)}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  ...props
}: any) {
  return (
    <AlertDialogPrimitiveCancel
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
