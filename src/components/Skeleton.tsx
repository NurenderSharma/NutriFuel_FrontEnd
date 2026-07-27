export function Skeleton({ width, height, className }: { width?: string | number; height?: string | number; className?: string }) {
  const style = {
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  }
  return <span className={className ? `skeleton ${className}` : 'skeleton'} style={style} />
}

export function SkeletonRestaurantGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="restaurant-grid">
      {Array.from({ length: count }, (_, index) => (
        <div className="skeleton-restaurant-card" key={index}>
          <Skeleton />
          <div className="skeleton-card-body">
            <Skeleton height={16} width="70%" />
            <Skeleton height={11} width="90%" />
            <Skeleton height={11} width="40%" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonFoodGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="food-grid">
      {Array.from({ length: count }, (_, index) => (
        <div className="skeleton-food-card" key={index}>
          <Skeleton />
          <div className="skeleton-card-body">
            <Skeleton height={16} width="70%" />
            <Skeleton height={11} width="90%" />
            <Skeleton height={11} width="40%" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonTableRows({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <tr className="skeleton-table-row" key={rowIndex}>
          {Array.from({ length: columns }, (_, colIndex) => (
            <td key={colIndex}><Skeleton height={12} /></td>
          ))}
        </tr>
      ))}
    </>
  )
}
