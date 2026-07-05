import prisma from '@/lib/prisma';
import { AnalyticsDashboardClient } from './AnalyticsDashboardClient';

export default async function AdminDashboardPage() {
  const [productCount, categoryCount, blogCount, userCount, viewsAgg, clicksAgg] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.blog.count(),
    prisma.user.count(),
    prisma.blog.aggregate({ _sum: { viewCount: true } }),
    prisma.product.aggregate({ _sum: { clickCount: true } })
  ]);
  
  // Real data tracking for the last 6 months
  const now = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const monthlyDataPromises = Array.from({ length: 6 }).map((_, i) => {
    // i goes from 0 to 5. We want 5 months ago to current month.
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const startDate = new Date(d.getFullYear(), d.getMonth(), 1);
    const endDate = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    const monthName = monthNames[d.getMonth()];
    
    return Promise.all([
      prisma.product.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
      prisma.blog.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
      prisma.user.count({ where: { createdAt: { gte: startDate, lte: endDate } } })
    ]).then(([products, blogs, users]) => ({
      name: monthName,
      products,
      blogs,
      users
    }));
  });

  const monthlyData = await Promise.all(monthlyDataPromises);

  const data = {
    totalProducts: productCount,
    totalCategories: categoryCount,
    totalBlogs: blogCount,
    totalUsers: userCount,
    totalViews: viewsAgg._sum.viewCount || 0,
    totalClicks: clicksAgg._sum.clickCount || 0,
    monthlyData
  };
  
  return <AnalyticsDashboardClient data={data} />;
}
