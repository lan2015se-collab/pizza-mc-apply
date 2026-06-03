import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { completeXboxAuthFlow } from "./xbox-auth";
import { createApplication, getApplications, getApplicationByGamertag } from "./db";

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
          return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
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
    list: publicProcedure.query(async () => {
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
  }),
});

export type AppRouter = typeof appRouter;
