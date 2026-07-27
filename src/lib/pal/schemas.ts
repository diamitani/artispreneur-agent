import { z } from "zod";

// Step 1: Identity
export const identitySchema = z.object({
  mode: z.enum(["artist", "agency", "label"]),
  artistName: z.string().min(1, "Name is required").max(100),
  realName: z.string().max(100).optional(),
  genre: z.string().min(1, "Genre is required"),
  subGenres: z.array(z.string()).max(5).optional(),
});

// Step 2: Stage & Goals
export const stageGoalsSchema = z.object({
  careerStage: z.enum(["emerging", "developing", "established", "veteran"]),
  primaryGoals: z.array(z.string()).min(1, "Select at least one goal").max(5),
  currentChallenges: z.array(z.string()).min(1, "Select at least one challenge").max(5),
});

// Step 3: Voice & Brand
export const voiceBrandSchema = z.object({
  brandAdjectives: z.array(z.string()).min(2, "Select at least 2 adjectives").max(5),
  communicationStyle: z.enum(["formal", "casual", "edgy", "professional"]),
  targetAudience: z.string().max(200).optional(),
});

// Step 4: Operations
export const operationsSchema = z.object({
  hasDistributor: z.boolean(),
  distributor: z.string().max(100).optional(),
  hasPro: z.boolean(),
  pro: z.string().max(100).optional(),
  hasManager: z.boolean(),
  monthlyBudget: z.enum(["none", "under500", "500to2000", "over2000"]).optional(),
  priorities: z.array(z.string()).min(1, "Select at least one priority").max(5),
});

// Full intake schema
export const onboardingIntakeSchema = identitySchema
  .merge(stageGoalsSchema)
  .merge(voiceBrandSchema)
  .merge(operationsSchema);

export type IdentityInput = z.infer<typeof identitySchema>;
export type StageGoalsInput = z.infer<typeof stageGoalsSchema>;
export type VoiceBrandInput = z.infer<typeof voiceBrandSchema>;
export type OperationsInput = z.infer<typeof operationsSchema>;
