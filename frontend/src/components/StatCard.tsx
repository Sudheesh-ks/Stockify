import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, Icon, link }: any) => (
  <div className="group flex flex-col p-6 rounded-2xl bg-[#0d1117]/80 border border-[#1a1f2a] hover:border-emerald-500/50 shadow-xl transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 shadow-inner transition-colors">
        <Icon className="text-emerald-400 w-6 h-6" />
      </div>
      <Link
        to={link}
        className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-emerald-400 transition-colors uppercase tracking-wider"
      >
        View More
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
    <div>
      <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
    </div>
  </div>
);

export default StatCard;