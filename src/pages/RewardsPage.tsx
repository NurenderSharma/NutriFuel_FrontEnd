import { useEffect, useState } from 'react'
import { Skeleton } from '../components/Skeleton'
import { ApiError, apiClient } from '../lib/apiClient'
import { useRewardsStore } from '../store/rewardsStore'

interface RedeemResult {
  reward: { id: string; name: string }
  redemptionCode: string
  balance: number
}

export function RewardsPage() {
  const summary = useRewardsStore((state) => state.summary)
  const fetchSummary = useRewardsStore((state) => state.fetchSummary)
  const [redeemMessage, setRedeemMessage] = useState<string | null>(null)
  const [redeemError, setRedeemError] = useState<string | null>(null)

  useEffect(() => {
    void fetchSummary()
  }, [fetchSummary])

  const handleRedeem = async (rewardId: string) => {
    setRedeemError(null)
    setRedeemMessage(null)
    try {
      const result = await apiClient.post<RedeemResult>('/rewards/redeem', { rewardId })
      setRedeemMessage(`Redeemed ${result.reward.name} — code ${result.redemptionCode}`)
      void fetchSummary()
    } catch (err) {
      setRedeemError(err instanceof ApiError ? err.message : 'Could not redeem this reward.')
    }
  }

  if (!summary) {
    return (
      <main className="browse-main">
        <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
          <Skeleton height={12} width="25%" />
          <Skeleton height={38} width="55%" />
          <Skeleton height={10} />
        </div>
        <div className="reward-catalog">
          {Array.from({ length: 3 }, (_, index) => <Skeleton height={140} key={index} />)}
        </div>
      </main>
    )
  }

  return (
    <main className="browse-main">
      <div className="browse-heading">
        <div className="section-kicker">Rewards</div>
        <h1>{summary.points.toLocaleString('en-IN')} Fuel points</h1>
        <p>
          {summary.tier[0]?.toUpperCase()}{summary.tier.slice(1)} tier
          {summary.nextTier ? ` · ${summary.pointsToNextTier} points to ${summary.nextTier}` : ' · Top tier reached'}
        </p>
      </div>

      <div className="tier-progress-track" aria-label={`${summary.progressPercent}% to next tier`}>
        <span style={{ width: `${summary.progressPercent}%`, display: 'block', height: '100%', background: 'var(--green)', borderRadius: 'inherit' }} />
      </div>

      <h2>Redeem points</h2>
      {redeemMessage && <p className="auth-subtitle">{redeemMessage}</p>}
      {redeemError && <p className="form-error">{redeemError}</p>}
      <div className="reward-catalog">
        {summary.rewards.map((reward) => (
          <div className="reward-catalog-card" key={reward.id}>
            <b>{reward.name}</b>
            <span>{reward.cost} points</span>
            <button className="primary-button bright" disabled={!reward.unlocked} onClick={() => handleRedeem(reward.id)}>
              {reward.unlocked ? 'Redeem' : 'Locked'}
            </button>
          </div>
        ))}
      </div>

      <h2>History</h2>
      <table className="data-table">
        <thead><tr><th>Date</th><th>Type</th><th>Reason</th><th>Points</th><th>Balance</th></tr></thead>
        <tbody>
          {summary.ledger.map((entry) => (
            <tr key={entry.id}>
              <td>{new Date(entry.createdAt).toLocaleDateString()}</td>
              <td>{entry.type}</td>
              <td>{entry.reason.replace(/-/g, ' ')}</td>
              <td>{entry.type === 'earn' ? '+' : '-'}{entry.points}</td>
              <td>{entry.balanceAfter}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
