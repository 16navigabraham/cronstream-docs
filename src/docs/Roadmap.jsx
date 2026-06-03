export default function Roadmap() {
  return (
    <>
      <h1>Roadmap</h1>
      <p>
        CronStream is live on Arbitrum Sepolia and Robinhood Chain with GitHub verification,
        multi-source milestone gating, and the x402 public API. This roadmap reflects where the
        protocol goes next — ordered by the problems it solves, not by features.
      </p>

      <h2>Robinhood Chain — Stock Token payroll</h2>
      <p>
        Robinhood Chain natively issues tokenized stock tokens — AAPL, TSLA, GOOGL — as ERC-20s.
        CronStream streams any ERC-20. The combination creates a compensation primitive that has
        never existed before.
      </p>
      <blockquote>
        <p>
          A startup streams 2 AAPL tokens per day to a contractor as they ship code.
          Real time. Milestone-gated. If they stop delivering, the company reclaims
          the unearned stock instantly. No equity paperwork. No cliff. No trust required.
        </p>
      </blockquote>
      <p>Planned work on this track:</p>
      <ul>
        <li>Robinhood Chain mainnet deployment alongside Arbitrum One</li>
        <li>Stock token display — show AAPL/TSLA/GOOGL with price context in stream dashboards</li>
        <li>Stock token payroll statements — PDF exports that reference the underlying equity value at time of payment</li>
        <li>Multi-token streams — contractor receives USDC + stock tokens in a single stream</li>
      </ul>
      <p>
        No other streaming protocol is building on Robinhood Chain. This is the only place where
        milestone-gated equity compensation exists on-chain.
      </p>

      <h2>Compliance and audit tooling</h2>
      <p>
        Global regulators are moving hard into Web3 corporate accounting. IRS 1099-DA in the US
        requires proof of why money moved, not just that it moved. MiCA in Europe creates compliance
        exposure for corporate treasuries running unconditional streams.
      </p>
      <p>
        Every dollar CronStream unlocks is already tied to a cryptographic on-chain event. The next
        step is making that audit trail readable by accountants, legal teams, and regulators.
      </p>
      <ul>
        <li>
          <strong>Structured audit export</strong> — every extension voucher, verification result, and
          tx hash in a signed, timestamped PDF with on-chain proof links
        </li>
        <li>
          <strong>Sanctions screening</strong> — stream auto-freezes if contractor address appears on
          an OFAC update. No human intervention, no delayed reaction
        </li>
        <li>
          <strong>1099-DA compatible records</strong> — US-compliant payment records mapping each
          payment to the verified deliverable that triggered it
        </li>
        <li>
          <strong>MiCA-aligned fields</strong> — jurisdiction, legal entity identifiers, and purpose
          codes on stream creation for EU corporate treasuries
        </li>
      </ul>
      <p>
        The period statement PDF available today is the first step. Structured compliance exports
        with cryptographic proof are the destination.
      </p>

      <h2>Verification depth</h2>
      <p>
        GitHub verification runs a 3-layer gate. The other sources have different trust profiles
        by design — a company choosing Jira accepts a softer gate than GitHub. This will be
        documented as a first-class trust level on stream creation.
      </p>
      <div className="my-5 rounded-lg border border-border overflow-hidden">
        <table style={{ margin: 0 }}>
          <thead>
            <tr><th>Source</th><th>Current gate</th><th>Planned</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>github</code></td>
              <td>3-layer: code diff + merged PR + CI pass</td>
              <td>Stable</td>
            </tr>
            <tr>
              <td><code>jira</code></td>
              <td>Ticket moved to Done in correct sprint</td>
              <td>Story points threshold + sprint velocity check</td>
            </tr>
            <tr>
              <td><code>bitbucket</code></td>
              <td>PR merged with passing pipelines</td>
              <td>Diff quality check matching GitHub gate</td>
            </tr>
            <tr>
              <td><code>figma</code></td>
              <td>FILE_COMMENT event with approval keyword (approved, LGTM, ✅)</td>
              <td>Frame diff detection + approval status</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Mainnet deployment</h2>
      <p>
        Both contracts are live on testnets. Mainnet targets post-hackathon:
      </p>
      <ul>
        <li>Arbitrum One (chain ID 42161) — primary EVM target</li>
        <li>Robinhood Chain mainnet — stock token payroll</li>
        <li>Base — aligns with x402 payment settlement on Base</li>
      </ul>

      <h2>x402 API — building on CronStream</h2>
      <p>
        The public API uses the x402 pay-per-call protocol. Any developer, company, or AI agent
        can query stream state and trigger verification programmatically — no account, no API key.
        Rate limiting is enforced per payer wallet address (60 calls/minute by default) — abuse
        costs the attacker real USDC, not just compute.
      </p>
      <p>
        The roadmap for this track is about what gets built on top of CronStream, not inside it.
        CronStream is the compliance and performance layer. Other products build the product layer
        on top:
      </p>
      <ul>
        <li>HR platforms embedding milestone-gated payroll without building smart contracts</li>
        <li>AI agents autonomously managing contractor streams based on project status</li>
        <li>DAO tooling that ties treasury disbursements to on-chain governance outcomes</li>
        <li>Accounting software pulling verified payment records directly via the x402 API</li>
      </ul>

      <h2>What is live today</h2>
      <div className="my-5 rounded-lg border border-border overflow-hidden">
        <table style={{ margin: 0 }}>
          <thead><tr><th>Feature</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>GitHub milestone verification (3-layer)</td><td>Live</td></tr>
            <tr><td>Jira / Bitbucket / Figma verification</td><td>Live</td></tr>
            <tr><td>Webhook-driven event verification</td><td>Live</td></tr>
            <tr><td>Robinhood Chain deployment</td><td>Live (testnet)</td></tr>
            <tr><td>Arbitrum Sepolia deployment</td><td>Live (testnet)</td></tr>
            <tr><td>x402 public API</td><td>Live</td></tr>
            <tr><td>Period statement PDF export</td><td>Live</td></tr>
            <tr><td>CRM token and faucet</td><td>Live on Arbitrum Sepolia</td></tr>
            <tr><td>Stock token payroll (AAPL, TSLA)</td><td>Live on Robinhood Testnet</td></tr>
            <tr><td>Sanctions screening</td><td>Roadmap</td></tr>
            <tr><td>Mainnet deployment</td><td>Roadmap</td></tr>
            <tr><td>1099-DA compliant exports</td><td>Roadmap</td></tr>
          </tbody>
        </table>
      </div>

      <p>
        Questions or partnership inquiries:{' '}
        <a href="mailto:thecronstream@gmail.com">thecronstream@gmail.com</a>
      </p>
    </>
  );
}
