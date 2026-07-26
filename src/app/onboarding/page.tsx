"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music,
  Users,
  Building2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Check,
  Sparkles,
} from "lucide-react";
import type { OnboardingIntake, OperatingMode } from "@/types/onboarding";
import {
  GENRE_OPTIONS,
  GOAL_OPTIONS,
  CHALLENGE_OPTIONS,
  BRAND_ADJECTIVES,
  PRIORITY_OPTIONS,
} from "@/lib/pal/options";
import {
  identitySchema,
  stageGoalsSchema,
  voiceBrandSchema,
  operationsSchema,
} from "@/lib/pal/schemas";

// ---------------------------------------------------------------------------
// Step definitions
// ---------------------------------------------------------------------------

const STEPS = [
  { label: "Identity", number: 1 },
  { label: "Stage & Goals", number: 2 },
  { label: "Voice & Brand", number: 3 },
  { label: "Operations", number: 4 },
] as const;

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Form state
  const [intake, setIntake] = useState<Partial<OnboardingIntake>>({
    mode: undefined,
    artistName: "",
    realName: "",
    genre: "",
    subGenres: [],
    careerStage: undefined,
    primaryGoals: [],
    currentChallenges: [],
    brandAdjectives: [],
    communicationStyle: undefined,
    targetAudience: "",
    hasDistributor: false,
    distributor: "",
    hasPro: false,
    pro: "",
    hasManager: false,
    monthlyBudget: undefined,
    priorities: [],
  });

  const updateField = useCallback(
    <K extends keyof OnboardingIntake>(key: K, value: OnboardingIntake[K]) => {
      setIntake((prev) => ({ ...prev, [key]: value }));
      setErrors([]);
    },
    []
  );

  const toggleArrayItem = useCallback(
    (key: keyof OnboardingIntake, item: string, max: number) => {
      setIntake((prev) => {
        const current = (prev[key] as string[]) ?? [];
        if (current.includes(item)) {
          return { ...prev, [key]: current.filter((i) => i !== item) };
        }
        if (current.length >= max) return prev;
        return { ...prev, [key]: [...current, item] };
      });
      setErrors([]);
    },
    []
  );

  // Validate current step
  const validateStep = useCallback((): boolean => {
    let result;
    switch (currentStep) {
      case 0:
        result = identitySchema.safeParse(intake);
        break;
      case 1:
        result = stageGoalsSchema.safeParse(intake);
        break;
      case 2:
        result = voiceBrandSchema.safeParse(intake);
        break;
      case 3:
        result = operationsSchema.safeParse(intake);
        break;
      default:
        return true;
    }
    if (!result.success) {
      setErrors(result.error.issues.map((i) => i.message));
      return false;
    }
    setErrors([]);
    return true;
  }, [currentStep, intake]);

  const goNext = useCallback(() => {
    if (validateStep()) {
      setCurrentStep((s) => Math.min(s + 1, 3));
    }
  }, [validateStep]);

  const goBack = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0));
    setErrors([]);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    setErrors([]);

    try {
      const res = await fetch("/api/pal/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(intake),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors([data.error ?? "Something went wrong"]);
        setIsSubmitting(false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        router.push(data.redirect ?? "/dashboard");
      }
    } catch {
      setErrors(["Network error. Please try again."]);
      setIsSubmitting(false);
    }
  }, [intake, validateStep, router]);

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? 80 : -80,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(0);

  const animatedNext = () => {
    setDirection(1);
    goNext();
  };
  const animatedBack = () => {
    setDirection(-1);
    goBack();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-[family-name:var(--font-display)] text-lg font-bold text-black">
              Set Up Your Workspace
            </h1>
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of 4
            </span>
          </div>
          <div className="flex gap-2">
            {STEPS.map((step, i) => (
              <div key={step.number} className="flex-1 flex flex-col gap-1">
                <div
                  className={`h-1.5 rounded-full transition-colors duration-300 ${
                    i <= currentStep ? "bg-crimson" : "bg-gray-200"
                  }`}
                />
                <span
                  className={`text-xs ${
                    i <= currentStep ? "text-crimson font-medium" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "tween", duration: 0.25 }}
            >
              {currentStep === 0 && (
                <StepIdentity
                  intake={intake}
                  updateField={updateField}
                />
              )}
              {currentStep === 1 && (
                <StepStageGoals
                  intake={intake}
                  updateField={updateField}
                  toggleArrayItem={toggleArrayItem}
                />
              )}
              {currentStep === 2 && (
                <StepVoiceBrand
                  intake={intake}
                  updateField={updateField}
                  toggleArrayItem={toggleArrayItem}
                />
              )}
              {currentStep === 3 && (
                <StepOperations
                  intake={intake}
                  updateField={updateField}
                  toggleArrayItem={toggleArrayItem}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              {errors.map((err, i) => (
                <p key={i} className="text-sm text-red-600">
                  {err}
                </p>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={animatedBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-100 disabled:opacity-0 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft size={16} />
              Back
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={animatedNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-crimson hover:bg-crimson-dark transition-colors shadow-md"
              >
                Next
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-black bg-gold hover:bg-gold-light disabled:opacity-70 transition-colors shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Compiling your workspace...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Launch My Workspace
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1: Identity
// ---------------------------------------------------------------------------

function StepIdentity({
  intake,
  updateField,
}: {
  intake: Partial<OnboardingIntake>;
  updateField: <K extends keyof OnboardingIntake>(key: K, value: OnboardingIntake[K]) => void;
}) {
  const modes: { id: OperatingMode; label: string; description: string; icon: typeof Music }[] = [
    {
      id: "artist",
      label: "Artist",
      description: "Solo creator, one workspace",
      icon: Music,
    },
    {
      id: "agency",
      label: "Agency",
      description: "Management company, client workspaces",
      icon: Users,
    },
    {
      id: "label",
      label: "Label",
      description: "Record label, roster workspaces",
      icon: Building2,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-black">
          Who are you?
        </h2>
        <p className="text-gray-600 mt-1">
          Tell us about yourself so we can configure your AI team.
        </p>
      </div>

      {/* Mode Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          I am a...
        </label>
        <div className="grid grid-cols-3 gap-3">
          {modes.map(({ id, label, description, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => updateField("mode", id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                intake.mode === id
                  ? "border-crimson bg-red-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <Icon
                size={24}
                className={intake.mode === id ? "text-crimson" : "text-gray-400"}
              />
              <p className="font-semibold mt-2 text-sm">{label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Artist Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {intake.mode === "agency"
            ? "Agency Name"
            : intake.mode === "label"
              ? "Label Name"
              : "Artist / Stage Name"}
        </label>
        <input
          type="text"
          value={intake.artistName ?? ""}
          onChange={(e) => updateField("artistName", e.target.value)}
          placeholder={
            intake.mode === "agency"
              ? "e.g. Pulse Management"
              : intake.mode === "label"
                ? "e.g. Midnight Records"
                : "e.g. DJ Nova"
          }
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-crimson focus:ring-1 focus:ring-crimson outline-none text-sm"
        />
      </div>

      {/* Real Name (optional) */}
      {intake.mode === "artist" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Real Name{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={intake.realName ?? ""}
            onChange={(e) => updateField("realName", e.target.value)}
            placeholder="Your legal name"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-crimson focus:ring-1 focus:ring-crimson outline-none text-sm"
          />
        </div>
      )}

      {/* Genre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Primary Genre
        </label>
        <select
          value={intake.genre ?? ""}
          onChange={(e) => updateField("genre", e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-crimson focus:ring-1 focus:ring-crimson outline-none text-sm bg-white"
        >
          <option value="">Select a genre...</option>
          {GENRE_OPTIONS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2: Stage & Goals
// ---------------------------------------------------------------------------

function StepStageGoals({
  intake,
  updateField,
  toggleArrayItem,
}: {
  intake: Partial<OnboardingIntake>;
  updateField: <K extends keyof OnboardingIntake>(key: K, value: OnboardingIntake[K]) => void;
  toggleArrayItem: (key: keyof OnboardingIntake, item: string, max: number) => void;
}) {
  const stages = [
    { id: "emerging" as const, label: "Emerging", description: "Just starting out, < 1 year" },
    { id: "developing" as const, label: "Developing", description: "1-3 years, building momentum" },
    { id: "established" as const, label: "Established", description: "3+ years, consistent releases" },
    { id: "veteran" as const, label: "Veteran", description: "Industry pro, looking to optimize" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-black">
          Where are you now?
        </h2>
        <p className="text-gray-600 mt-1">
          This helps us recommend the right priorities and agents.
        </p>
      </div>

      {/* Career Stage */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Career Stage
        </label>
        <div className="grid grid-cols-2 gap-3">
          {stages.map(({ id, label, description }) => (
            <button
              key={id}
              type="button"
              onClick={() => updateField("careerStage", id)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                intake.careerStage === id
                  ? "border-crimson bg-red-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Goals{" "}
          <span className="text-gray-400 font-normal">(pick up to 5)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {GOAL_OPTIONS.map((goal) => {
            const selected = intake.primaryGoals?.includes(goal);
            return (
              <button
                key={goal}
                type="button"
                onClick={() => toggleArrayItem("primaryGoals", goal, 5)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selected
                    ? "bg-crimson text-white border-crimson"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {selected && <Check size={12} className="inline mr-1" />}
                {goal}
              </button>
            );
          })}
        </div>
      </div>

      {/* Challenges */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Challenges{" "}
          <span className="text-gray-400 font-normal">(pick up to 5)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {CHALLENGE_OPTIONS.map((challenge) => {
            const selected = intake.currentChallenges?.includes(challenge);
            return (
              <button
                key={challenge}
                type="button"
                onClick={() =>
                  toggleArrayItem("currentChallenges", challenge, 5)
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selected
                    ? "bg-crimson text-white border-crimson"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {selected && <Check size={12} className="inline mr-1" />}
                {challenge}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3: Voice & Brand
// ---------------------------------------------------------------------------

function StepVoiceBrand({
  intake,
  updateField,
  toggleArrayItem,
}: {
  intake: Partial<OnboardingIntake>;
  updateField: <K extends keyof OnboardingIntake>(key: K, value: OnboardingIntake[K]) => void;
  toggleArrayItem: (key: keyof OnboardingIntake, item: string, max: number) => void;
}) {
  const styles = [
    { id: "formal" as const, label: "Formal", description: "Professional, polished" },
    { id: "casual" as const, label: "Casual", description: "Relaxed, friendly" },
    { id: "edgy" as const, label: "Edgy", description: "Bold, provocative" },
    { id: "professional" as const, label: "Professional", description: "Business-forward" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-black">
          Your Voice & Brand
        </h2>
        <p className="text-gray-600 mt-1">
          This shapes how your AI team communicates on your behalf.
        </p>
      </div>

      {/* Brand Adjectives */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brand Adjectives{" "}
          <span className="text-gray-400 font-normal">(pick 2-5)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {BRAND_ADJECTIVES.map((adj) => {
            const selected = intake.brandAdjectives?.includes(adj);
            return (
              <button
                key={adj}
                type="button"
                onClick={() => toggleArrayItem("brandAdjectives", adj, 5)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selected
                    ? "bg-gold text-black border-gold font-bold"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {adj}
              </button>
            );
          })}
        </div>
      </div>

      {/* Communication Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Communication Style
        </label>
        <div className="grid grid-cols-2 gap-3">
          {styles.map(({ id, label, description }) => (
            <button
              key={id}
              type="button"
              onClick={() => updateField("communicationStyle", id)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                intake.communicationStyle === id
                  ? "border-crimson bg-red-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Target Audience */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Audience{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={intake.targetAudience ?? ""}
          onChange={(e) => updateField("targetAudience", e.target.value)}
          placeholder="e.g. 18-35 hip-hop fans who value authenticity"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-crimson focus:ring-1 focus:ring-crimson outline-none text-sm"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4: Operations
// ---------------------------------------------------------------------------

function StepOperations({
  intake,
  updateField,
  toggleArrayItem,
}: {
  intake: Partial<OnboardingIntake>;
  updateField: <K extends keyof OnboardingIntake>(key: K, value: OnboardingIntake[K]) => void;
  toggleArrayItem: (key: keyof OnboardingIntake, item: string, max: number) => void;
}) {
  const budgetOptions = [
    { id: "none" as const, label: "$0" },
    { id: "under500" as const, label: "Under $500/mo" },
    { id: "500to2000" as const, label: "$500-$2,000/mo" },
    { id: "over2000" as const, label: "$2,000+/mo" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-black">
          Your Current Setup
        </h2>
        <p className="text-gray-600 mt-1">
          Tell us what you already have in place so we can fill the gaps.
        </p>
      </div>

      {/* Distributor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Do you have a distributor?
          </label>
          <ToggleSwitch
            checked={intake.hasDistributor ?? false}
            onChange={(v) => updateField("hasDistributor", v)}
          />
        </div>
        {intake.hasDistributor && (
          <input
            type="text"
            value={intake.distributor ?? ""}
            onChange={(e) => updateField("distributor", e.target.value)}
            placeholder="e.g. DistroKid, TuneCore, CD Baby"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-crimson focus:ring-1 focus:ring-crimson outline-none text-sm"
          />
        )}
      </div>

      {/* PRO */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Registered with a PRO?
          </label>
          <ToggleSwitch
            checked={intake.hasPro ?? false}
            onChange={(v) => updateField("hasPro", v)}
          />
        </div>
        {intake.hasPro && (
          <input
            type="text"
            value={intake.pro ?? ""}
            onChange={(e) => updateField("pro", e.target.value)}
            placeholder="e.g. ASCAP, BMI, SESAC"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-crimson focus:ring-1 focus:ring-crimson outline-none text-sm"
          />
        )}
      </div>

      {/* Manager */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Do you have a manager?
        </label>
        <ToggleSwitch
          checked={intake.hasManager ?? false}
          onChange={(v) => updateField("hasManager", v)}
        />
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Monthly Marketing Budget
        </label>
        <div className="grid grid-cols-4 gap-2">
          {budgetOptions.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => updateField("monthlyBudget", id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all text-center ${
                intake.monthlyBudget === id
                  ? "border-crimson bg-red-50 text-crimson"
                  : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Priorities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Immediate Priorities{" "}
          <span className="text-gray-400 font-normal">(pick up to 5)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PRIORITY_OPTIONS.map((priority) => {
            const selected = intake.priorities?.includes(priority);
            return (
              <button
                key={priority}
                type="button"
                onClick={() => toggleArrayItem("priorities", priority, 5)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selected
                    ? "bg-crimson text-white border-crimson"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {selected && <Check size={12} className="inline mr-1" />}
                {priority}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toggle Switch Component
// ---------------------------------------------------------------------------

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-crimson" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
