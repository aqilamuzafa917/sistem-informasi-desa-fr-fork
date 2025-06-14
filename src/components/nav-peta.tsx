"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavPeta({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      isActive?: boolean;
    }[];
  }[];
}) {
  const [openStates, setOpenStates] = React.useState<Record<string, boolean>>(
    items.reduce(
      (acc, item) => {
        // Check if any sub-item is active
        const hasActiveSubItem = item.items?.some(
          (subItem) => subItem.isActive,
        );
        acc[item.title] = item.isActive || hasActiveSubItem || false;
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );

  // Update open states when items change
  React.useEffect(() => {
    setOpenStates(
      items.reduce(
        (acc, item) => {
          const hasActiveSubItem = item.items?.some(
            (subItem) => subItem.isActive,
          );
          acc[item.title] = item.isActive || hasActiveSubItem || false;
          return acc;
        },
        {} as Record<string, boolean>,
      ),
    );
  }, [items]);

  return (
    <SidebarMenu>
      {items.map((item) => (
        <Collapsible
          key={item.title}
          asChild
          open={openStates[item.title]}
          onOpenChange={(open) => {
            setOpenStates((prev) => ({
              ...prev,
              [item.title]: open,
            }));
          }}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items?.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                      <Link to={`${subItem.url}`}>
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      ))}
    </SidebarMenu>
  );
}
