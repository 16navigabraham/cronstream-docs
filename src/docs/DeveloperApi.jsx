import Code from '../components/Code.jsx';

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
        The developer API gives registered companies programmatic control over their streams.
        It covers two use cases: <strong>company-initiated verification</strong> (your backend calls the agent)
        and <strong>autonomous operation</strong> (GitHub pushes events to the agent directly).
      </p>

      <h2>Authentication</h2>
      <p>
        Companies generate their own API key from the <strong>Settings {'>'} Developer</strong> tab inside the CronStream app.
        The key is shown <strong>once</strong> at generation time in a copy prompt, it is never stored in plaintext and cannot be retrieved after the prompt is closed.
        If you lose it, regenerate a new one (the old key is immediately invalidated).
      </p>
      <p>Pass the key as a bearer token on every authenticated request:</p>
      <Code language="bash">Authorization: Bearer cs_live_{'<your-key>'}</Code>
      <p>Requests without a valid key return <code>401 Unauthorized</code>.</p>

      {/* ── COMPANY ENDPOINTS (API KEY) ──────────────────────── */}
      <h2>Company endpoints</h2>
      <p>These require an API key. The key must belong to the company (sender) of the stream.</p>

      {/* POST /api/v1/verify-milestone */}
      <Endpoint
        method="POST"
        path="/api/v1/verify-milestone"
        auth="apikey"
        description="Run milestone verification against the registered source and return a signed EIP-712 extension voucher. Your backend then submits the voucher on-chain to extend the stream window."
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
              <tr><td><code>extensionDurationSeconds</code></td><td>No</td><td>How long to extend the stream window. Defaults to 7 days (604800).</td></tr>
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

      {/* POST /api/v1/register-stream */}
      <Endpoint
        method="POST"
        path="/api/v1/register-stream"
        auth="apikey"
        description="Register a stream with the agent after the createStream transaction confirms on-chain. This tells the agent which source to watch and starts autonomous monitoring."
      >
        <h3>Request body</h3>
        <Code language="json">{`
{
  "streamId":                 "0x...",
  "verificationSource":       "github",
  "verificationTarget":       "owner/repo",
  "recipient":                "0x...",
  "ratePerSecond":            "1157407407407",
  "extensionDurationSeconds": 604800,
  "chainId":                  421614
}
        `}</Code>
        <div className="my-3 rounded-lg border border-border overflow-hidden">
          <table style={{ margin: 0 }}>
            <thead><tr><th>Field</th><th>Required</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>streamId</code></td><td>Yes</td><td>0x-prefixed bytes32 stream ID from the <code>StreamCreated</code> event</td></tr>
              <tr><td><code>verificationSource</code></td><td>Yes</td><td><code>github</code> | <code>jira</code> | <code>bitbucket</code> | <code>figma</code></td></tr>
              <tr><td><code>verificationTarget</code></td><td>Yes</td><td>Repo path (<code>owner/repo</code>), Jira project key, Bitbucket workspace/repo, or Figma file URL</td></tr>
              <tr><td><code>recipient</code></td><td>Yes</td><td>Contractor wallet address</td></tr>
              <tr><td><code>ratePerSecond</code></td><td>Yes</td><td>Token units per second as a string (from the <code>StreamCreated</code> event)</td></tr>
              <tr><td><code>extensionDurationSeconds</code></td><td>No</td><td>Period length in seconds. Defaults to 604800 (7 days).</td></tr>
              <tr><td><code>chainId</code></td><td>No</td><td>Chain the stream is on. Defaults to 421614 (Arbitrum Sepolia).</td></tr>
            </tbody>
          </table>
        </div>
        <h3>Response</h3>
        <Code language="json">{`{ "success": true, "streamId": "0x..." }`}</Code>
      </Endpoint>

      {/* GET /api/v1/streams/pending */}
      <Endpoint
        method="GET"
        path="/api/v1/streams/pending"
        auth="apikey"
        description="Returns all streams for an address that are expired on-chain and have unreclaimed funds or unpaid contractor balances. Use this to drive your reclaim dashboard."
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
        <Code language="bash">{`curl "/api/v1/streams/pending?address=0xWALLET" \\
  -H "Authorization: Bearer <key>"`}</Code>
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
        <div className="my-3 rounded-lg border border-border overflow-hidden">
          <table style={{ margin: 0 }}>
            <thead><tr><th>Field</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>reclaimable</code></td><td>Budget the company can recover via <code>reclaimUnearned()</code> on the contract</td></tr>
              <tr><td><code>contractorOwed</code></td><td>Balance the contractor can still withdraw after expiry</td></tr>
            </tbody>
          </table>
        </div>
      </Endpoint>

      {/* DELETE /api/v1/stream/:streamId */}
      <Endpoint
        method="DELETE"
        path="/api/v1/stream/:streamId"
        auth="apikey"
        description="Remove a stream from the agent registry and stop monitoring it. Only the stream sender can call this. Does not affect on-chain state."
      >
        <Code language="bash">{`curl -X DELETE /api/v1/stream/0xSTREAM_ID \\
  -H "Authorization: Bearer <key>"`}</Code>
        <Code language="json">{`{ "success": true, "streamId": "0x...", "message": "Stream removed from agent registry" }`}</Code>
        <p>Returns <code>403</code> if the caller is not the stream sender.</p>
      </Endpoint>

      {/* ── GITHUB WEBHOOK (AUTONOMOUS MODE) ─────────────────── */}
      <h2>GitHub webhook (autonomous mode)</h2>
      <p>
        For fully autonomous operation, point your GitHub repo webhook at this endpoint.
        When a PR is merged with passing CI, the agent verifies the work, signs the voucher,
        and submits the <code>extendStream()</code> transaction on-chain itself — no backend required.
      </p>

      <Endpoint
        method="POST"
        path="/api/v1/webhook/github"
        auth="hmac"
        description="Receives GitHub webhook events. On a merged PR with passing CI, the agent runs verification, signs the extension voucher, and submits on-chain autonomously."
      >
        <h3>GitHub webhook setup</h3>
        <div className="my-3 rounded-lg border border-border overflow-hidden">
          <table style={{ margin: 0 }}>
            <thead><tr><th>Setting</th><th>Value</th></tr></thead>
            <tbody>
              <tr><td>Payload URL</td><td><code>{'{YOUR_AGENT_HOST}'}/api/v1/webhook/github</code></td></tr>
              <tr><td>Content type</td><td><code>application/json</code></td></tr>
              <tr><td>Secret</td><td>Must match <code>GITHUB_WEBHOOK_SECRET</code> in agent config</td></tr>
              <tr><td>Events</td><td>Pull requests, Workflow runs</td></tr>
            </tbody>
          </table>
        </div>
        <h3>PR description convention</h3>
        <p>
          Add these lines to the PR body so the agent knows which stream to extend:
        </p>
        <Code language="markdown">{`
CronStream-Stream-Id: 0x<64 hex chars>
CronStream-Nonce: <current on-chain nonce>
        `}</Code>
        <p>
          The agent reads these fields, runs 3-layer verification (PR merged, CI passed, nonce valid),
          signs the voucher, and calls <code>extendStream()</code> on the contract.
          No action from the company is needed.
        </p>
      </Endpoint>

      {/* ── OPEN V1 ENDPOINTS ────────────────────────────────── */}
      <h2>Open endpoints</h2>
      <p>These require no authentication. They are used by the CronStream frontend and are available to any client.</p>

      <Endpoint
        method="GET"
        path="/api/v1/streams"
        auth="open"
        description="All streams for a wallet address, enriched with live on-chain data. Results are cached for 30 seconds."
      >
        <Code language="bash">curl "/api/v1/streams?address=0xWALLET"</Code>
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
        <Code language="json">{`
{
  "streamId":        "0x...",
  "chainId":         421614,
  "balance":         "125000000",
  "earnedSnapshot":  "375000000",
  "ratePerSecond":   "1157407407407",
  "streamValidUntil":"1748000000",
  "totalDeposited":  "2000000000",
  "totalWithdrawn":  "500000000",
  "isActive":        true
}
        `}</Code>
      </Endpoint>

      <Endpoint
        method="GET"
        path="/api/v1/stream-status/:streamId"
        auth="open"
        description="Agent-side metadata for a stream including the full extension history."
      >
        <Code language="json">{`
{
  "streamId":   "0x...",
  "stream":     { ... },
  "extensions": [
    {
      "stream_id":        "0x...",
      "nonce":            3,
      "extended_until":   "1748000000",
      "verification_source": "github",
      "created_at":       1747900000
    }
  ]
}
        `}</Code>
      </Endpoint>

      {/* ── Error codes ──────────────────────────────────────── */}
      <h2>Error codes</h2>
      <div className="my-4 rounded-lg border border-border overflow-hidden">
        <table style={{ margin: 0 }}>
          <thead><tr><th>Status</th><th>Meaning</th></tr></thead>
          <tbody>
            <tr><td><code>400</code></td><td>Invalid stream ID, address, or missing required fields</td></tr>
            <tr><td><code>401</code></td><td>Missing or invalid API key</td></tr>
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
