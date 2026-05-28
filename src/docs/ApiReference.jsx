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
  if (type === 'x402') return (
    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">x402</span>
  );
  if (type === 'apikey') return (
    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C3B1E1]/10 text-[#C3B1E1] border border-[#C3B1E1]/20">API key</span>
  );
  return (
    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface text-muted border border-border">free</span>
  );
}

function Endpoint({ method, path, auth, description }) {
  return (
    <div className="mt-10 pt-8 border-t border-border first:border-t-0 first:mt-0 first:pt-0">
      <div className="flex items-center gap-2.5 mb-2 flex-wrap">
        <MethodBadge method={method} />
        <code className="text-[#E8F5EC] text-sm">{path}</code>
        {auth && <AuthBadge type={auth} />}
      </div>
      <p className="text-muted-fg text-sm mb-0">{description}</p>
    </div>
  );
}

export default function ApiReference() {
  return (
    <>
      <h1>API Reference</h1>
      <p>
        CronStream exposes two API surfaces: the <strong>Public API</strong> (pay-per-call via x402, no account needed)
        and the <strong>Developer API</strong> (authenticated with an API key, for registered integrations).
      </p>

      <div className="my-5 rounded-lg border border-border overflow-hidden">
        <table style={{ margin: 0 }}>
          <thead><tr><th>Auth type</th><th>How to use</th></tr></thead>
          <tbody>
            <tr>
              <td><code>x402</code></td>
              <td>Pay USDC per request, see the <a href="#x402">x402 page</a> for the full flow. No account needed.</td>
            </tr>
            <tr>
              <td><code>API key</code></td>
              <td>Pass your key as <code>Authorization: Bearer {'<'}key{'>'}</code>. Contact us to request access.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Public API ────────────────────────────────────────────── */}
      <h2>Public API</h2>
      <p>Open to any wallet or agent. Paid endpoints return HTTP 402 without a valid <code>X-PAYMENT</code> header.</p>

      <Endpoint method="GET" path="/api/public/info" auth="free" description="Returns API metadata, current pricing, and the pay-to address. Call this first." />
      <Code language="json">{`
{
  "name":    "CronStream Public API",
  "version": "2.0.0",
  "protocol": "x402",
  "network":  "base-sepolia",
  "payTo":    "0x...",
  "pricing": {
    "POST /api/public/verify-milestone":            "$0.10 USDC per call",
    "GET  /api/public/stream/:id":                  "$0.01 USDC per call",
    "GET  /api/public/balance/:id":                 "$0.01 USDC per call",
    "GET  /api/public/streams/company/:address":    "$0.05 USDC per call",
    "GET  /api/public/streams/contractor/:address": "$0.05 USDC per call"
  }
}
      `}</Code>

      <Endpoint method="GET" path="/api/public/stream/:id" auth="x402" description="Full stream state, registry metadata and live on-chain data combined." />
      <Code language="bash">{`curl {BASE_URL}/api/public/stream/0xSTREAM_ID \\
  -H "X-PAYMENT: <proof>"`}</Code>
      <Code language="json">{`
{
  "streamId":           "0x...",
  "chainId":            421614,
  "verificationSource": "github",
  "verificationTarget": "owner/repo",
  "sender":             "0x...",
  "recipient":          "0x...",
  "token":              "0x...",
  "ratePerSecond":      "1157407407407",
  "streamValidUntil":   "1748000000",
  "totalDeposited":     "2000000000",
  "totalWithdrawn":     "500000000",
  "nonce":              "3",
  "balance":            "125000000",
  "createdAt":          1747000000
}
      `}</Code>

      <Endpoint method="GET" path="/api/public/balance/:id" auth="x402" description="Live withdrawable balance. Lighter than /stream/:id, use this when you only need the claimable amount." />
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
      <p><code>isActive</code> is <code>true</code> when <code>now &lt; streamValidUntil</code>.</p>

      <Endpoint method="GET" path="/api/public/streams/company/:address" auth="x402" description="All streams a company has opened across all supported chains, with live on-chain state." />
      <Code language="json">{`
{
  "address": "0x...",
  "count":   2,
  "streams": [
    {
      "streamId":           "0x...",
      "chainId":            421614,
      "recipient":          "0x...",
      "token":              "0x...",
      "ratePerSecond":      "1157407407407",
      "streamValidUntil":   "1748000000",
      "totalDeposited":     "2000000000",
      "totalWithdrawn":     "500000000",
      "balance":            "125000000",
      "isActive":           true,
      "verificationSource": "github",
      "verificationTarget": "owner/repo"
    }
  ]
}
      `}</Code>

      <Endpoint method="GET" path="/api/public/streams/contractor/:address" auth="x402" description="All streams a contractor is receiving. Includes totalClaimable, sum of withdrawable balance across all active streams." />
      <Code language="json">{`
{
  "address":        "0x...",
  "count":          1,
  "totalClaimable": "125000000",
  "streams": [ ... ]
}
      `}</Code>

      <Endpoint method="POST" path="/api/public/verify-milestone" auth="x402" description="Trigger milestone verification. Returns a signed EIP-712 extension voucher the company can submit on-chain if work is confirmed." />
      <h3>Request body</h3>
      <Code language="json">{`
{
  "streamId":           "0x...",
  "contractorAddress":  "0x...",
  "verificationSource": "github",
  "verificationTarget": "owner/repo"
}
      `}</Code>
      <div className="my-4 rounded-lg border border-border overflow-hidden">
        <table style={{ margin: 0 }}>
          <thead><tr><th>Field</th><th>Required</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>streamId</code></td><td>Yes</td><td>0x-prefixed bytes32 stream ID</td></tr>
            <tr><td><code>contractorAddress</code></td><td>Yes</td><td>Contractor wallet address</td></tr>
            <tr><td><code>verificationSource</code></td><td>No</td><td><code>github</code> | <code>jira</code> | <code>bitbucket</code> | <code>figma</code></td></tr>
            <tr><td><code>verificationTarget</code></td><td>No</td><td>Repo path or ticket key, defaults to stream's registered value</td></tr>
            <tr><td><code>githubPayload</code></td><td>No</td><td>Raw GitHub webhook event body</td></tr>
          </tbody>
        </table>
      </div>
      <h3>Success</h3>
      <Code language="json">{`
{
  "success": true,
  "nonce":   3,
  "voucher": {
    "streamId":                 "0x...",
    "extensionDurationSeconds": 604800,
    "expiry":                   1748100000,
    "signature":                "0x..."
  }
}
      `}</Code>
      <h3>Failure</h3>
      <Code language="json">{`{ "success": false, "error": "No qualifying PR found in the last 7 days" }`}</Code>

      {/* ── Developer API (v1) ───────────────────────────────────── */}
      <h2>Developer API</h2>
      <p>
        Authenticated endpoints for registered integrations. Pass your key as a bearer token:
      </p>
      <Code language="bash">Authorization: Bearer {'<your-api-key>'}</Code>

      <Endpoint method="GET" path="/api/v1/stream/:streamId/balance" auth="apikey" description="Live balance for a stream, includes earnedSnapshot and lastWindowStart for accounting integrations." />
      <Code language="bash">{`curl /api/v1/stream/0xSTREAM_ID \\
  -H "Authorization: Bearer <key>"`}</Code>
      <Code language="json">{`
{
  "streamId":        "0x...",
  "chainId":         421614,
  "balance":         "125000000",
  "earnedSnapshot":  "375000000",
  "lastWindowStart": "1747900000",
  "ratePerSecond":   "1157407407407",
  "isActive":        true
}
      `}</Code>
      <p>
        <code>earnedSnapshot</code> is the total earned at the last withdrawal. <code>lastWindowStart</code> marks when
        the current window opened, together they let you reconstruct full earnings history without querying the contract.
      </p>

      <Endpoint method="GET" path="/api/v1/streams/pending" auth="apikey" description="Returns all expired streams with unreclaimed funds or unpaid contractor balances. Query by wallet address." />
      <h3>Query parameters</h3>
      <div className="my-4 rounded-lg border border-border overflow-hidden">
        <table style={{ margin: 0 }}>
          <thead><tr><th>Param</th><th>Required</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>address</code></td><td>Yes</td><td>Company or contractor wallet address</td></tr>
          </tbody>
        </table>
      </div>
      <Code language="bash">{`curl "/api/v1/streams/pending?address=0xCOMPANY_ADDRESS" \\
  -H "Authorization: Bearer <key>"`}</Code>
      <Code language="json">{`
{
  "address": "0x...",
  "count":   1,
  "streams": [
    {
      "streamId":      "0x...",
      "chainId":       421614,
      "streamValidUntil": "1747000000",
      "reclaimable":   "1875000000",
      "contractorOwed": "125000000",
      "token":         "0x...",
      "recipient":     "0x..."
    }
  ]
}
      `}</Code>
      <p>
        <code>reclaimable</code> is the budget the company can recover via <code>reclaimUnearned()</code>.{' '}
        <code>contractorOwed</code> is the balance the contractor can still withdraw.
      </p>

      <Endpoint method="DELETE" path="/api/v1/stream/:streamId" auth="apikey" description="Remove a stream from the agent registry. Only the stream sender can call this. Does not affect on-chain state." />
      <Code language="bash">{`curl -X DELETE /api/v1/stream/0xSTREAM_ID \\
  -H "Authorization: Bearer <key>"`}</Code>
      <Code language="json">{`{ "success": true, "streamId": "0x..." }`}</Code>

      {/* ── Error codes ─────────────────────────────────────────── */}
      <h2>Error codes</h2>
      <div className="my-4 rounded-lg border border-border overflow-hidden">
        <table style={{ margin: 0 }}>
          <thead><tr><th>Status</th><th>Meaning</th></tr></thead>
          <tbody>
            <tr><td><code>400</code></td><td>Invalid stream ID or wallet address format</td></tr>
            <tr><td><code>401</code></td><td>Missing or invalid API key (Developer API only)</td></tr>
            <tr><td><code>402</code></td><td>Payment required, follow x402 flow (Public API only)</td></tr>
            <tr><td><code>403</code></td><td>Caller is not the stream sender</td></tr>
            <tr><td><code>404</code></td><td>Stream not found in registry or on-chain</td></tr>
            <tr><td><code>422</code></td><td>Milestone verification failed</td></tr>
            <tr><td><code>500</code></td><td>Internal error</td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
