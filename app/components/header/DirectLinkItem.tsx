import Link from "next/link";

interface DirectLinkItemProps {
  label: string;
  href: string;
  isScrolled: boolean;
}

function DirectLinkItem({ label, href, isScrolled }: DirectLinkItemProps) {
  const colorClass = isScrolled
    ? "text-gray-800 hover:text-gray-600"
    : "text-gray-800 hover:text-gray-800";

  const bgClass = isScrolled
    ? "hover:bg-gray-100"
    : "hover:bg-white/10 hover:backdrop-blur-sm";

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 py-3 px-5 font-semibold rounded-2xl transition-all duration-500 ${colorClass} ${bgClass}`}
    >
      <span>{label}</span>
    </Link>
  );
}

export default DirectLinkItem;
