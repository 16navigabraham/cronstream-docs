export default function HowItWorks() {
  return (
    <>
      <h1>How It Works</h1>
      <p>The full stream lifecycle, from creation to contractor withdrawal.</p>

      <h2>Stream lifecycle</h2>

      <div className="my-5 rounded-lg border border-border overflow-hidden divide-y divide-border">
        {[
          { n: '01', title: 'Company deposits budget',        desc: 'Full engagement budget locked upfront. Stream opens LOCKED, contractor earns $0.00.' },
          { n: '02', title: 'Contractor completes work',      desc: 'Ships code, closes a ticket, or delivers a design in whichever tool the stream is configured against.' },
          { n: '03', title: 'Agent verifies (3-layer check)', desc: 'Real code diff in /src · PR merged by senior engineer · CI/CD passed. All three must pass.' },
          { n: '04', title: 'Agent signs EIP-712 voucher',    desc: 'Off-chain cryptographic signature with nonce + expiry, replay-proof and time-bounded.' },
          { n: '05', title: 'Stream window opens',            desc: 'Contractor earns per second for the verified period. Balance accrues in real time.' },
          { n: '06', title: 'Next period, stream re-locks',  desc: 'Each period requires a new verification. No continuous free flow.' },
        ].map(({ n, title, desc }) => (
          <div key={n} className="flex gap-4 px-5 py-4 bg-surface">
            <span className="text-xs font-mono text-muted mt-0.5 flex-shrink-0 w-6">{n}</span>
            <div>
              <div className="text-sm font-semibold text-[#E8F5EC] mb-0.5">{title}</div>
              <div className="text-sm text-muted-fg">{desc}</div>
            </div>
          </div>
        ))}
      </div>

      <blockquote>
        <p>
          No work verified? The agent stops signing. The stream expires at its window boundary.
          Company reclaims every unearned token. No dispute, no gas, no manual cancel.
        </p>
      </blockquote>

      <h2>Key concepts</h2>

      <h3>Stream ID</h3>
      <p>
        Every stream is a <code>bytes32</code> identifier, a 0x-prefixed 64-character hex string.
        Emitted in the <code>StreamCreated</code> event on creation. Use it as the primary key for all API calls.
      </p>

      <h3>Locked-start model</h3>
      <p>
        A stream is born expired, <code>streamValidUntil = startTime</code> on creation.
        The contractor earns nothing until the agent verifies the first period and submits a signed voucher on-chain.
        The tap is off by default.
      </p>

      <h3>Extension voucher</h3>
      <p>An EIP-712 signed message produced by the agent after verification passes.</p>
      <div className="my-4 rounded-lg border border-border overflow-hidden">
        <table style={{ margin: 0 }}>
          <thead><tr><th>Field</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>streamId</code></td><td>Which stream to extend</td></tr>
            <tr><td><code>extensionDurationSeconds</code></td><td>How long to open the window (e.g. 604800 = 7 days)</td></tr>
            <tr><td><code>nonce</code></td><td>On-chain nonce, prevents replay attacks</td></tr>
            <tr><td><code>expiry</code></td><td>Unix timestamp, voucher is void after this</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Gap time protection</h3>
      <p>
        Dead time between a window expiry and the next re-extension is never counted as earned.
        The contract tracks <code>earnedSnapshot</code> and <code>lastWindowStart</code> to enforce this.
      </p>

      <h3>Verification sources</h3>
      <div className="my-4 rounded-lg border border-border overflow-hidden">
        <table style={{ margin: 0 }}>
          <thead><tr><th>Source</th><th>What the agent checks</th></tr></thead>
          <tbody>
            <tr><td><code>github</code></td><td>Real code diff in <code>/src</code> or <code>/contracts</code>, PR merged, CI/CD passed</td></tr>
            <tr><td><code>jira</code></td><td>Ticket moved to Done in the correct sprint</td></tr>
            <tr><td><code>bitbucket</code></td><td>PR merged with passing pipelines</td></tr>
            <tr><td><code>figma</code></td><td>File updated and approved</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Budget reclaim</h3>
      <p>
        After a stream window expires, the company can call <code>reclaimUnearned()</code> to recover all
        tokens that have not been earned. Earned-but-not-withdrawn tokens remain available to the contractor.
        The contract enforces this split mathematically.
      </p>

      <h3>Grace periods</h3>
      <p>
        Companies cannot reclaim immediately after a stream expires. A grace period gives the contractor
        time to withdraw earned funds before the company can claw back unearned tokens.
      </p>
      <div className="my-4 rounded-lg border border-border overflow-hidden">
        <table style={{ margin: 0 }}>
          <thead><tr><th>Scenario</th><th>Grace period</th><th>Clock starts</th></tr></thead>
          <tbody>
            <tr><td>Frozen stream (was active, window lapsed)</td><td>7 days</td><td><code>streamValidUntil</code></td></tr>
            <tr><td>Pending stream (never activated)</td><td>14 days</td><td><code>startTime</code></td></tr>
          </tbody>
        </table>
      </div>

      <h3>Stream ID routing</h3>
      <p>
        Contractors embed their stream ID in commit messages or PR descriptions to route the GitHub
        webhook directly to their stream. This is required when a repo has multiple active streams
        (e.g. two contractors working on the same repository).
      </p>
      <p>Format: one or more lines of:</p>
      <pre><code>CronStream-Stream-Id: 0x&lt;64-hex-chars&gt;</code></pre>
      <p>
        Multiple IDs in a single commit message are all processed. The agent verifies and extends each
        matching stream independently.
      </p>
    </>
  );
}
