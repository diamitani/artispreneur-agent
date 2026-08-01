import Link from "next/link";

/**
 * Shown when the deployment has no Cognito configuration — a clear message
 * beats a form that can only ever fail.
 */
export function AuthUnavailable() {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
      <p className="text-[14px] font-semibold text-amber-900">
        Accounts aren&apos;t enabled on this deployment yet.
      </p>
      <p className="mt-2 text-[13.5px] leading-relaxed text-amber-800">
        Set <code className="font-mono text-[12.5px]">COGNITO_USER_POOL_ID</code> and{" "}
        <code className="font-mono text-[12.5px]">COGNITO_CLIENT_ID</code> to turn on
        sign-in, or run locally with{" "}
        <code className="font-mono text-[12.5px]">AUTH_DEV_BYPASS=1</code>.
      </p>
      <Link href="/" className="btn btn--outline btn--sm mt-4">
        Back to home
      </Link>
    </div>
  );
}
