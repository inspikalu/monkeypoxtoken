import * as LaunchPadInterface from "../utils/launchpad-types";

const TabButton: React.FC<LaunchPadInterface.TabButtonProps> = ({
  active,
  onClick,
  children,
}) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-t-lg font-semibold transition-colors flex items-center gap-2
        ${
          active
            ? "bg-gray-800/50 text-yellow-400 border-t border-x border-yellow-400/20"
            : "bg-gray-900/30 text-gray-400 hover:text-yellow-400"
        }`}
  >
    {children}
  </button>
);

export default TabButton;
