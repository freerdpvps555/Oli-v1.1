import { db } from "./index";
import { users, adminProfiles } from "./schema";

async function seed() {
  // Check if admin already exists
  const existingAdmin = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, "admin"),
  });

  if (existingAdmin) {
    console.log("Admin user already exists");
    return;
  }

  // Create admin user
  const [admin] = await db
    .insert(users)
    .values({
      username: "admin",
      password: "admin123",
      role: "admin",
    })
    .returning();

  // Create admin profile
  await db.insert(adminProfiles).values({
    userId: admin.id,
    fullName: "ผู้ดูแลระบบ",
    email: "admin@example.com",
    avatar: null,
  });

  console.log("Admin user created successfully");
}

seed()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
