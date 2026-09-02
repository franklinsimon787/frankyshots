import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  /*
   * ----------------------------------------
   * ADMIN ACCOUNT
   * ----------------------------------------
   */

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment."
    );
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.admin.upsert({
    where: {
      email: adminEmail,
    },
    update: {
      passwordHash,
      role: "SUPER_ADMIN",
    },
    create: {
      email: adminEmail,
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  console.log(`Super Admin ready: ${admin.email}`);

    /*
   * ----------------------------------------
   * VICKVERSE ADMIN ACCOUNT
   * ----------------------------------------
   */

  const vickVerseEmail = process.env.VICKVERSE_ADMIN_EMAIL;
  const vickVersePassword = process.env.VICKVERSE_ADMIN_PASSWORD;

  if (!vickVerseEmail || !vickVersePassword) {
    throw new Error(
      "VICKVERSE_ADMIN_EMAIL and VICKVERSE_ADMIN_PASSWORD must be set in the environment."
    );
  }

  const vickVersePasswordHash = await bcrypt.hash(
    vickVersePassword,
    12
  );

  const vickVerseAdmin = await prisma.admin.upsert({
    where: {
      email: vickVerseEmail,
    },
    update: {
      passwordHash: vickVersePasswordHash,
      role: "VICKVERSE_ADMIN",
    },
    create: {
      email: vickVerseEmail,
      passwordHash: vickVersePasswordHash,
      role: "VICKVERSE_ADMIN",
    },
  });

  console.log(
    `VickVerse Admin ready: ${vickVerseAdmin.email}`
  );
  /*
   * ----------------------------------------
   * SPECIES
   * ----------------------------------------
   *
   * We do NOT delete existing species here.
   * Existing admin-created species remain safe.
   */

  const species = [
    {
      slug: "african-lion",
      name: "African Lion",
      category: "Animals",
      location: "Savannah",
      summary:
        "A cinematic portrait of a pride in motion across the grasslands.",
      featuredImage: "/images/species/lion.jpg",
      isFeatured: true,
      status: "published",
    },
    {
      slug: "european-kingfisher",
      name: "European Kingfisher",
      category: "Birds",
      location: "Riverbank",
      summary:
        "A controlled, fast-moving study of color, precision, and environment.",
      featuredImage: "/images/species/kingfisher.jpg",
      isFeatured: true,
      status: "published",
    },
  ];

  for (const item of species) {
    await prisma.species.upsert({
      where: {
        slug: item.slug,
      },
      update: item,
      create: item,
    });
  }

  console.log("Species seed data checked successfully.");

  /*
   * ----------------------------------------
   * VICKVERSE POSTS
   * ----------------------------------------
   *
   * Temporary test content.
   * Later these posts will be managed
   * directly from the VickVerse Admin.
   */

  const vickVersePosts = [
    {
      slug: "welcome-to-vickverse",
      title: "Welcome to VickVerse",
      description:
        "Stories, ideas and content from the VickVerse YouTube channel.",
      content:
        "Welcome to VickVerse.\n\nThis is a test article created to check the complete VickVerse system.\n\nSoon, articles, stories and video content will be added directly through the VickVerse Admin interface.\n\nThis page will become the home for detailed content connected with the VickVerse YouTube channel.",
      image: "/images/species/lion.jpg",
      youtubeUrl: null,
      category: "VickVerse",
      tags: "VickVerse, YouTube, Stories",
      isFeatured: true,
      status: "published",
    },
    {
      slug: "behind-the-scenes",
      title: "Behind the Scenes",
      description:
        "A look into the stories, ideas and work that happen behind the camera.",
      content:
        "Every story begins with an idea.\n\nVickVerse explores the process behind creating meaningful visual content and the work that happens behind the camera.\n\nThis is temporary test content for the VickVerse system.",
      image: "/images/species/kingfisher.jpg",
      youtubeUrl: null,
      category: "Behind the Scenes",
      tags: "Behind the Scenes, Filmmaking, VickVerse",
      isFeatured: false,
      status: "published",
    },
  ];

  for (const post of vickVersePosts) {
    const vickVersePost = await prisma.vickVersePost.upsert({
      where: {
        slug: post.slug,
      },
      update: {
        title: post.title,
        description: post.description,
        content: post.content,
        image: post.image,
        youtubeUrl: post.youtubeUrl,
        category: post.category,
        tags: post.tags,
        isFeatured: post.isFeatured,
        status: post.status,
      },
      create: post,
    });

    console.log(`VickVerse post ready: ${vickVersePost.title}`);
  }

  console.log("VickVerse seed data checked successfully.");
}

/*
 * ----------------------------------------
 * RUN SEED
 * ----------------------------------------
 */

main()
  .catch((error) => {
    console.error("SEED ERROR:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });