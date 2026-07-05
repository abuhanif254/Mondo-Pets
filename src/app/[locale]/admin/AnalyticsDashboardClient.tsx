'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Package, Users, FileText, ShoppingCart, Eye, MousePointerClick } from 'lucide-react';

interface AnalyticsData {
  totalProducts: number;
  totalCategories: number;
  totalBlogs: number;
  totalUsers: number;
  totalViews: number;
  totalClicks: number;
  monthlyData: any[];
}

export function AnalyticsDashboardClient({ data }: { data: AnalyticsData }) {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
        <div className="p-4 sm:p-6 bg-card rounded-2xl border border-border flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Total Products</p>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">{data.totalProducts}</h2>
          </div>
          <div className="p-2 sm:p-3 bg-primary/10 text-primary rounded-xl flex-shrink-0 ml-2">
            <Package className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
        
        <div className="p-4 sm:p-6 bg-card rounded-2xl border border-border flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Categories</p>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">{data.totalCategories}</h2>
          </div>
          <div className="p-2 sm:p-3 bg-blue-500/10 text-blue-500 rounded-xl flex-shrink-0 ml-2">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-card rounded-2xl border border-border flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Blog Posts</p>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">{data.totalBlogs}</h2>
          </div>
          <div className="p-2 sm:p-3 bg-green-500/10 text-green-500 rounded-xl flex-shrink-0 ml-2">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-card rounded-2xl border border-border flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Registered Users</p>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">{data.totalUsers}</h2>
          </div>
          <div className="p-2 sm:p-3 bg-orange-500/10 text-orange-500 rounded-xl flex-shrink-0 ml-2">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-card rounded-2xl border border-border flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Blog Views</p>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">{data.totalViews.toLocaleString()}</h2>
          </div>
          <div className="p-2 sm:p-3 bg-purple-500/10 text-purple-500 rounded-xl flex-shrink-0 ml-2">
            <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-card rounded-2xl border border-border flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Product Clicks</p>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">{data.totalClicks.toLocaleString()}</h2>
          </div>
          <div className="p-2 sm:p-3 bg-pink-500/10 text-pink-500 rounded-xl flex-shrink-0 ml-2">
            <MousePointerClick className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="bg-card p-4 sm:p-6 rounded-2xl border border-border">
          <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Content Growth</h3>
          <div className="h-[260px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                <Line type="monotone" dataKey="products" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="blogs" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} />
                <CartesianGrid stroke="#ccc" strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} width={30} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-4 sm:p-6 rounded-2xl border border-border">
          <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">User Registrations</h3>
          <div className="h-[260px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                <Bar dataKey="users" fill="#f97316" radius={[4, 4, 0, 0]} />
                <CartesianGrid stroke="#ccc" strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} width={30} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
