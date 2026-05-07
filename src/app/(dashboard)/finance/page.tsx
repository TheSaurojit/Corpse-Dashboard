"use client";

import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    CreditCard,
    Wallet,
    Server,
    Globe,
    Activity,
    AlertCircle,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    Landmark,
    Coins,
    XCircle
} from "lucide-react";
import {
    AreaChart,
    Area,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

// Mock Data for Charts
const REVENUE_DATA = Array.from({ length: 12 }).map((_, i) => ({
    name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    revenue: Math.floor(Math.random() * 50000) + 20000,
    profit: Math.floor(Math.random() * 15000) + 5000
}));

export default function FinancePage() {
    return (
        <div className="flex flex-col gap-6 w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 pb-8">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2 font-naston">
                    <CreditCard className="h-6 w-6 text-brand-red" />
                    Finance
                </h1>
                <p className="text-zinc-400 text-sm mt-1">
                    Financial overview, revenue streams, and operational costs.
                </p>
            </div>

            {/* Primary Metrics Grid (High Priority) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Total Revenue */}
                <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-900/20 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign className="h-24 w-24 text-emerald-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                <DollarSign className="h-5 w-5" />
                            </div>
                            <span className="text-zinc-400 font-medium uppercase text-xs tracking-wider">Total Revenue (Lifetime)</span>
                        </div>
                        <div className="text-4xl font-bold text-white font-suisse mt-2">$2,450,890.00</div>
                        <div className="flex items-center gap-2 mt-4 text-sm">
                            <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 border border-emerald-500/20">
                                <TrendingUp className="h-3 w-3" /> +12.5%
                            </span>
                            <span className="text-zinc-500">vs last month</span>
                        </div>
                    </div>
                </div>

                {/* Platform Profit */}
                <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-brand-red/10 border border-brand-red/20 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp className="h-24 w-24 text-brand-red" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-brand-red/10 rounded-lg text-brand-red">
                                <Activity className="h-5 w-5" />
                            </div>
                            <span className="text-zinc-400 font-medium uppercase text-xs tracking-wider">Platform Profit</span>
                        </div>
                        <div className="text-4xl font-bold text-white font-suisse mt-2">$345,120.50</div>
                        <div className="flex items-center gap-2 mt-4 text-sm">
                            <span className="bg-brand-red/10 text-brand-red px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 border border-brand-red/20">
                                <TrendingUp className="h-3 w-3" /> +8.2%
                            </span>
                            <span className="text-zinc-500">Net Margin: 14%</span>
                        </div>
                    </div>
                </div>

                {/* Pending Payouts */}
                <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-900/20 border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet className="h-24 w-24 text-amber-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                                <Wallet className="h-5 w-5" />
                            </div>
                            <span className="text-zinc-400 font-medium uppercase text-xs tracking-wider">Pending Payouts</span>
                        </div>
                        <div className="text-4xl font-bold text-white font-suisse mt-2">$24,800.00</div>
                        <div className="flex items-center gap-2 mt-4 text-sm">
                            <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 border border-amber-500/20">
                                <AlertCircle className="h-3 w-3" /> 15 Pending
                            </span>
                            <span className="text-zinc-500">Requires Action</span>
                        </div>
                    </div>
                </div>

                {/* Sub-Primary Row */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                    <div className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-2">Revenue (Today / Month)</div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white font-suisse">$1,240</span>
                        <span className="text-zinc-500 text-sm">/ $45,200</span>
                    </div>
                    <div className="h-1 w-full bg-zinc-800 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[65%] rounded-full"></div>
                    </div>
                </div>

                <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                    <div className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-2">Total Prize Pool</div>
                    <div className="text-2xl font-bold text-blue-400 font-suisse">$1,850,000</div>
                    <div className="text-xs text-zinc-500 mt-1">Distributed across 450 tournaments</div>
                </div>

                <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                    <div className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-2">EBITDA</div>
                    <div className="text-2xl font-bold text-purple-400 font-suisse">$210,450</div>
                    <div className="flex items-center gap-1 text-xs text-purple-400/80 mt-1">
                        <TrendingUp className="h-3 w-3" /> Healthy Growth
                    </div>
                </div>

            </div>

            {/* Chart Section */}
            <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-brand-red" /> Revenue vs Profit Trend
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#D7333A" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#D7333A" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                            <Area type="monotone" dataKey="profit" stroke="#D7333A" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" name="Profit" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Secondary Metrics Grid (Detailed) */}
            <div>
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4 px-1">Detailed Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    {/* Row 1: Inflows & Outflows */}
                    <div className="bg-zinc-950/40 border border-white/5 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-zinc-500 mb-2">
                            <Coins className="h-4 w-4" /> <span className="text-xs uppercase font-bold">Entry Fees Collected</span>
                        </div>
                        <div className="text-xl font-bold text-white font-suisse">$890,500</div>
                    </div>
                    <div className="bg-zinc-950/40 border border-white/5 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-zinc-500 mb-2">
                            <Landmark className="h-4 w-4" /> <span className="text-xs uppercase font-bold">Organizer Deposits</span>
                        </div>
                        <div className="text-xl font-bold text-white font-suisse">$450,000</div>
                    </div>
                    <div className="bg-zinc-950/40 border border-white/5 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-zinc-500 mb-2">
                            <PieChart className="h-4 w-4" /> <span className="text-xs uppercase font-bold">Platform Commission</span>
                        </div>
                        <div className="text-xl font-bold text-emerald-400 font-suisse">$125,400</div>
                    </div>
                    <div className="bg-zinc-950/40 border border-white/5 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-zinc-500 mb-2">
                            <ArrowUpRight className="h-4 w-4" /> <span className="text-xs uppercase font-bold">Payouts Released</span>
                        </div>
                        <div className="text-xl font-bold text-white font-suisse">$1,100,200</div>
                    </div>

                    {/* Row 2: Costs */}
                    <div className="bg-zinc-950/40 border border-white/5 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-zinc-500 mb-2">
                            <CreditCard className="h-4 w-4" /> <span className="text-xs uppercase font-bold">Gateway Fees</span>
                        </div>
                        <div className="text-xl font-bold text-red-300 font-suisse">$12,400</div>
                    </div>
                    <div className="bg-zinc-950/40 border border-white/5 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-zinc-500 mb-2">
                            <Server className="h-4 w-4" /> <span className="text-xs uppercase font-bold">Server Cost</span>
                        </div>
                        <div className="text-xl font-bold text-red-300 font-suisse">$8,500</div>
                    </div>
                    <div className="bg-zinc-950/40 border border-white/5 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-zinc-500 mb-2">
                            <Globe className="h-4 w-4" /> <span className="text-xs uppercase font-bold">Marketing Cost</span>
                        </div>
                        <div className="text-xl font-bold text-red-300 font-suisse">$25,000</div>
                    </div>
                    <div className="bg-zinc-950/40 border border-white/5 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-zinc-500 mb-2">
                            <Activity className="h-4 w-4" /> <span className="text-xs uppercase font-bold">Operating Cost</span>
                        </div>
                        <div className="text-xl font-bold text-red-300 font-suisse">$45,200</div>
                    </div>

                    {/* Row 3: Net Metrics */}
                    <div className="bg-zinc-950/40 border border-white/5 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-zinc-500 mb-2">
                            <DollarSign className="h-4 w-4" /> <span className="text-xs uppercase font-bold">Net Revenue</span>
                        </div>
                        <div className="text-xl font-bold text-white font-suisse">$2,340,000</div>
                    </div>
                    <div className="bg-zinc-950/40 border border-white/5 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-zinc-500 mb-2">
                            <TrendingUp className="h-4 w-4" /> <span className="text-xs uppercase font-bold">Net Profit</span>
                        </div>
                        <div className="text-xl font-bold text-emerald-400 font-suisse">$345,120</div>
                    </div>
                    <div className="bg-zinc-950/40 border border-white/5 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-zinc-500 mb-2">
                            <Activity className="h-4 w-4" /> <span className="text-xs uppercase font-bold">EBITDA %</span>
                        </div>
                        <div className="text-xl font-bold text-purple-400 font-suisse">18.5%</div>
                    </div>
                    <div className="bg-zinc-950/40 border border-white/5 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-zinc-500 mb-2">
                            <XCircle className="h-4 w-4 text-red-500" /> <span className="text-xs uppercase font-bold text-red-500">Failed Tx</span>
                        </div>
                        <div className="text-xl font-bold text-red-400 font-suisse">124</div>
                    </div>

                </div>
            </div>

        </div>
    );
}
