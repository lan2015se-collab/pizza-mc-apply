import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Minecraft server applications table.
 * Stores user applications to join the Pizza MC server.
 */
export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  /** Xbox Gamertag of the applicant */
  gamertag: varchar("gamertag", { length: 255 }).notNull(),
  /** User's Microsoft/Xbox account ID */
  xboxAccountId: varchar("xboxAccountId", { length: 255 }).notNull(),
  /** Reason for joining the server */
  reason: text("reason").notNull(),
  /** Aternos username provided by the applicant */
  aerternosUsername: varchar("aerternosUsername", { length: 255 }),
  /** Applicant email for notifications */
  applicantEmail: varchar("applicantEmail", { length: 320 }),
  /** Application status */
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;

/**
 * Email notification log table.
 * Tracks all email notifications sent to applicants.
 */
export const emailLogs = mysqlTable("emailLogs", {
  id: int("id").autoincrement().primaryKey(),
  /** Reference to application */
  applicationId: int("applicationId").notNull(),
  /** Recipient email address */
  recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
  /** Email subject */
  subject: text("subject").notNull(),
  /** Email body */
  body: text("body").notNull(),
  /** Email status: sent, failed, pending */
  status: mysqlEnum("status", ["pending", "sent", "failed"]).default("pending").notNull(),
  /** Error message if failed */
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  sentAt: timestamp("sentAt"),
});

export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = typeof emailLogs.$inferInsert;
