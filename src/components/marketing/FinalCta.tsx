import Image from "next/image";
import { brand } from "@/lib/brand";
import { Reveal } from "./Reveal";

export function FinalCta({
  title = "Build your music business.",
  body = "Join independent musicians running real careers with an AI business team — approval-first.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="section bg-[color:var(--color-bg-brand)] text-center text-white">
      <Reveal className="container-page mx-auto max-w-[600px]">
        <Image
          src={brand.logo.primaryPng}
          alt=""
          width={56}
          height={56}
          className="mx-auto mb-5 h-14 w-14"
        />
        <h2
          className="font-heading text-white"
          style={{ fontSize: "clamp(1.85rem, 4vw, 2.6rem)" }}
        >
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/75">{body}</p>
        <a
          href="/api/auth/login?signup=1&return=/onboarding"
          className="btn btn--gold btn--lg mt-9"
        >
          Become an Artispreneur
        </a>
      </Reveal>
    </section>
  );
}
