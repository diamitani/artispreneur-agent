import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/marketing/LegalPage";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What Artispreneur collects, why, where it is stored, and how to get it back or delete it.",
};

/**
 * Linked from the footer since launch and 404ing until now.
 *
 * Every claim here is checked against what the code actually does — Cognito for
 * identity, DynamoDB for the control plane, S3 for workspace files, Bedrock for
 * inference, Stripe for payments. Do not add a promise the runtime does not
 * keep.
 */
export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="August 2, 2026"
      intro={
        <p>
          Artispreneur holds the private business details of your music career —
          your legal name, your splits, your contacts, your numbers. This page
          says plainly what we collect, why we need it, who else touches it, and
          how to take it back.
        </p>
      }
    >
      <LegalSection title="1. What we collect">
        <p>
          <strong>Account details.</strong> Your email address and password,
          handled by Amazon Cognito. We never see or store your password
          ourselves.
        </p>
        <p>
          <strong>What you tell your agent.</strong> The onboarding intake and
          your chats — stage name, genre, goals, business structure, releases,
          contacts, and anything else you type. This becomes your Master Soul.md,
          the context every agent reads before it drafts.
        </p>
        <p>
          <strong>What the agents produce.</strong> Drafts, plans, documents, and
          the tasks in your workspace.
        </p>
        <p>
          <strong>Connected accounts.</strong> If you link a third-party service,
          we store the access token needed to act on it as you direct — never the
          password for that service.
        </p>
        <p>
          <strong>Usage.</strong> Model token counts per request, so we can show
          you your usage and keep the service running. Standard server logs
          include IP address and timestamps.
        </p>
        <p>
          <strong>Payment.</strong> Handled entirely by Stripe. We store your
          Stripe customer and subscription identifiers and your plan status. Card
          numbers never reach our servers.
        </p>
      </LegalSection>

      <LegalSection title="2. What we do not do">
        <ul>
          <li>We do not train models on your content.</li>
          <li>We do not sell your data or share it with advertisers.</li>
          <li>We do not contact anyone in your network without your approval.</li>
          <li>
            We do not mix data between accounts — every workspace is stored under
            its own scoped path and read only for the signed-in owner.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Why we hold it">
        <p>
          To run the service you asked for: to authenticate you, to give your
          agents the context that makes their drafts specific rather than
          generic, to store what they produce, to bill the plan you chose, and to
          meet our legal and accounting obligations.
        </p>
      </LegalSection>

      <LegalSection title="4. Where it lives">
        <p>
          Artispreneur runs on Amazon Web Services. Identity is in Amazon
          Cognito; your workspace records are in Amazon DynamoDB; your files and
          your Soul.md are in Amazon S3, encrypted at rest with access blocked to
          the public. All traffic is over TLS.
        </p>
        <p>
          AI inference runs on Amazon Bedrock. Prompts sent to Bedrock are
          processed to return your response and are not used by AWS to train
          their models.
        </p>
      </LegalSection>

      <LegalSection title="5. Who else processes it">
        <p>
          We use a small set of processors, each for one job: <strong>AWS</strong>{" "}
          for hosting, storage, identity, and inference; <strong>Stripe</strong>{" "}
          for payments; <strong>Vercel</strong> for serving the application. Any
          third-party service you connect yourself — email, storage, CRM, a
          distributor, a PRO — receives only what you direct your agent to send
          it, under that service&apos;s own privacy policy.
        </p>
      </LegalSection>

      <LegalSection title="6. How long we keep it">
        <p>
          Your workspace stays as long as your account is open. Delete your
          account and we remove your workspace data within 30 days, except
          records we must keep for tax and accounting — typically invoices, for
          the period the law requires. Server logs roll off on a short cycle.
        </p>
      </LegalSection>

      <LegalSection title="7. Your rights">
        <p>
          You can ask for a copy of your data, correct it, or have it deleted.
          You can export your workspace at any time. If you are in the EEA or the
          UK, you also have the right to object to processing, to restrict it,
          and to complain to your data protection authority. If you are in
          California, you have the right to know, delete, and correct, and we do
          not sell or share personal information as those terms are defined
          there.
        </p>
        <p>
          Email <a href={`mailto:${BRAND.email.support}`}>{BRAND.email.support}</a>{" "}
          and we will respond within 30 days.
        </p>
      </LegalSection>

      <LegalSection title="8. Cookies">
        <p>
          We set one cookie: an encrypted session cookie that keeps you signed
          in. There are no advertising or cross-site tracking cookies. Clearing
          it signs you out.
        </p>
      </LegalSection>

      <LegalSection title="9. Children">
        <p>
          Artispreneur is not for anyone under 18, and we do not knowingly
          collect their data. If you believe a minor has an account, write to us
          and we will remove it.
        </p>
      </LegalSection>

      <LegalSection title="10. Breach notification">
        <p>
          If a breach affects your personal data, we will notify you and the
          relevant authorities without undue delay, and tell you what happened
          and what to do about it.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes">
        <p>
          If we make a material change to this policy, we will update the date
          above and tell you before it takes effect.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact">
        <p>
          Privacy questions and data requests:{" "}
          <a href={`mailto:${BRAND.email.support}`}>{BRAND.email.support}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
