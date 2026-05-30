import Code from '../components/Code.jsx';

const BASE = 'https://api.cronstream.xyz';

function MethodBadge({ method }) {
  const colors = {
    GET:    'text-[#7FDED2] border-[#7FDED2]/30',
    POST:   'text-[#C3B1E1] border-[#C3B1E1]/30',
    DELETE: 'text-[#F28B82] border-[#F28B82]/30',
  };
  return (
    <span className={`inline-flex font-mono font-semibold text-[11px] px-2 py-0.5 rounded border bg-surface ${colors[method] ?? 'text-muted-fg border-border'}`}>
      {method}
    </span>
  );
}

function AuthBadge({ type }) {
  if (type === 'apikey') return (
    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C3B1E1]/10 text-[#C3B1E1] border border-[#C3B1E1]/20">
      API key
    </span>
  );
  if (type === 'apikey|x402') return (
    <>
      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C3B1E1]/10 text-[#C3B1E1] border border-[#C3B1E1]/20">
        API key
      </span>
      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#7FDED2]/10 text-[#7FDED2] border border-[#7FDED2]/20">
        x402
      </span>
    </>
  );
  if (type === 'hmac') return (
    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F28B82]/10 text-[#F28B82] border border-[#F28B82]/20">
      HMAC
    </span>
  );
  return (
    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface text-muted border border-border">
      open
    </span>
  );
}

function Endpoint({ method, path, auth, description, children }) {
  return (
    <div className="mt-10 pt-8 border-t border-border first:border-t-0 first:mt-0 first:pt-0">
      <div className="flex items-center gap-2.5 mb-1 flex-wrap">
        <MethodBadge method={method} />
        <code className="text-[#E8F5EC] text-sm">{path}</code>
        <AuthBadge type={auth} />
      </div>
      <p className="text-muted-fg text-sm mb-4">{description}</p>
      {children}
    </div>
  );
}

export default function DeveloperApi() {
  return (
    <>
      <h1>Developer API</h1>
      <p>
        The developer API gives companies and AI agents programmatic control over their streams.
        It covers two use cases: <strong>company-initiated verification</strong> (your backend calls the agent)
        and <strong>autonomous operation</strong> (GitHub pushes events to the agent directly).
      </p>
      <p>
        Base URL: <code>{BASE}</code>
      </p>

      <h2>Authentication</h2>
      <p>
        Two authentication methods are supported on company endpoints:
      </p>
      <div className="my-3 rounded-lg border border-border overflow-hidden">
        <table style={{ margin: 0 }}>
          <thead><tr><th>Method</th><th>How</th><th>Who</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>API key</strong></td>
              <td><code>Authorization: Bearer cs_live_{'<key>'}</code></td>
              <td>Registered companies. Generated once in Settings {'>'} Developer. Shown once, cannot be retrieved.</td>
            </tr>
            <tr>
              <td><strong>x402</strong></td>
              <td><code>X-PAYMENT: {'<payment-proof>'}</code></td>
              <td>AI agents and scripts without a registered account. Pay per call in USDC on Base.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Requests without a valid key or payment return <code>401 Unauthorized</code>.
        Requests missing payment credentials on x402-gated endpoints return <code>402 Payment Required</code>
        with full payment instructions in the response body.
      </p>

      {/* ── COMPANY ENDPOINTS ────────────────────────────────── */}
      <h2>Company endpoints</h2>

      <Endpoint
        method="POST"
        path="/api/v1/verify-milestone"
        auth="apikey|x402"
        description="Run milestone verification against the registered source and return a signed EIP-712 extension voucher. Your backend then submits the voucher on-chain to extend the stream window. x402 price: $0.10 per call."
      >
        <h3>Request body</h3>
        <Code language="json">{`
{
  "streamId":           "0x...",
  "contractorAddress":  "0x...",
  "nonce":              3,
  "verificationSource": "github",
  "verificationTarget": "owner/repo",
  "githubPayload":      { ... },
  "extensionDurationSeconds": 604800
}
        `}</Code>
        <div className="my-3 rounded-lg border border-border overflow-hidden">
          <table style={{ margin: 0 }}>
            <thead><tr><th>Field</th><th>Required</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>streamId</code></td><td>Yes</td><td>0x-prefixed bytes32 stream ID</td></tr>
              <tr><td><code>contractorAddress</code></td><td>Yes</td><td>Contractor wallet address</td></tr>
              <tr><td><code>nonce</code></td><td>Yes</td><td>Current on-chain nonce (integer). Read from the contract before calling.</td></tr>
              <tr><td><code>verificationSource</code></td><td>No</td><td><code>github</code> | <code>jira</code> | <code>bitbucket</code> | <code>figma</code>. Defaults to the stream's registered source.</td></tr>
              <tr><td><code>verificationTarget</code></td><td>No</td><td>Repo path, ticket key, or URL. Defaults to the stream's registered value.</td></tr>
              <tr><td><code>githubPayload</code></td><td>Required for GitHub</td><td>Raw GitHub webhook event body. Must be a merged PR with passing CI.</td></tr>
              <tr><td><code>extensionDurationSeconds</code></td><td>No</td><td>Period length in seconds. Standard B2B periods: 1 week (604800), 2 weeks (1209600), or 1 month (2592000). Minimum 1 week. Defaults to the stream's registered period.</td></tr>
            </tbody>
          </table>
        </div>
        <h3>Success response</h3>
        <Code language="json">{`
{
  "success": true,
  "verification": {
    "source":    "github",
    "target":    "owner/repo",
    "prNumber":  42,
    "mergedAt":  "2026-05-27T18:00:00Z",
    "ciPassed":  true
  },
  "voucher": {
    "streamId":                 "0x...",
    "extensionDurationSeconds": 604800,
    "nonce":                    3,
    "expiry":                   1748100000,
    "signature":                "0x..."
  }
}
        `}</Code>
        <p>
          Pass the full <code>voucher</code> object to <code>extendStream()</code> on the contract.
          The signature is over <code>ExtensionVoucher(streamId, extensionDurationSeconds, nonce, expiry)</code>.
        </p>
        <h3>Failure response</h3>
        <Code language="json">{`{ "success": false, "error": "No qualifying PR found in the last 7 days", "failedLayer": "github" }`}</Code>
      </Endpoint>

      <Endpoint
        method="POST"
        path="/api/v1/register-stream"
        auth="apikey|x402"
        description="Register a stream with the agent after the createStream transaction confirms on-chain. This tells the agent which source to watch and starts autonomous monitoring. x402 price: $0.05 per call."
      >
        <h3>Request body</h3>
        <Code language="json">{`
{
  "streamId":                 "0x...",
  "verificationSource":       "github",
  "verificationTarget":       "owner/repo",
  "recipient":                "0x...",
  "token":                    "0x...",
  "ratePerSecond":            "1157407407407",
  "extensionDurationSeconds": 604800,
  "chainId":                  421614
}
        `}</Code>
        <p>
          <strong>All fields are required.</strong> A stream registered with missing
          fields cannot be verified, so the agent rejects the request with
          <code>400 Missing required fields</code>. Register only after the
          <code>createStream</code> transaction confirms, using values from the
          <code>StreamCreated</code> event.
        </p>
        <div className="my-3 rounded-lg border border-border overflow-hidden">
          <table style={{ margin: 0 }}>
            <thead><tr><th>Field</th><th>Required</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>streamId</code></td><td>Yes</td><td>0x-prefixed bytes32 stream ID from the <code>StreamCreated</code> event</td></tr>
              <tr><td><code>verificationSource</code></td><td>Yes</td><td><code>github</code> | <code>jira</code> | <code>bitbucket</code> | <code>figma</code></td></tr>
              <tr><td><code>verificationTarget</code></td><td>Yes</td><td>Repo path (<code>owner/repo</code>), Jira project key, Bitbucket workspace/repo, or Figma file URL</td></tr>
              <tr><td><code>recipient</code></td><td>Yes</td><td>Contractor wallet address</td></tr>
              <tr><td><code>token</code></td><td>Yes</td><td>ERC-20 token address being streamed</td></tr>
              <tr><td><code>ratePerSecond</code></td><td>Yes</td><td>Token units per second as a string (from the <code>StreamCreated</code> event)</td></tr>
              <tr><td><code>extensionDurationSeconds</code></td><td>Yes</td><td>Period length in seconds. Standard B2B periods: 1 week (604800), 2 weeks (1209600), or 1 month (2592000), minimum 1 week. Stored as the stream's period - the size of each window the agent opens or tops up when work is verified.</td></tr>
              <tr><td><code>chainId</code></td><td>Yes</td><td>Chain the stream is on (421614 Arbitrum Sepolia, 46630 Robinhood).</td></tr>
            </tbody>
          </table>
        </div>
        <h3>Response</h3>
        <Code language="json">{`{ "success": true, "streamId": "0x...", "verificationSource": "github", "verificationTarget": "owner/repo" }`}</Code>
      </Endpoint>

      <Endpoint
        method="GET"
        path="/api/v1/streams/pending"
        auth="apikey"
        description="Returns all streams for an address that are expired on-chain and have unreclaimed funds or unpaid contractor balances."
      >
        <h3>Query parameters</h3>
        <div className="my-3 rounded-lg border border-border overflow-hidden">
          <table style={{ margin: 0 }}>
            <thead><tr><th>Param</th><th>Required</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>address</code></td><td>Yes</td><td>Company or contractor wallet address</td></tr>
            </tbody>
          </table>
        </div>
        <Code language="bash">{`curl "${BASE}/api/v1/streams/pending?address=0xWALLET" \\
  -H "Authorization: Bearer cs_live_<key>"`}</Code>
        <h3>Response</h3>
        <Code language="json">{`
{
  "address": "0x...",
  "pending": [
    {
      "streamId":         "0x...",
      "chainId":          421614,
      "streamValidUntil": "1747000000",
      "reclaimable":      "1875000000",
      "contractorOwed":   "125000000",
      "token":            "0x...",
      "recipient":        "0x..."
    }
  ]
}
        `}</Code>
      </Endpoint>

      <Endpoint
        method="DELETE"
        path="/api/v1/stream/:streamId"
        auth="apikey"
        description="Remove a stream from the agent registry and stop monitoring it. Only the stream sender can call this. Does not affect on-chain state."
      >
        <Code language="bash">{`curl -X DELETE ${BASE}/api/v1/stream/0xSTREAM_ID \\
  -H "Authorization: Bearer cs_live_<key>"`}</Code>
        <Code language="json">{`{ "success": true, "streamId": "0x...", "message": "Stream removed from agent registry" }`}</Code>
        <p>Returns <code>403</code> if the caller is not the stream sender.</p>
      </Endpoint>

      {/* ── GITHUB APP + AUTONOMOUS VERIFICATION ─────────────── */}
      <h2>Connecting GitHub (autonomous mode)</h2>
      <p>
        CronStream connects to GitHub as a <strong>GitHub App</strong>, the same way Render or Vercel do -
        not a manual per-repo webhook. Whoever owns the verification repo installs the app on it from
        <strong> Settings {'>'} Integrations {'>'} Connect GitHub</strong>. Once installed, GitHub delivers
        events for every granted repo to the agent automatically. There is no webhook URL, secret, or
        payload configuration to set up by hand.
      </p>
      <div className="my-3 rounded-lg border border-border overflow-hidden">
        <table style={{ margin: 0 }}>
          <thead><tr><th>Who owns the repo</th><th>Who installs the app</th></tr></thead>
          <tbody>
            <tr><td>Company-owned repo</td><td>The company installs it; the contractor works as a collaborator. Their pushes fire events because the app is on the repo.</td></tr>
            <tr><td>Contractor-owned repo</td><td>The contractor (repo admin) installs it. The agent resolves the installation by repo, so verification works regardless of which account installed.</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        No commit-message metadata is required. The agent maps each repo to its installation and looks up
        the registered stream by repo automatically. The legacy <code>CronStream-Stream-Id</code> /
        <code>CronStream-Nonce</code> commit tags are still parsed if present, but are no longer needed.
      </p>

      <h3>Continuous-delivery verification</h3>
      <p>
        Payment is tied to delivery, not the calendar. The stream starts locked and begins flowing the
        moment work is first verified, then keeps flowing as long as the contractor keeps shipping. If
        delivery stops, the window decays and the stream freezes within one period. Concretely:
      </p>
      <ul>
        <li>The GitHub App webhook drives it. On a merged PR or a push to the default branch, the agent
            looks up the stream(s) registered to that repo and verifies the work (merged PRs <em>and</em>
            direct commits, with passing CI) since the last window.</li>
        <li>When a stream is <strong>pending</strong> (locked) and qualifying work is found, the agent opens
            a window immediately - no waiting a full period first.</li>
        <li>When an active stream is within 48h of expiring and new work exists, the agent tops it up by one
            period, so a delivering contractor never actually freezes - the balance streams continuously. A
            stream with healthy runway is left untouched, so frequent merges never stack runaway windows.</li>
        <li>Each extension signs the EIP-712 voucher and submits <code>extendStreamWindowWithSignature()</code>
            on-chain. If no qualifying work is found, the stream freezes and the company can reclaim.</li>
      </ul>

      <Endpoint
        method="POST"
        path="/api/v1/webhook/github"
        auth="hmac"
        description="Receives GitHub App events (push, pull_request, workflow_run, installation). HMAC-verified against GITHUB_WEBHOOK_SECRET. Installation events map repos to their app installation; a merged PR or default-branch push triggers verification for every stream registered to that repo and extends it if qualifying work is found."
      >
        <p>
          This endpoint is managed by the GitHub App - you don't call or configure it directly.
          Installing the app from the dashboard wires it up automatically.
        </p>
      </Endpoint>

      {/* ── OPEN ENDPOINTS ───────────────────────────────────── */}
      <h2>Open endpoints</h2>
      <p>These require no authentication and are available to any client.</p>

      <Endpoint
        method="GET"
        path="/api/v1/streams"
        auth="open"
        description="All streams for a wallet address, enriched with live on-chain data."
      >
        <Code language="bash">{`curl "${BASE}/api/v1/streams?address=0xWALLET"`}</Code>
        <Code language="json">{`
{
  "address": "0x...",
  "streams": [
    {
      "stream_id":        "0x...",
      "chain_id":         421614,
      "ratePerSecond":    "1157407407407",
      "streamValidUntil": "1748000000",
      "totalDeposited":   "2000000000",
      "totalWithdrawn":   "500000000",
      "balance":          "125000000",
      "isActive":         true
    }
  ]
}
        `}</Code>
      </Endpoint>

      <Endpoint
        method="GET"
        path="/api/v1/stream/:streamId/balance"
        auth="open"
        description="Live on-chain withdrawable balance for a stream."
      >
        <Code language="bash">{`curl "${BASE}/api/v1/stream/0xSTREAM_ID/balance"`}</Code>
        <Code language="json">{`
{
  "streamId":         "0x...",
  "chainId":          421614,
  "balance":          "125000000",
  "ratePerSecond":    "1157407407407",
  "streamValidUntil": "1748000000",
  "totalDeposited":   "2000000000",
  "totalWithdrawn":   "500000000",
  "isActive":         true
}
        `}</Code>
      </Endpoint>

      <Endpoint
        method="GET"
        path="/api/v1/stream-status/:streamId"
        auth="open"
        description="Agent-side metadata for a stream including the full extension history."
      >
        <Code language="bash">{`curl "${BASE}/api/v1/stream-status/0xSTREAM_ID"`}</Code>
        <Code language="json">{`
{
  "streamId":   "0x...",
  "stream":     { ... },
  "extensions": [
    {
      "stream_id":           "0x...",
      "nonce":               3,
      "extended_until":      "1748000000",
      "verification_source": "github",
      "created_at":          1747900000
    }
  ]
}
        `}</Code>
      </Endpoint>

      {/* ── ERROR CODES ──────────────────────────────────────── */}
      <h2>Error codes</h2>
      <div className="my-4 rounded-lg border border-border overflow-hidden">
        <table style={{ margin: 0 }}>
          <thead><tr><th>Status</th><th>Meaning</th></tr></thead>
          <tbody>
            <tr><td><code>400</code></td><td>Invalid stream ID, address, or missing required fields</td></tr>
            <tr><td><code>401</code></td><td>Missing or invalid API key or JWT</td></tr>
            <tr><td><code>402</code></td><td>x402 payment required - response body contains payment instructions</td></tr>
            <tr><td><code>403</code></td><td>Caller is not the stream sender</td></tr>
            <tr><td><code>404</code></td><td>Stream not found in registry or on-chain</td></tr>
            <tr><td><code>409</code></td><td>Stream already registered</td></tr>
            <tr><td><code>422</code></td><td>Milestone verification failed, no qualifying deliverable found</td></tr>
            <tr><td><code>500</code></td><td>Internal error</td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
