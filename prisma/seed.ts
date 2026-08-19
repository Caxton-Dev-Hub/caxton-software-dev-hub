/**
 * Seeds a demo dataset so you can click through the whole app immediately.
 *
 *   npm run db:seed
 *
 * Accounts created (change these before deploying anywhere public):
 *   admin@caxtonhub.com   / caxton-admin-2026
 *   student@caxtonhub.com / caxton-student-2026
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("caxton-admin-2026", 12);
  const studentHash = await bcrypt.hash("caxton-student-2026", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@caxtonhub.com" },
    update: { role: "ADMIN" },
    create: {
      name: "Caxton Admin",
      email: "admin@caxtonhub.com",
      phone: "+234 800 000 0000",
      passwordHash,
      role: "ADMIN",
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@caxtonhub.com" },
    update: {},
    create: {
      name: "Tobi Adeyemi",
      email: "student@caxtonhub.com",
      phone: "+234 801 111 1111",
      passwordHash: studentHash,
      role: "STUDENT",
      bio: "Self-taught, six months in. Aiming for a frontend role by the end of the year.",
    },
  });

  // A settled payment plus the enrolment it bought.
  const payment = await prisma.payment.upsert({
    where: { reference: "cx_seed_course_001" },
    update: {},
    create: {
      userId: student.id,
      reference: "cx_seed_course_001",
      kind: "COURSE",
      itemSlug: "frontend-engineering-react-nextjs",
      amountKobo: 18_000_000,
      status: "PAID",
      channel: "card",
      paidAt: new Date(),
    },
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseSlug: {
        userId: student.id,
        courseSlug: "frontend-engineering-react-nextjs",
      },
    },
    update: {},
    create: {
      userId: student.id,
      courseSlug: "frontend-engineering-react-nextjs",
      paymentId: payment.id,
      status: "ACTIVE",
    },
  });

  // Two lessons already ticked off, so progress bars are not at zero.
  for (const lessonId of ["cx101-1-1", "cx101-1-2"]) {
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: student.id, lessonId } },
      update: {},
      create: {
        userId: student.id,
        courseSlug: "frontend-engineering-react-nextjs",
        lessonId,
      },
    });
  }

  const mentorshipPayment = await prisma.payment.upsert({
    where: { reference: "cx_seed_mentor_001" },
    update: {},
    create: {
      userId: student.id,
      reference: "cx_seed_mentor_001",
      kind: "MENTORSHIP",
      itemSlug: "momentum",
      amountKobo: 9_500_000,
      status: "PAID",
      channel: "bank_transfer",
      paidAt: new Date(),
    },
  });

  const existingBooking = await prisma.mentorshipBooking.findFirst({
    where: { paymentId: mentorshipPayment.id },
  });
  if (!existingBooking) {
    await prisma.mentorshipBooking.create({
      data: {
        userId: student.id,
        planSlug: "momentum",
        goal: "I can build small React apps but I freeze in technical interviews. I want a frontend role within six months.",
        status: "SCHEDULED",
        paymentId: mentorshipPayment.id,
      },
    });
  }

  // A few people already queued for the full Cairo/Starknet cohort.
  const waitlistCount = await prisma.waitlistEntry.count();
  if (waitlistCount === 0) {
    await prisma.waitlistEntry.createMany({
      data: [
        {
          courseSlug: "cairo-starknet-smart-contracts",
          name: "Grace Okonkwo",
          email: "grace@example.com",
          phone: "+234 803 333 3333",
          note: "I have two years of Solidity experience and want to move to Cairo. Any start date works.",
          status: "WAITING",
        },
        {
          courseSlug: "cairo-starknet-smart-contracts",
          name: "Musa Bello",
          email: "musa@example.com",
          note: "Backend engineer, no onchain experience yet. Evenings work best for me.",
          status: "WAITING",
        },
        {
          courseSlug: "cairo-starknet-smart-contracts",
          name: "Tobi Adeyemi",
          email: "student@caxtonhub.com",
          userId: student.id,
          status: "WAITING",
        },
      ],
    });
  }

  const leadCount = await prisma.lead.count();
  if (leadCount === 0) {
    await prisma.lead.createMany({
      data: [
        {
          name: "Amina Yusuf",
          email: "amina@example.com",
          phone: "+234 802 222 2222",
          company: "Rido Logistics",
          service: "Custom software development",
          budget: "₦1.5m – ₦5m",
          message:
            "Our dispatch still runs on WhatsApp and a spreadsheet. We need a system where a dispatcher can see every consignment and drivers can capture proof of delivery.",
          status: "NEW",
        },
        {
          name: "Ibrahim Sani",
          email: "ibrahim@example.com",
          company: "Green Harvest",
          service: "Web design & development",
          budget: "₦500,000 – ₦1.5m",
          message:
            "We need a marketing site that loads quickly on mobile data and lets our team publish updates without calling a developer every time.",
          status: "CONTACTED",
        },
      ],
    });
  }

  console.info("Seed complete.");
  console.info(`  admin:   admin@caxtonhub.com / caxton-admin-2026  (${admin.id})`);
  console.info(`  student: student@caxtonhub.com / caxton-student-2026  (${student.id})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
