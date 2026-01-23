import Link from "next/link";

interface DirectLinkItemProps {
  label: string;
  href: string;
  isScrolled: boolean;
}

function DirectLinkItem({ label, href, isScrolled }: DirectLinkItemProps) {
  const colorClass = isScrolled ? "text-white " : "text-white ";

  const bgClass = isScrolled
    ? "hover:bg-gray-100"
    : "hover:bg-white/10 hover:backdrop-blur-sm";

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 py-2 px-5 font-semibold rounded-2xl transition-all duration-500 ${colorClass} ${bgClass} bg-linear-to-r from-primary-500 to-orange-500 text-white`}
    >
      <span>{label}</span>
    </Link>
  );
}

export default DirectLinkItem;
