"use client";

import {
  Users,
  Briefcase,
  Swords,
  DollarSign,
  Target,
  ShieldAlert,
  Gamepad2,
  Crown,
  Activity,
  Server,
  Terminal
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// --- Data ---
const MATCH_DATA = [
  { name: 'BGMI', total: 5200, successful: 4900, cancelled: 300 },
  { name: 'CODM', total: 4800, successful: 4100, cancelled: 700 },
  { name: 'FREE FIRE', total: 5400, successful: 5200, cancelled: 280 },
];

const PLAYER_RANKS = [
  { name: 'CONQUEROR', value: 500, color: '#D7333A' },       // Brand Red
  { name: 'ACE', value: 15000, color: '#A1A1AA' },            // Zinc 400
  { name: 'DIAMOND', value: 45000, color: '#52525B' },        // Zinc 600
  { name: 'PLATINUM', value: 120000, color: '#27272A' },      // Zinc 800
];

const MODES_DATA = [
  { name: 'BATTLE ROYAL', value: 8500, bgmi: 4000, codm: 1000, ff: 3500 },
  { name: 'MULTIPLAYER', value: 5000, bgmi: 500, codm: 3500, ff: 1000 },
  { name: 'KNOCKOUT', value: 1980, bgmi: 700, codm: 300, ff: 980 },
];

// --- Components ---

const Panel = ({ children, className = "", title, icon: Icon, action }: any) => (
  <div className={`bg-zinc-950 border border-white/10 rounded-lg p-5 flex flex-col relative overflow-hidden ${className}`}>
    {/* Technical Corner Accents */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 rounded-tl-sm" />
    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 rounded-tr-sm" />
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 rounded-bl-sm" />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 rounded-br-sm" />

    {(title || Icon) && (
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-brand-red" />}
          <span className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.2em]">{title}</span>
        </div>
        {action}
      </div>
    )}
    <div className="relative z-10 flex-1 flex flex-col">
      {children}
    </div>
  </div>
);

const StatRow = ({ label, value, subValue, highlight = false }: any) => (
  <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors px-1">
    <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-medium">{label}</span>
    <div className="text-right">
      <div className={`font-bold font-suisse text-sm ${highlight ? 'text-brand-red' : 'text-zinc-300'}`}>{value}</div>
      {subValue && <div className="text-[9px] text-zinc-600 uppercase">{subValue}</div>}
    </div>
  </div>
);

const HeroCard = ({ label, value, subLabel, icon: Icon, trend }: any) => (
  <div className="bg-zinc-950 border border-white/10 rounded-lg p-5 flex items-start justify-between group hover:border-brand-red/30 transition-colors relative overflow-hidden">
    <div className="relative z-10">
      <div className="text-zinc-500 text-[9px] uppercase tracking-[0.2em] font-bold mb-1">{label}</div>
      <div className="text-3xl font-bold text-white font-suisse tracking-tight">{value}</div>
      <div className={`text-[10px] mt-2 font-medium flex items-center gap-1 ${trend === 'positive' ? 'text-zinc-400' : 'text-red-500'}`}>
        {subLabel}
      </div>
    </div>
    <div className="bg-zinc-900/50 p-3 rounded-md border border-white/5 group-hover:bg-brand-red/10 group-hover:border-brand-red/20 transition-all">
      <Icon className="h-5 w-5 text-zinc-400 group-hover:text-brand-red transition-colors" />
    </div>
    {/* Background Mesh */}
    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
  </div>
);

// --- Page ---

export default function DashboardPage() {
  return (
    <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 pb-8 px-2 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="bg-brand-red h-8 w-1 rounded-sm" />
          <div>
            <h1 className="text-2xl font-bold text-white font-naston tracking-wide uppercase">Dashboard</h1>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-pulse" />
              Overview of Operations
            </div>
          </div>
        </div>

      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <HeroCard
          label="Total Players"
          value="850,420"
          subLabel="320k Active Sessions"
          icon={Users}
          trend="positive"
        />
        <HeroCard
          label="Net Profit"
          value="$345,120"
          subLabel="Post-Tax Revenue"
          icon={DollarSign}
          trend="positive"
        />
        <HeroCard
          label="Total Matches"
          value="15,480"
          subLabel="92% Completion Rate"
          icon={Swords}
          trend="positive"
        />
        <HeroCard
          label="Organizers"
          value="1,248"
          subLabel="892 Verified Partners"
          icon={Briefcase}
          trend="positive"
        />
      </div>

      {/* Main Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-auto lg:h-[420px]">

        {/* Match Operations Chart */}
        <Panel title="Match Operations" icon={Activity} className="lg:col-span-2">
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MATCH_DATA} barSize={40} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#52525b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#71717a', fontSize: 10, fontWeight: 700 }}
                />
                <YAxis
                  stroke="#52525b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#52525b' }}
                />
                <Tooltip
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff', borderRadius: '4px', textTransform: 'uppercase', fontSize: '10px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '10px', textTransform: 'uppercase' }} />
                {/* Monochrome Palette */}
                <Bar dataKey="successful" name="Successful" stackId="a" fill="#D7333A" />
                <Bar dataKey="cancelled" name="Cancelled" stackId="a" fill="#3f3f46" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Player Demographics */}
        <Panel title="Demographics" icon={Crown}>
          <div className="flex-1 w-full relative min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PLAYER_RANKS}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {PLAYER_RANKS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff', borderRadius: '4px', fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-white font-suisse">850k</span>
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Total</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-2 px-2">
            {PLAYER_RANKS.map(rank => (
              <div key={rank.name} className="flex justify-between items-center bg-zinc-900/30 p-1.5 rounded border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: rank.color }} />
                  <span className="text-[9px] text-zinc-400 font-bold uppercase">{rank.name}</span>
                </div>
                <span className="text-[9px] text-zinc-300 font-mono">{rank.value > 1000 ? (rank.value / 1000 + 'k') : rank.value}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Bottom Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Game Modes */}
        <Panel title="Mode Analytics" icon={Gamepad2} className="lg:col-span-2">
          <div className="grid grid-cols-3 gap-4 h-full">
            {MODES_DATA.map((mode) => (
              <div key={mode.name} className="bg-zinc-900/20 rounded border border-white/5 p-3 flex flex-col justify-between">
                <div>
                  <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider mb-2">{mode.name}</div>
                  <div className="text-lg font-bold text-white font-suisse mb-3">{mode.value}</div>
                  <div className="h-px bg-white/5 w-full mb-3" />
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px]">
                      <span className="text-zinc-600">BGMI</span><span className="text-zinc-400 font-mono">{mode.bgmi}</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-zinc-600">COD</span><span className="text-zinc-400 font-mono">{mode.codm}</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-zinc-600">FF</span><span className="text-zinc-400 font-mono">{mode.ff}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Squad Configs */}
        <Panel title="Config Distribution" icon={Target}>
          <div className="space-y-4 pt-2">
            {[
              { label: 'SOLO', val: 5000, max: 8000 },
              { label: 'DUO', val: 4000, max: 8000 },
              { label: 'SQUAD', val: 6400, max: 8000 }
            ].map(type => (
              <div key={type.label}>
                <div className="flex justify-between text-[9px] mb-1">
                  <span className="text-zinc-500 font-bold tracking-wider">{type.label}</span>
                  <span className="text-zinc-300 font-mono">{type.val}</span>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-brand-red"
                    style={{ width: `${(type.val / type.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Security Log */}
        <Panel title="Security Log" icon={ShieldAlert} className="border-red-500/20 bg-red-950/5">
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[9px] text-red-400 uppercase tracking-widest font-bold">Total Bans</div>
                <div className="text-2xl font-bold text-white font-suisse mt-1">4,500</div>
              </div>
              <ShieldAlert className="h-8 w-8 text-red-500/20" />
            </div>
            <div className="h-px bg-red-500/10 w-full" />
            <div className="space-y-1">
              <StatRow label="BGMI" value="1,200" highlight={true} />
              <StatRow label="COD MOBILE" value="800" highlight={true} />
              <StatRow label="FREE FIRE" value="2,500" highlight={true} />
            </div>
          </div>
        </Panel>

      </div>

      {/* Footer Terminal */}


    </div>
  );
}
