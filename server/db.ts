import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, InsertApplication, applications, emailLogs, InsertEmailLog } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Create a new application
 */
export async function createApplication(app: InsertApplication) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create application: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(applications).values(app);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create application:", error);
    throw error;
  }
}

/**
 * Get all applications
 */
export async function getApplications() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get applications: database not available");
    return [];
  }

  try {
    const result = await db.select().from(applications);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get applications:", error);
    throw error;
  }
}

/**
 * Get approved applications (for public player list)
 */
export async function getApprovedApplications() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get approved applications: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(applications)
      .where(eq(applications.status, "approved"));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get approved applications:", error);
    throw error;
  }
}

/**
 * Get application by gamertag
 */
export async function getApplicationByGamertag(gamertag: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get application: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(applications).where(eq(applications.gamertag, gamertag)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get application:", error);
    throw error;
  }
}

/**
 * Get application by ID
 */
export async function getApplicationById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get application: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(applications).where(eq(applications.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get application:", error);
    throw error;
  }
}

/**
 * Update application status
 */
export async function updateApplicationStatus(id: number, status: "pending" | "approved" | "rejected") {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update application: database not available");
    return undefined;
  }

  try {
    const result = await db
      .update(applications)
      .set({ status })
      .where(eq(applications.id, id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to update application:", error);
    throw error;
  }
}

/**
 * Create email log entry
 */
export async function createEmailLog(log: InsertEmailLog) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create email log: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(emailLogs).values(log);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create email log:", error);
    throw error;
  }
}

/**
 * Get email logs for an application
 */
export async function getEmailLogsForApplication(applicationId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get email logs: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(emailLogs)
      .where(eq(emailLogs.applicationId, applicationId));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get email logs:", error);
    throw error;
  }
}
