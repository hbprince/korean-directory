/**
 * Seed script for GuideContent
 * Reads markdown files from data/guides/*.md and upserts them into the database
 * Run with: npx tsx scripts/seed-guides.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

const prisma = new PrismaClient();

interface GuideFrontmatter {
  slug: string;
  titleKo: string;
  titleEn: string;
  categorySlug: string;
  summary: string;
  tags: string[];
  seasonStart?: number;
  seasonEnd?: number;
  sourceUrls: string[];
}

interface FAQ {
  q: string;
  a: string;
}

/**
 * Extract FAQs from markdown content
 * Looks for "## 자주 묻는 질문" section and parses Q&A pairs
 */
function extractFAQs(content: string): FAQ[] {
  const faqs: FAQ[] = [];

  // Find the FAQ section
  const faqSectionMatch = content.match(/##\s*자주\s*묻는\s*질문.*?\n([\s\S]*?)(?=\n##\s|\n---|\n\*\*|$)/i);

  if (!faqSectionMatch) {
    return faqs;
  }

  const faqSection = faqSectionMatch[1];

  // Match all Q&A pairs
  // Supports two formats:
  //   Format 1: ### Q: question\nA: answer
  //   Format 2: ### Q: question\n\nanswer (no A: prefix)
  const qaPattern = /###\s*Q:\s*([^\n]+)\s*\n\s*(?:A:\s*)?([^\n]+(?:\n(?!###)[^\n]+)*)/g;

  let match;
  while ((match = qaPattern.exec(faqSection)) !== null) {
    const question = match[1].trim();
    const answer = match[2].trim().replace(/\n/g, ' ').trim();

    if (answer) {
      faqs.push({
        q: question,
        a: answer
      });
    }
  }

  return faqs;
}

/**
 * Process a single guide markdown file
 */
async function processGuideFile(filePath: string): Promise<void> {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  const frontmatter = data as GuideFrontmatter;

  // Extract FAQs from content
  const faqs = extractFAQs(content);

  console.log(`Processing: ${frontmatter.slug}`);
  console.log(`  - Title: ${frontmatter.titleKo}`);
  console.log(`  - Category: ${frontmatter.categorySlug}`);
  console.log(`  - FAQs found: ${faqs.length}`);

  // Upsert into database
  await prisma.guideContent.upsert({
    where: { slug: frontmatter.slug },
    update: {
      titleKo: frontmatter.titleKo,
      titleEn: frontmatter.titleEn,
      contentKo: content,
      summary: frontmatter.summary,
      categorySlug: frontmatter.categorySlug,
      faqsJson: faqs,
      sourceUrls: frontmatter.sourceUrls || [],
      tags: frontmatter.tags || [],
      seasonStart: frontmatter.seasonStart || null,
      seasonEnd: frontmatter.seasonEnd || null,
      status: 'draft',
      updatedAt: new Date(),
    },
    create: {
      slug: frontmatter.slug,
      titleKo: frontmatter.titleKo,
      titleEn: frontmatter.titleEn,
      contentKo: content,
      summary: frontmatter.summary,
      categorySlug: frontmatter.categorySlug,
      faqsJson: faqs,
      sourceUrls: frontmatter.sourceUrls || [],
      tags: frontmatter.tags || [],
      seasonStart: frontmatter.seasonStart || null,
      seasonEnd: frontmatter.seasonEnd || null,
      status: 'draft',
      viewCount: 0,
    },
  });

  console.log(`  ✅ Upserted successfully\n`);
}

/**
 * Main function
 */
async function main() {
  const guidesDir = path.resolve(__dirname, '../data/guides');

  console.log('🚀 Starting guide content seed...');
  console.log(`📁 Reading from: ${guidesDir}\n`);

  // Check if directory exists
  if (!fs.existsSync(guidesDir)) {
    console.error(`❌ Directory not found: ${guidesDir}`);
    process.exit(1);
  }

  // Find all .md files
  const files = fs.readdirSync(guidesDir)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(guidesDir, file));

  console.log(`Found ${files.length} guide file(s)\n`);

  if (files.length === 0) {
    console.log('⚠️  No markdown files found in data/guides/');
    return;
  }

  // Process each file
  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    try {
      await processGuideFile(file);
      successCount++;
    } catch (error) {
      errorCount++;
      console.error(`❌ Error processing ${path.basename(file)}:`, error);
      console.error('');
    }
  }

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Summary:');
  console.log(`  ✅ Successfully processed: ${successCount}`);
  console.log(`  ❌ Errors: ${errorCount}`);
  console.log(`  📝 Total guides in database: ${await prisma.guideContent.count()}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// Run main function
main()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
