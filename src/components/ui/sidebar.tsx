
import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export interface SidebarProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
}

export function Sidebar({
  title,
  description,
  children,
  trigger,
  side = "right",
}: SidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || <Button variant="outline">Open</Button>}
      </SheetTrigger>
      <SheetContent side={side} className="overflow-y-auto">
        <SheetHeader>
          {title && <SheetTitle>{title}</SheetTitle>}
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="mt-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
