"use client";

import React from "react";
import type { NavigationItem as NavItemType } from "@/app/admin/dashboard/layout";
import NavigationItem from "./NavigationItem";
import NavigationItemWithSubmenu from "./NavigationItemWithSubmenu";

type Props = {
  item: NavItemType;
  activeItemId: string;
  isExpanded: boolean;
  onClick: (id: string, href?: string) => void;
};

const NavigationItemWrapper: React.FC<Props> = ({
  item,
  activeItemId,
  isExpanded,
  onClick,
}) => {
  const hasChildren = item.children && item.children.length > 0;

  const isActive = activeItemId === item.id;

  const hasActiveChild =
    item.children?.some((child) => child.id === activeItemId) || false;

  if (hasChildren) {
    return (
      <NavigationItemWithSubmenu
        item={item}
        isActive={isActive || hasActiveChild}
        isExpanded={isExpanded}
        onClick={onClick}
      />
    );
  }

  return (
    <NavigationItem
      item={item}
      isActive={isActive}
      isExpanded={isExpanded}
      onClick={onClick}
    />
  );
};

export default React.memo(NavigationItemWrapper);
