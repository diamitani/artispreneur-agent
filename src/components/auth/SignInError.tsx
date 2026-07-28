/**
 * Sign-in failure notice.
 *
 * Sign-in used to fail silently: a missing env var threw a 500, or the
 * callback bounced back to /signin with an ?error= nobody rendered. This turns
 * each failure into something the operator can act on.
 */

const MESSAGES: Record<string, { title: string; body: string }> = {
  not_configured: {
    title: "Sign-in isn't configured yet",
    body: "This deployment is missing the environment variables Cognito needs. Set them on the host, redeploy, and try again.",
  },
  token_exchange_failed: {
    title: "Couldn't complete sign-in",
    body: "Cognito returned a code but the token exchange failed. This is usually a redirect URI that doesn't exactly match the one registered on the Cognito app client, or a missing SESSION_SECRET.",
  },
  missing_verifier: {
    title: "Sign-in session expired",
    body: "The login took longer than 10 minutes, or cookies were blocked. Try again.",
  },
  missing_code: {
    title: "Sign-in was interrupted",
    body: "Cognito didn't return an authorization code. Try again.",
  },
  login_failed: {
    title: "Couldn't start sign-in",
    body: "Something went wrong building the Cognito authorization URL. Check the server logs.",
  },
};

export function SignInError({ error, missing }: { error: string; missing?: string }) {
  const known = MESSAGES[error];
  const vars = missing?.split(",").map((v) => v.trim()).filter(Boolean) ?? [];

  return (
    <div
      role="alert"
      className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-left"
    >
      <p className="text-sm font-semibold text-red-900">
        {known?.title ?? "Sign-in failed"}
      </p>
      <p className="mt-1 text-sm text-red-800">
        {known?.body ?? decodeURIComponent(error)}
      </p>

      {vars.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-900">
            Missing variables
          </p>
          <ul className="mt-1 space-y-0.5">
            {vars.map((v) => (
              <li key={v} className="font-mono text-xs text-red-800">
                {v}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-3 text-xs text-red-700">
        Full diagnostics:{" "}
        <a href="/api/health" className="font-mono underline">
          /api/health
        </a>
      </p>
    </div>
  );
}
