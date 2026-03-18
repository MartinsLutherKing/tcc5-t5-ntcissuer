const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function deleteDuplicates() {
  try {
    // Get all certificates
    const certs = await prisma.certificate.findMany({
      orderBy: { issuedAt: "asc" },
    });

    // Group by userId + bootcampId
    const seen = new Set();
    const toDelete = [];

    for (const cert of certs) {
      if (cert.userId) {
        const key = `${cert.userId}:${cert.bootcampId}`;
        if (seen.has(key)) {
          toDelete.push(cert.id);
        } else {
          seen.add(key);
        }
      }
    }

    // Delete duplicates
    if (toDelete.length > 0) {
      const result = await prisma.certificate.deleteMany({
        where: { id: { in: toDelete } },
      });
      console.log(`Deleted ${result.count} duplicate certificates`);
    } else {
      console.log("No duplicates found");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteDuplicates();
