import Code from '../components/Code.jsx';

export default function Schemas() {
  return (
    <>
      <h1>Response Schemas</h1>
      <p>
        All numeric token amounts are returned as <strong>decimal strings</strong>, BigInt-safe for all clients.
        Divide by the token's decimals to get a human-readable value.
      </p>

      <h2>Stream object</h2>
      <div className="my-4 rounded-lg border border-border overflow-hidden">
        <table style={{ margin: 0 }}>
          <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>streamId</code></td><td>string</td><td><code>bytes32</code>, 0x-prefixed 64 hex chars</td></tr>
            <tr><td><code>chainId</code></td><td>number</td><td><code>421614</code> or <code>46630</code></td></tr>
            <tr><td><code>sender</code></td><td>string</td><td>Company wallet that created and funded the stream</td></tr>
            <tr><td><code>recipient</code></td><td>string</td><td>Contractor wallet receiving payment</td></tr>
            <tr><td><code>token</code></td><td>string</td><td>ERC-20 token contract address</td></tr>
            <tr><td><code>ratePerSecond</code></td><td>string</td><td>Token units earned per second (raw)</td></tr>
            <tr><td><code>startTime</code></td><td>string</td><td>Unix timestamp of stream creation</td></tr>
            <tr><td><code>streamValidUntil</code></td><td>string</td><td>Unix timestamp of current window expiry</td></tr>
            <tr><td><code>totalDeposited</code></td><td>string</td><td>Total tokens deposited by the company</td></tr>
            <tr><td><code>totalWithdrawn</code></td><td>string</td><td>Total tokens already withdrawn by the contractor</td></tr>
            <tr><td><code>nonce</code></td><td>string</td><td>On-chain nonce, increments on each extension</td></tr>
            <tr><td><code>balance</code></td><td>string</td><td>Currently withdrawable amount</td></tr>
            <tr><td><code>earnedSnapshot</code></td><td>string</td><td>Cumulative earnings at the start of the current window</td></tr>
            <tr><td><code>lastWindowStart</code></td><td>string</td><td>Timestamp of the most recent extension</td></tr>
            <tr><td><code>isActive</code></td><td>boolean</td><td><code>true</code> when <code>now &lt; streamValidUntil</code></td></tr>
            <tr><td><code>verificationSource</code></td><td>string</td><td><code>github</code> | <code>jira</code> | <code>bitbucket</code> | <code>figma</code></td></tr>
            <tr><td><code>verificationTarget</code></td><td>string</td><td>Repo path, Jira project key, or Figma file URL</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Voucher object</h2>
      <p>Returned by <code>POST /api/public/verify-milestone</code> on success.</p>
      <div className="my-4 rounded-lg border border-border overflow-hidden">
        <table style={{ margin: 0 }}>
          <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>streamId</code></td><td>string</td><td><code>bytes32</code> identifier</td></tr>
            <tr><td><code>extensionDurationSeconds</code></td><td>number</td><td>Seconds the window will be extended</td></tr>
            <tr><td><code>expiry</code></td><td>number</td><td>Unix timestamp, voucher is void after this</td></tr>
            <tr><td><code>signature</code></td><td>string</td><td>65-byte EIP-712 signature from the agent key</td></tr>
          </tbody>
        </table>
      </div>

      <p>Submit on-chain via:</p>
      <Code language="solidity">{`
CronStreamRouter.extendStreamWindowWithSignature(
  bytes32 streamId,
  uint256 extensionDurationSeconds,
  uint256 expiry,
  bytes calldata signature
)
      `}</Code>

      <h2>Token decimals</h2>
      <div className="my-4 rounded-lg border border-border overflow-hidden">
        <table style={{ margin: 0 }}>
          <thead><tr><th>Token</th><th>Decimals</th><th>1 whole token</th></tr></thead>
          <tbody>
            <tr><td>USDC</td><td>6</td><td><code>1000000</code></td></tr>
            <tr><td>USDT</td><td>6</td><td><code>1000000</code></td></tr>
            <tr><td>Robinhood stock tokens</td><td>18</td><td><code>1000000000000000000</code></td></tr>
          </tbody>
        </table>
      </div>

      <h3>Converting ratePerSecond</h3>
      <Code language="js">{`
// USDC, 6 decimals
const ratePerSecond = BigInt("1157407407407");
const usdcPerDay    = Number(ratePerSecond) / 1e6 * 86400;  // → 100 USDC/day
      `}</Code>

      <h2>Chain IDs</h2>
      <div className="my-4 rounded-lg border border-border overflow-hidden">
        <table style={{ margin: 0 }}>
          <thead><tr><th>Network</th><th>Chain ID</th><th>Contract</th></tr></thead>
          <tbody>
            <tr><td>Arbitrum Sepolia</td><td><code>421614</code></td><td><code>0x5A141097BAF8D88f665217817A1f89e1663f0C16</code></td></tr>
            <tr><td>Robinhood Chain (testnet)</td><td><code>46630</code></td><td><code>0x12B1c71A60CBC3Fdd44D3D974546D2751feC04eD</code></td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
