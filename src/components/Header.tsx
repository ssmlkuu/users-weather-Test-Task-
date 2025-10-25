import { NavLink } from "react-router-dom";
import { Cloud } from "lucide-react"; // нейтральная иконка

export default function Header() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">

        <div className="flex items-center gap-2 text-lg font-semibold tracking-tight text-gray-800">
          <Cloud size={22} className="text-gray-500" />
          <span>Users + Weather</span>
        </div>

        <div className="flex items-center gap-2">
          <NavItem to="/" label="Home" />
          <NavItem to="/saved" label="Saved" />
        </div>
      </nav>
    </header>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative px-4 py-2 text-sm font-medium rounded-full cursor-pointer select-none transition-all
         ${
           isActive
             ? "bg-gray-900 text-white shadow-sm"
             : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
         }`
      }
    >
      {label}
    </NavLink>
  );
}
