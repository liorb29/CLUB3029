import { db } from "@/lib/db";

// הערה: Inbox הוא פרויקט וירטואלי (projectId=null על Task) — ראה PRD §6.3 / D9.
// אין כאן יצירת רשומת Project בשם "Inbox"; ה-UI מציג את Inbox כברירת מחדל
// כאשר projectId הוא null.

async function main() {
  await db.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      timezone: "Asia/Jerusalem",
      weekStartsOn: 0,
    },
  });

  console.log("Seed complete: Settings singleton ensured.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
