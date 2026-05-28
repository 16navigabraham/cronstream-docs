import Code from '../components/Code.jsx';

function MethodBadge({ method }) {
  const colors = {
    GET:  'text-[#7FDED2] border-[#7FDED2]/30',
    POST: 'text-[#C3B1E1] border-[#C3B1E1]/30',
  };
  return (
    <span className={`inline-flex font-mono font-semibold text-[11px] px-2 py-0.5 rounded border bg-surface ${colors[method] ?? 'text-muted-fg border-border'}`}>
      {method}
    </span>
  );
}

function Endpoint({ method, path, price, description, children }) {
  return (
    <div className="mt-10 pt-8 border-t border-border first:border-t-0 first:mt-0 first:pt-0">
      <div className="flex items-center gap-2.5 mb-1 flex-wrap">
        <MethodBadge method={method} />
        <code className="text-[#E8F5EC] text-sm">{path}</code>
        {price && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
            {price}
          </span>
        )}
        {!price && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface text-muted border border-border">
            free
          </span>
        )}
      </div>
      <p className="text-muted-fg text-sm mb-4">{description}</p>
      {children}
    </div>
  );
}

export default function PublicApi() {
  return (
    <>
      <h1>Public API</h1>
      <p>
        Open to any wallet, developer, or AI agent, no account required.
        Paid endpoints use the <strong>x402 protocol</strong>: the server returns HTTP 402 with payment
        instructions, your client pays per-request in USDC on Base, then retries.
        See the <strong>x402 Protocol</strong> page for the full payment flow and SDK examples.
      </p>

      <div className="my-5 rounded-lg border border-border overflow-hidden">
        <table style={{ margin: 0 }}>
          <thead><tr><th>Endpoint</th><th>Price</th></tr></thead>
          <tbody>
            <tr><td><code>GET /api/public/info</code></td><td>Free</td></tr>
            <tr><td><code>GET /api/public/stream/:id</code></td><td>$0.01 USDC</td></tr>
            <tr><td><code>GET /api/public/balance/:id</code></td><td>$0.01 USDC</td></tr>
            <tr><td><code>GET /api/public/streams/company/:address</code></td><td>$0.05 USDC</td></tr>
            <tr><td><code>GET /api/public/streams/contractor/:address</code></td><td>$0.05 USDC</td></tr>
            <tr><td><code>POST /api/public/verify-milestone</code></td><td>$0.10 USDC</td></tr>
          </tbody>
        </table>
      </div>

      {/* ── GET /api/public/info ─────────────────────────────── */}
      <Endpoint method="GET" path="/api/public/info" description="Returns API metadata, current pricing, and the pay-to address. Always call this first to get the live pay-to address before making paid requests.">
        <Code language="json">{`
{
  "name":     "CronStream Public API",
  "version":  "2.0.0",
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
      </Endpoint>

      {/* ── GET /api/public/stream/:id ───────────────────────── */}
      <Endpoint method="GET" path="/api/public/stream/:id" price="$0.01" description="Full stream state, registry metadata combined with live on-chain data.">
        <h3>Path parameters</h3>
        <div className="my-3 rounded-lg border border-border overflow-hidden">
          <table style={{ margin: 0 }}>
            <thead><tr><th>Param</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>id</code></td><td>0x-prefixed bytes32 stream ID</td></tr>
            </tbody>
          </table>
        </div>
        <h3>Response</h3>
        <Code language="json">{`
{
  "streamId":           "0x...",
  "chainId":            421614,
  "sender":             "0x...",
  "recipient":          "0x...",
  "token":              "0x...",
  "ratePerSecond":      "1157407407407",
  "streamValidUntil":   "1748000000",
  "totalDeposited":     "2000000000",
  "totalWithdrawn":     "500000000",
  "balance":            "125000000",
  "nonce":              "3",
  "verificationSource": "github",
  "verificationTarget": "owner/repo",
  "createdAt":          1747000000
}
        `}</Code>
      </Endpoint>

      {/* ── GET /api/public/balance/:id ──────────────────────── */}
      <Endpoint method="GET" path="/api/public/balance/:id" price="$0.01" description="Live withdrawable balance for a stream. Lighter than /stream/:id, use this when you only need the claimable amount.">
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
        <p><code>isActive</code> is <code>true</code> when <code>block.timestamp &lt; streamValidUntil</code>.</p>
      </Endpoint>

      {/* ── GET /api/public/streams/company/:address ─────────── */}
      <Endpoint method="GET" path="/api/public/streams/company/:address" price="$0.05" description="All streams opened by a company across all supported chains, with live on-chain state for each.">
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
      </Endpoint>

      {/* ── GET /api/public/streams/contractor/:address ──────── */}
      <Endpoint method="GET" path="/api/public/streams/contractor/:address" price="$0.05" description="All streams a contractor is receiving. Includes totalClaimable, the sum of withdrawable balance across all active streams.">
        <Code language="json">{`
{
  "address":        "0x...",
  "count":          2,
  "totalClaimable": "250000000",
  "streams": [ ... ]
}
        `}</Code>
      </Endpoint>

      {/* ── POST /api/public/verify-milestone ────────────────── */}
      <Endpoint method="POST" path="/api/public/verify-milestone" price="$0.10" description="Trigger milestone verification against the stream's registered source (GitHub, Jira, Bitbucket, Figma). Returns a signed EIP-712 extension voucher the company submits on-chain to extend the stream window.">
        <h3>Request body</h3>
        <Code language="json">{`
{
  "streamId":           "0x...",
  "contractorAddress":  "0x...",
  "verificationSource": "github",
  "verificationTarget": "owner/repo"
}
        `}</Code>
        <div className="my-3 rounded-lg border border-border overflow-hidden">
          <table style={{ margin: 0 }}>
            <thead><tr><th>Field</th><th>Required</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>streamId</code></td><td>Yes</td><td>0x-prefixed bytes32 stream ID</td></tr>
              <tr><td><code>contractorAddress</code></td><td>Yes</td><td>Contractor wallet address</td></tr>
              <tr><td><code>verificationSource</code></td><td>No</td><td><code>github</code> | <code>jira</code> | <code>bitbucket</code> | <code>figma</code>, defaults to stream's registered value</td></tr>
              <tr><td><code>verificationTarget</code></td><td>No</td><td>Repo path, ticket key, or URL, defaults to stream's registered value</td></tr>
              <tr><td><code>githubPayload</code></td><td>No</td><td>Raw GitHub webhook event body, if forwarding a webhook</td></tr>
            </tbody>
          </table>
        </div>
        <h3>Success response</h3>
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
        <p>
          The <code>signature</code> is an EIP-712 signature over{' '}
          <code>ExtensionVoucher(streamId, extensionDurationSeconds, nonce, expiry)</code>.
          Pass the full <code>voucher</code> object to <code>extendStream()</code> on the contract.
        </p>
        <h3>Failure response</h3>
        <Code language="json">{`{ "success": false, "error": "No qualifying PR found in the last 7 days" }`}</Code>
      </Endpoint>

      {/* ── Errors ───────────────────────────────────────────── */}
      <h2>Error codes</h2>
      <div className="my-4 rounded-lg border border-border overflow-hidden">
        <table style={{ margin: 0 }}>
          <thead><tr><th>Status</th><th>Meaning</th></tr></thead>
          <tbody>
            <tr><td><code>400</code></td><td>Invalid stream ID or wallet address format</td></tr>
            <tr><td><code>402</code></td><td>Payment required, follow the x402 flow</td></tr>
            <tr><td><code>404</code></td><td>Stream not found in registry or on-chain</td></tr>
            <tr><td><code>422</code></td><td>Milestone verification failed, no qualifying deliverable found</td></tr>
            <tr><td><code>500</code></td><td>Internal error</td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
