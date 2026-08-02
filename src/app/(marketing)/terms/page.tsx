import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/marketing/LegalPage";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of Artispreneur.",
};

/**
 * Linked from the footer since launch and 404ing until now. Stripe requires
 * published terms before accepting live payments.
 *
 * This is a plain-language baseline, not a substitute for review by a lawyer
 * before you take real money.
 */
export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="August 2, 2026">
      <LegalSection title="1. What Artispreneur is">
        <p>
          Artispreneur is software that helps independent musicians run the
          business side of their work. It drafts documents, plans, and outreach
          using AI agents. It is a tool you direct — not a manager, publicist,
          lawyer, accountant, or agent, and it does not act on your behalf.
        </p>
      </LegalSection>

      <LegalSection title="2. Not professional advice">
        <p>
          Nothing Artispreneur produces is legal, tax, financial, or investment
          advice. Contract drafts, entity-formation guidance, royalty analysis,
          and split sheets are starting points for you to review. Have a
          qualified professional review anything that carries legal or financial
          weight before you rely on it or sign it.
        </p>
      </LegalSection>

      <LegalSection title="3. Your account">
        <p>
          You must be at least 18, or the age of majority where you live. Keep
          your credentials secure — you are responsible for activity under your
          account. Tell us promptly if you believe it has been compromised.
        </p>
      </LegalSection>

      <LegalSection title="4. Your content stays yours">
        <p>
          You keep all rights to the music, artwork, documents, and information
          you put into Artispreneur, and to what the agents produce for you. You
          grant us only the licence needed to store and process that material to
          operate the service for you. We do not use your content to train
          models, and we do not share it between accounts.
        </p>
      </LegalSection>

      <LegalSection title="5. Approval-first operation">
        <p>
          Agents draft; you approve. Outgoing actions — emails, pitches, filings,
          publications — pass through your approval queue. You are responsible
          for what you approve and send, including its accuracy and its
          compliance with the law and with third-party terms.
        </p>
      </LegalSection>

      <LegalSection title="6. Acceptable use">
        <p>You agree not to use Artispreneur to:</p>
        <ul>
          <li>infringe anyone&apos;s copyright, trademark, or other rights;</li>
          <li>send spam or unlawful, deceptive, or harassing messages;</li>
          <li>misrepresent ownership of a recording, composition, or split;</li>
          <li>attempt to access another user&apos;s workspace or data;</li>
          <li>resell or redistribute the service without our written agreement.</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Plans, billing, and cancellation">
        <p>
          Paid plans are billed monthly in advance through Stripe. You can cancel
          at any time from your account settings; access continues to the end of
          the period you have already paid for. We do not provide pro-rata
          refunds for partial months unless the law requires it. If a payment
          fails we may retry and, if it keeps failing, move the workspace back to
          the free plan. We will give notice before changing prices.
        </p>
      </LegalSection>

      <LegalSection title="8. Third-party services">
        <p>
          Artispreneur can connect to services you already use — email, storage,
          CRM, distributors, PROs. Those services have their own terms, and we
          are not responsible for what they do. Connecting an account authorises
          us to act on it only as you direct.
        </p>
      </LegalSection>

      <LegalSection title="9. AI output">
        <p>
          AI output can be wrong, incomplete, or out of date. Verify facts,
          figures, deadlines, and names before acting on them. We make no promise
          about outcomes — placements, coverage, bookings, streams, or revenue.
        </p>
      </LegalSection>

      <LegalSection title="10. Availability and changes">
        <p>
          We work to keep the service running but do not guarantee uninterrupted
          availability. We may change or discontinue features. If we make a
          material adverse change to a paid plan, we will tell you first.
        </p>
      </LegalSection>

      <LegalSection title="11. Termination">
        <p>
          You may stop using Artispreneur at any time and export your workspace.
          We may suspend or end an account that breaches these terms. If we do,
          we will give you a reasonable chance to export your data unless the law
          prevents it.
        </p>
      </LegalSection>

      <LegalSection title="12. Liability">
        <p>
          To the extent the law allows, Artispreneur is provided as is, and our
          total liability for any claim is limited to what you paid us in the
          twelve months before it arose. We are not liable for indirect or
          consequential loss, including lost revenue or lost opportunities.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact">
        <p>
          Questions about these terms: <a href={`mailto:${BRAND.email.support}`}>{BRAND.email.support}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
