import { FAQS } from "@/lib/marketing-data";
import { Reveal } from "./Reveal";

export function FaqList({ limit }: { limit?: number }) {
  const items = limit ? FAQS.slice(0, limit) : FAQS;
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <Reveal key={item.q} delay={i * 0.04}>
          <details className="group rounded-[10px] border border-[color:var(--color-border)] bg-white px-5 py-4">
            <summary className="cursor-pointer list-none text-[15px] font-semibold text-[color:var(--color-black)] marker:content-none">
              <span className="flex items-center justify-between gap-4">
                {item.q}
                <span className="text-[color:var(--color-crimson)] transition-transform group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-gray-mid)]">
              {item.a}
            </p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
