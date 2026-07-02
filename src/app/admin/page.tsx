'use client';

import * as React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  Users, 
  MousePointerClick, 
  DollarSign, 
  TrendingUp,
  ArrowUpRight,
  LogOut,
  Home
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';

// Mock Data
const data = [
  { name: 'Mon', visitors: 4000, clicks: 2400 },
  { name: 'Tue', visitors: 3000, clicks: 1398 },
  { name: 'Wed', visitors: 2000, clicks: 9800 },
  { name: 'Thu', visitors: 2780, clicks: 3908 },
  { name: 'Fri', visitors: 1890, clicks: 4800 },
  { name: 'Sat', visitors: 2390, clicks: 3800 },
  { name: 'Sun', visitors: 3490, clicks: 4300 },
];

export default function AdminDashboard() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Topbar */}


      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground mt-1">Monitor your traffic and affiliate performance.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Visitors</h3>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">19,540</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-emerald-500">
              <ArrowUpRight className="mr-1 h-3 w-3" /> +20.1% from last month
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Affiliate Clicks</h3>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">3,456</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-emerald-500">
              <ArrowUpRight className="mr-1 h-3 w-3" /> +14.2% from last month
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Conv. Rate</h3>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">17.6%</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-emerald-500">
              <ArrowUpRight className="mr-1 h-3 w-3" /> +2.4% from last month
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Est. Revenue</h3>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">$4,231.89</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-emerald-500">
              <ArrowUpRight className="mr-1 h-3 w-3" /> +8.1% from last month
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-4">
            <h3 className="font-semibold mb-4">Traffic & Clicks (Last 7 Days)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                  <Area type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitors)" />
                  <Area type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-3">
            <h3 className="font-semibold mb-4">Top Performing Products</h3>
            <div className="space-y-6">
              {[
                { title: "KONG Classic Dog Toy", clicks: 1245, revenue: "$450" },
                { title: "Taste of the Wild High Prairie", clicks: 843, revenue: "$890" },
                { title: "Chuckit! Ultra Ball", clicks: 642, revenue: "$120" },
                { title: "Greenies Dental Treats", clicks: 531, revenue: "$230" },
                { title: "Frisco Foldable Playpen", clicks: 420, revenue: "$340" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.clicks} clicks</p>
                  </div>
                  <div className="font-medium">{item.revenue}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
