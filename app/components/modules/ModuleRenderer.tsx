"use client";
import React from "react";
import registry, { ModuleComponentProps } from "./registry";

type LayoutItem = {
  moduleId: string;
  order: number;
  props?: Record<string, any>;
  module?: {
    _id: string;
    name: string;
    type: string;
    content: any;
    status: "published" | "draft";
  };
};

export default function ModuleRenderer({
  item,
  index,
}: {
  item: LayoutItem;
  index: number;
}) {
  if (!item.module) {
    return (
      <div className="bg-yellow-50 border border-yellow-100 rounded p-4 text-sm text-yellow-700">
        <strong>Missing Module</strong>
        <div className="mt-1 text-xs">Module ID: {item.moduleId}</div>
        <pre className="mt-2 text-xs bg-white p-2 rounded">
          {JSON.stringify(item, null, 2)}
        </pre>
      </div>
    );
  }

  const type = (item.module.type || "").toLowerCase();

  const Component = registry[type];

  if (!Component) {
    return (
      <div className="bg-red-50 border border-red-100 rounded p-4 text-sm text-red-700">
        Unknown module type: <strong>{type}</strong>
        <div className="mt-1 text-xs">
          Module: {item.module.name} (ID: {item.module._id})
        </div>
        <pre className="mt-2 text-xs bg-white p-2 rounded">
          {JSON.stringify(item.module, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <Component
      data={item.module.content || {}}
      key={item.module._id || index}
    />
  );
}
