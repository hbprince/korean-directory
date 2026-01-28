import prisma from '../db/prisma';

export const BUDGET_CONFIG = {
  monthlyBudgetUsd: parseFloat(process.env.GOOGLE_ENRICHMENT_MONTHLY_BUDGET_USD || '100'),
  placeDetailsCost: parseFloat(process.env.GOOGLE_PLACE_DETAILS_COST_PER_CALL || '0.017'),
  textSearchCost: parseFloat(process.env.GOOGLE_TEXT_SEARCH_COST_PER_CALL || '0.032'),
};

/**
 * Get current month's budget record
 */
export async function getCurrentMonthBudget() {
  const monthYear = new Date().toISOString().slice(0, 7); // "2026-01"

  let budget = await prisma.enrichmentBudget.findUnique({
    where: { monthYear },
  });

  if (!budget) {
    budget = await prisma.enrichmentBudget.create({
      data: {
        monthYear,
        spentUsd: 0,
        callCount: 0,
      },
    });
  }

  return budget;
}

/**
 * Check if we can make more API calls this month
 */
export async function canMakeApiCall(): Promise<boolean> {
  const budget = await getCurrentMonthBudget();
  return budget.spentUsd < BUDGET_CONFIG.monthlyBudgetUsd;
}

/**
 * Get remaining budget for this month
 */
export async function getRemainingBudget(): Promise<number> {
  const budget = await getCurrentMonthBudget();
  return Math.max(0, BUDGET_CONFIG.monthlyBudgetUsd - budget.spentUsd);
}

/**
 * Record an API call expense
 */
export async function recordApiCall(type: 'text_search' | 'place_details'): Promise<void> {
  const monthYear = new Date().toISOString().slice(0, 7);
  const cost = type === 'text_search' ? BUDGET_CONFIG.textSearchCost : BUDGET_CONFIG.placeDetailsCost;

  await prisma.enrichmentBudget.upsert({
    where: { monthYear },
    create: {
      monthYear,
      spentUsd: cost,
      callCount: 1,
    },
    update: {
      spentUsd: { increment: cost },
      callCount: { increment: 1 },
    },
  });
}

/**
 * Get budget status summary
 */
export async function getBudgetStatus() {
  const budget = await getCurrentMonthBudget();
  const remaining = Math.max(0, BUDGET_CONFIG.monthlyBudgetUsd - budget.spentUsd);
  const percentUsed = (budget.spentUsd / BUDGET_CONFIG.monthlyBudgetUsd) * 100;

  return {
    monthYear: budget.monthYear,
    budgetUsd: BUDGET_CONFIG.monthlyBudgetUsd,
    spentUsd: budget.spentUsd,
    remainingUsd: remaining,
    percentUsed: percentUsed.toFixed(1),
    callCount: budget.callCount,
    estimatedRemainingCalls: Math.floor(remaining / BUDGET_CONFIG.placeDetailsCost),
  };
}
