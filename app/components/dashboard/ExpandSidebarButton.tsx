import { Menu } from "lucide-react";

const ExpandSidebarButton: React.FC<{ onExpand: () => void }> = ({
  onExpand,
}) => (
  <button
    onClick={onExpand}
    className="hidden lg:flex absolute left-4 top-4 z-10 p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all"
    title="Expand sidebar"
    aria-label="Expand sidebar"
  >
    <Menu className="w-4 h-4 text-gray-600" />
  </button>
);

export default ExpandSidebarButton;
