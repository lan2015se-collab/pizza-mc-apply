/**
 * 申請統計數據查詢
 */

import { getDb } from "./db";
import { applications } from "../drizzle/schema";
import { eq, gte, lte, and } from "drizzle-orm";

export interface ApplicationStats {
  totalApplications: number;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  approvalRate: number;
  monthlyStats: Array<{
    month: string;
    applications: number;
    approved: number;
    rejected: number;
  }>;
}

/**
 * 獲取申請統計數據
 */
export async function getApplicationStats(
  startDate?: Date,
  endDate?: Date
): Promise<ApplicationStats | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Stats] Database not available");
    return null;
  }

  try {
    // 構建查詢條件
    const conditions = [];
    if (startDate) {
      conditions.push(gte(applications.createdAt, startDate));
    }
    if (endDate) {
      conditions.push(lte(applications.createdAt, endDate));
    }

    const allApps = await db
      .select()
      .from(applications)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    // 計算統計數據
    const totalApplications = allApps.length;
    const approvedCount = allApps.filter((app) => app.status === "approved").length;
    const rejectedCount = allApps.filter((app) => app.status === "rejected").length;
    const pendingCount = allApps.filter((app) => app.status === "pending").length;
    const approvalRate = totalApplications > 0 ? (approvedCount / totalApplications) * 100 : 0;

    // 按月份統計
    const monthlyMap = new Map<
      string,
      { applications: number; approved: number; rejected: number }
    >();

    allApps.forEach((app) => {
      const date = new Date(app.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { applications: 0, approved: 0, rejected: 0 });
      }

      const stats = monthlyMap.get(monthKey)!;
      stats.applications += 1;

      if (app.status === "approved") {
        stats.approved += 1;
      } else if (app.status === "rejected") {
        stats.rejected += 1;
      }
    });

    const monthlyStats = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, stats]) => ({
        month,
        ...stats,
      }));

    return {
      totalApplications,
      approvedCount,
      rejectedCount,
      pendingCount,
      approvalRate: Math.round(approvalRate * 100) / 100,
      monthlyStats,
    };
  } catch (error) {
    console.error("[Stats] Error fetching statistics:", error);
    return null;
  }
}

/**
 * 獲取按狀態分組的申請統計
 */
export async function getApplicationsByStatus(): Promise<{
  pending: number;
  approved: number;
  rejected: number;
} | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Stats] Database not available");
    return null;
  }

  try {
    const allApps = await db.select().from(applications);

    return {
      pending: allApps.filter((app) => app.status === "pending").length,
      approved: allApps.filter((app) => app.status === "approved").length,
      rejected: allApps.filter((app) => app.status === "rejected").length,
    };
  } catch (error) {
    console.error("[Stats] Error fetching status breakdown:", error);
    return null;
  }
}

/**
 * 獲取最近 N 天的申請統計
 */
export async function getRecentApplicationStats(days: number = 30): Promise<ApplicationStats | null> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return getApplicationStats(startDate, endDate);
}
