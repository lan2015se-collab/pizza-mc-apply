import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { completeXboxAuthFlow } from "./xbox-auth";
import { verifyXboxGamertag } from "./openxbl-service";
import { 
  createApplication, 
  getApplications, 
  getApplicationByGamertag,
  getApplicationById,
  updateApplicationStatus,
  getApprovedApplications,
} from "./db";
import { sendApprovalNotification, sendRejectionNotification } from "./email-service";
import { getApplicationStats } from "./db-stats";

/**
 * 管理員專用 procedure
 * 檢查用戶是否為管理員
 */
const adminProcedure = publicProcedure.use(async ({ ctx, next }) => {
  // 檢查用戶是否為管理員
  if (!ctx.user || ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only administrators can perform this action",
    });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Xbox 認證與申請相關路由
  application: router({
    /**
     * 使用 OpenXBL API 驗證 Xbox Gamertag
     * 返回玩家資訊
     */
    verifyGamertag: publicProcedure
      .input(z.object({
        gamertag: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        try {
          const player = await verifyXboxGamertag(input.gamertag);
          if (!player) {
            return {
              success: false,
              error: "Gamertag not found",
            };
          }
          return {
            success: true,
            data: player,
          };
        } catch (error) {
          console.error("Xbox verification error:", error);
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          
          // Provide user-friendly error messages for API failures
          if (errorMessage.includes("Forbidden") || errorMessage.includes("403")) {
            return {
              success: false,
              error: "Unable to verify Gamertag at this moment. Please try again later or contact support.",
              details: "Xbox Live API service temporarily unavailable",
            };
          }
          
          return {
            success: false,
            error: errorMessage,
          };
        }
      }),

    /**
     * 使用 Microsoft access token 完成 Xbox 認證
     * 返回玩家資訊
     */
    verifyXboxAccount: publicProcedure
      .input(z.object({
        accessToken: z.string(),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await completeXboxAuthFlow(input.accessToken);
          return {
            success: true,
            data: result,
          };
        } catch (error) {
          console.error("Xbox verification error:", error);
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          
          // Provide user-friendly error messages for API failures
          if (errorMessage.includes("Forbidden") || errorMessage.includes("403")) {
            return {
              success: false,
              error: "Unable to verify Gamertag at this moment. Please try again later or contact support.",
              details: "Xbox Live API service temporarily unavailable",
            };
          }
          
          return {
            success: false,
            error: errorMessage,
          };
        }
      }),

    /**
     * 提交申請表單
     */
    submit: publicProcedure
      .input(z.object({
        gamertag: z.string().min(1),
        xboxAccountId: z.string().min(1),
        reason: z.string().min(1),
        aerternosUsername: z.string().optional(),
        applicantEmail: z.string().email().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          // 檢查是否已經申請過
          const existing = await getApplicationByGamertag(input.gamertag);
          if (existing) {
            return {
              success: false,
              error: "This gamertag has already applied",
            };
          }

          // 建立新申請
          const result = await createApplication({
            gamertag: input.gamertag,
            xboxAccountId: input.xboxAccountId,
            reason: input.reason,
            aerternosUsername: input.aerternosUsername,
            applicantEmail: input.applicantEmail,
          });

          return {
            success: true,
            data: result,
          };
        } catch (error) {
          console.error("Application submission error:", error);
          return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),

    /**
     * 獲取所有申請（管理員功能）
     */
    list: adminProcedure.query(async () => {
      try {
        const applications = await getApplications();
        return {
          success: true,
          data: applications,
        };
      } catch (error) {
        console.error("Failed to get applications:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),

    /**
     * 批准申請並發送通知郵件
     * 管理員專用
     */
    approve: adminProcedure
      .input(z.object({
        applicationId: z.number(),
      }))
      .mutation(async ({ input }) => {
        try {
          const app = await getApplicationById(input.applicationId);
          if (!app) {
            return {
              success: false,
              error: "Application not found",
            };
          }

          // 更新申請狀態
          await updateApplicationStatus(input.applicationId, "approved");

          // 發送批准通知郵件（使用申請者郵箱）
          if (app.applicantEmail) {
            await sendApprovalNotification(
              app.gamertag,
              app.applicantEmail,
              input.applicationId
            );
          }

          return {
            success: true,
            message: "Application approved",
          };
        } catch (error) {
          console.error("Failed to approve application:", error);
          return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),

    /**
     * 拒絕申請並發送通知郵件
     * 管理員專用
     */
    reject: adminProcedure
      .input(z.object({
        applicationId: z.number(),
        reason: z.string(),
      }))
      .mutation(async ({ input }) => {
        try {
          const app = await getApplicationById(input.applicationId);
          if (!app) {
            return {
              success: false,
              error: "Application not found",
            };
          }

          // 更新申請狀態
          await updateApplicationStatus(input.applicationId, "rejected");

          // 發送拒絕通知郵件（使用申請者郵箱）
          if (app.applicantEmail) {
            await sendRejectionNotification(
              app.gamertag,
              app.applicantEmail,
              input.reason,
              input.applicationId
            );
          }

          return {
            success: true,
            message: "Application rejected",
          };
        } catch (error) {
          console.error("Failed to reject application:", error);
          return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
  }),

  // 玩家名單相關路由
  playerList: router({
    /**
     * 獲取已批准玩家名單（公開）
     */
    getApproved: publicProcedure.query(async () => {
      try {
        const approvedApps = await getApprovedApplications();
        const players = approvedApps.map((app) => ({
          id: app.id,
          gamertag: app.gamertag,
          joinedAt: app.createdAt,
          reason: app.reason,
        }));

        return {
          success: true,
          data: {
            totalPlayers: players.length,
            players: players.sort((a, b) => 
              new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
            ),
          },
        };
      } catch (error) {
        console.error("Failed to get approved players:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),

    /**
     * 搜尋玩家
     */
    search: publicProcedure
      .input(z.object({
        query: z.string().min(1),
      }))
      .query(async ({ input }) => {
        try {
          const approvedApps = await getApprovedApplications();
          const filtered = approvedApps.filter((app) =>
            app.gamertag.toLowerCase().includes(input.query.toLowerCase())
          );

          const players = filtered.map((app) => ({
            id: app.id,
            gamertag: app.gamertag,
            joinedAt: app.createdAt,
            reason: app.reason,
          }));

          return {
            success: true,
            data: players,
          };
        } catch (error) {
          console.error("Failed to search players:", error);
          return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
            }),
  }),
  // 申請狀態查詢
  status: router({
    getByGamertag: publicProcedure
      .input(z.object({
        gamertag: z.string().min(1),
      }))
      .query(async ({ input }) => {
        try {
          const app = await getApplicationByGamertag(input.gamertag);
          if (!app) {
            return {
              success: false,
              error: "找不到申請記錄",
            };
          }
          return {
            success: true,
            data: {
              gamertag: app.gamertag,
              status: app.status,
              reason: app.reason,
              appliedAt: app.createdAt,
              serverAddress: app.status === "approved" ? "pizza-mc.aternos.me" : undefined,
              serverPort: app.status === "approved" ? 23775 : undefined,
            },
          };
        } catch (error) {
          console.error("Failed to get application status:", error);
          return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
  }),
  // 管理員統計
  admin: router({
    getStats: adminProcedure.query(async () => {
      try {
        const stats = await getApplicationStats();
        if (!stats) {
          return {
            success: false,
            error: "無法獲取統計數據",
          };
        }
        return {
          success: true,
          data: stats,
        };
      } catch (error) {
        console.error("Failed to get admin stats:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),
  }),
});
export type AppRouter = typeof appRouter;
