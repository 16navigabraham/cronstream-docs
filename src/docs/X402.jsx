import Code from '../components/Code.jsx';

export default function X402() {
  return (
    <>
      <h1>x402 Payment Protocol</h1>
      <p>
        CronStream's public API uses <a href="https://x402.org" target="_blank" rel="noopener noreferrer">x402</a> -
        an open HTTP payment standard built for AI agents and automated clients.
        Pay per request in USDC on Base. No account. No API key.
      </p>

      <h2>How it works</h2>
      <div className="my-5 rounded-lg border border-border divide-y divide-border overflow-hidden">
        {[
          { n: 1, title: 'Call the endpoint',           desc: 'Make a normal HTTP request with no payment header.' },
          { n: 2, title: 'Receive HTTP 402',            desc: 'The server responds with payment instructions, price, pay-to address, token, network.' },
          { n: 3, title: 'Pay on-chain',                desc: 'Send the exact USDC amount to the pay-to address on Base (or Base Sepolia for testing).' },
          { n: 4, title: 'Retry with X-PAYMENT header', desc: 'Include the on-chain payment proof as a base64-encoded header and retry.' },
          { n: 5, title: 'Receive the response',        desc: 'The server verifies the proof and returns data. x402 SDKs handle steps 2–4 automatically.' },
        ].map(({ n, title, desc }) => (
          <div key={n} className="flex gap-4 px-5 py-4 bg-surface">
            <span className="text-xs font-mono text-muted mt-0.5 flex-shrink-0">{n}</span>
            <div>
              <div className="text-sm font-semibold text-[#E8F5EC] mb-0.5">{title}</div>
              <div className="text-sm text-muted-fg">{desc}</div>
            </div>
          </div>
        ))}
      </div>

      <h2>Pricing</h2>
      <div className="my-5 rounded-lg border border-border overflow-hidden">
        <table style={{ margin: 0 }}>
          <thead><tr><th>Endpoint</th><th>Price</th></tr></thead>
          <tbody>
            <tr><td><code>GET /api/public/info</code></td><td>Free</td></tr>
            <tr><td><code>POST /api/public/verify-milestone</code></td><td>$0.10 USDC</td></tr>
            <tr><td><code>GET /api/public/stream/:id</code></td><td>$0.01 USDC</td></tr>
            <tr><td><code>GET /api/public/balance/:id</code></td><td>$0.01 USDC</td></tr>
            <tr><td><code>GET /api/public/streams/company/:address</code></td><td>$0.05 USDC</td></tr>
            <tr><td><code>GET /api/public/streams/contractor/:address</code></td><td>$0.05 USDC</td></tr>
          </tbody>
        </table>
      </div>
      <p>Payments go directly to the CronStream agent's signing wallet. No intermediary.</p>

      <h2>curl example</h2>
      <Code language="bash">{`
# Without payment header, receive 402
curl https://api.cronstream.xyz/api/public/stream/0xYOUR_STREAM_ID

# 402 response
{
  "x402Version": 1,
  "accepts": [{
    "scheme":             "exact",
    "network":            "base-sepolia",
    "maxAmountRequired":  "10000",
    "payTo":              "0x...",
    "asset":              "0x..."
  }]
}

# Retry with payment proof
curl https://api.cronstream.xyz/api/public/stream/0xYOUR_STREAM_ID \\
  -H "X-PAYMENT: <base64-encoded-proof>"
      `}</Code>

      <h2>TypeScript / JavaScript</h2>
      <Code language="bash">npm install x402-fetch viem</Code>
      <Code language="ts">{`
import { wrapFetchWithPayment } from 'x402-fetch';
import { privateKeyToAccount } from 'viem/accounts';

const account  = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY);
const fetch402 = wrapFetchWithPayment(fetch, { account });

// 402 → pay → retry handled automatically
const res  = await fetch402('https://api.cronstream.xyz/api/public/balance/0xSTREAM_ID');
const data = await res.json();

console.log(data.balance);   // raw units
console.log(data.isActive);  // boolean
      `}</Code>

      <h2>Python</h2>
      <Code language="python">{`
import requests

# Step 1, get payment instructions
r = requests.get("https://api.cronstream.xyz/api/public/stream/0xSTREAM_ID")
if r.status_code == 402:
    instructions = r.json()
    # Pay on-chain, build the X-PAYMENT proof header
    # See x402.org for the full proof encoding spec
      `}</Code>

      <blockquote>
        <p>
          <strong>Testing:</strong> Use Base Sepolia USDC during development.
          Call <code>GET /api/public/info</code> to confirm which network is active.
        </p>
      </blockquote>
    </>
  );
}
