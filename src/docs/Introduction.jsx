import Code from '../components/Code.jsx';

export default function Introduction() {
  return (
    <>
      <div className="mb-8 pb-8 border-b border-border">
        <h1>CronStream Developer Docs</h1>
        <p className="text-lg text-muted-fg leading-relaxed mt-3 mb-0">
          CronStream is an autonomous, milestone-gated B2B token streaming protocol.
          Money flows to contractors only after an off-chain agent verifies real work -
          a merged pull request, a closed Jira ticket, an approved Figma design.
        </p>
      </div>

      <blockquote>
        <p>
          Direct contract integration is not yet open to external developers.
          Everything in these docs works today against our deployed contracts on Arbitrum Sepolia and Robinhood Chain.
        </p>
      </blockquote>

      <h2>What you can do right now</h2>
      <p>
        The public API is open to any developer or AI agent, no account needed.
        Paid endpoints use the <strong>x402 pay-per-call</strong> protocol (USDC on Base, per request).
      </p>

      <div className="my-5 rounded-lg border border-border overflow-hidden">
        <table style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Price</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><code>GET /api/public/info</code></td><td>Free</td><td>Pricing + usage instructions</td></tr>
            <tr><td><code>GET /api/public/stream/:id</code></td><td>$0.01</td><td>Stream state + live balance</td></tr>
            <tr><td><code>GET /api/public/balance/:id</code></td><td>$0.01</td><td>Withdrawable balance</td></tr>
            <tr><td><code>GET /api/public/streams/company/:address</code></td><td>$0.05</td><td>All streams opened by a company</td></tr>
            <tr><td><code>GET /api/public/streams/contractor/:address</code></td><td>$0.05</td><td>All streams a contractor receives</td></tr>
            <tr><td><code>POST /api/public/verify-milestone</code></td><td>$0.10</td><td>Verify work + get signed extension voucher</td></tr>
          </tbody>
        </table>
      </div>

      <p>Hit the free info endpoint first to get live pricing and the current pay-to address:</p>
      <Code language="bash">curl /api/public/info</Code>

      <h2>Deployed contracts</h2>
      <div className="my-5 rounded-lg border border-border overflow-hidden">
        <table style={{ margin: 0 }}>
          <thead><tr><th>Network</th><th>Chain ID</th><th>Contract</th></tr></thead>
          <tbody>
            <tr><td>Arbitrum Sepolia</td><td><code>421614</code></td><td><code>0x5A141097BAF8D88f665217817A1f89e1663f0C16</code></td></tr>
            <tr><td>Robinhood Chain</td><td><code>46630</code></td><td><code>0x12B1c71A60CBC3Fdd44D3D974546D2751feC04eD</code></td></tr>
          </tbody>
        </table>
      </div>

      <h2>Quick start</h2>
      <Code language="bash">npm install x402-fetch viem</Code>
      <Code language="js">{`
import { wrapFetchWithPayment } from 'x402-fetch';
import { privateKeyToAccount } from 'viem/accounts';

const account  = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY);
const fetch402 = wrapFetchWithPayment(fetch, { account });

// $0.01 USDC, paid and retried automatically
const res  = await fetch402('/api/public/balance/0xYOUR_STREAM_ID');
const data = await res.json();

console.log(data.balance);   // withdrawable amount (raw units)
console.log(data.isActive);  // true if stream window is open
      `}</Code>
    </>
  );
}
