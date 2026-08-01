import { MASTER_AGENT, SPECIALIST_AGENTS, TOTAL_SKILL_COUNT } from "@/lib/agents/roster";

/**
 * The full capability index from the Core Agents & Skills v1 spec — every
 * agent, every documented skill, and the guardrails that bound them.
 */
export function AgentCapabilities() {
  return (
    <div>
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <p className="type-mono-label text-[color:var(--color-crimson)]">
          Core agents &amp; skills · v1
        </p>
        <h2
          className="font-heading mt-4 text-[color:var(--color-black)]"
          style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)", lineHeight: 1.14 }}
        >
          Everything your agents can do.
        </h2>
        <p className="mt-4 text-[15.5px] leading-relaxed text-[color:var(--color-gray-mid)]">
          {TOTAL_SKILL_COUNT} documented skills across {SPECIALIST_AGENTS.length}{" "}
          specialists, orchestrated by the {MASTER_AGENT.name}. Every one runs
          approval-first.
        </p>
      </div>

      {/* Master agent */}
      <AgentCard agent={MASTER_AGENT} master />

      {/* Specialists */}
      <div className="mt-6 grid gap-6">
        {SPECIALIST_AGENTS.map((a) => (
          <AgentCard key={a.id} agent={a} />
        ))}
      </div>
    </div>
  );
}

function AgentCard({
  agent,
  master,
}: {
  agent: (typeof SPECIALIST_AGENTS)[number];
  master?: boolean;
}) {
  const skillCount = agent.skillGroups.reduce((n, g) => n + g.skills.length, 0);

  return (
    <article
      id={agent.id}
      className={`scroll-mt-24 overflow-hidden rounded-[12px] border bg-white ${
        master
          ? "border-[color:var(--color-crimson)] shadow-[var(--shadow-md)]"
          : "border-[color:var(--color-border)] shadow-[var(--shadow-sm)]"
      }`}
    >
      {/* Header */}
      <div
        className={`border-b px-7 py-6 ${
          master
            ? "border-[color:var(--color-crimson)]/25 bg-[color:var(--color-crimson)]/[0.04]"
            : "border-[color:var(--color-border)] bg-[color:var(--color-bg-surface)]"
        }`}
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="font-heading text-[21px] text-[color:var(--color-black)]">
            {agent.name}
          </h3>
          {master && (
            <span className="rounded-full bg-[color:var(--color-crimson)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Master agent
            </span>
          )}
          <span className="ml-auto rounded bg-white px-2 py-0.5 font-mono text-[10.5px] font-bold text-[color:var(--color-gray-mid)]">
            {skillCount} skills
          </span>
        </div>
        <p className="type-mono-label mt-2 text-[color:var(--color-gray-mid)]">
          {agent.role}
        </p>
        <p className="mt-3 max-w-3xl text-[14.5px] leading-relaxed text-[color:var(--color-gray-dark)]">
          {agent.summary}
        </p>
      </div>

      {/* Skill groups */}
      <div className="grid gap-x-8 gap-y-7 px-7 py-7 sm:grid-cols-2">
        {agent.skillGroups.map((group) => (
          <div key={group.name}>
            <h4 className="text-[13px] font-bold text-[color:var(--color-black)]">
              {group.name}
            </h4>
            <ul className="mt-2.5 space-y-1.5">
              {group.skills.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-2 text-[13px] leading-relaxed text-[color:var(--color-gray-mid)]"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-crimson)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-1 shrink-0"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Tools + guardrails */}
      <div className="grid gap-6 border-t border-[color:var(--color-border)] bg-[color:var(--color-bg-surface)] px-7 py-6 md:grid-cols-2">
        <div>
          <p className="type-mono-label text-[color:var(--color-gray-mid)]">
            Integrations
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {agent.tools.map((t) => (
              <span
                key={t}
                className="rounded border border-[color:var(--color-border)] bg-white px-2 py-0.5 text-[11.5px] text-[color:var(--color-gray-dark)]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="type-mono-label text-[color:var(--color-gray-mid)]">
            Approval gates
          </p>
          <ul className="mt-2.5 space-y-1">
            {agent.guardrails.mayNot.map((g) => (
              <li
                key={g}
                className="flex items-start gap-2 text-[12.5px] leading-relaxed text-[color:var(--color-gray-dark)]"
              >
                <span
                  aria-hidden
                  className="mt-[3px] font-bold text-[color:var(--color-crimson)]"
                >
                  ×
                </span>
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
