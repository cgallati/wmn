import { getShopStatus } from '@/utilities/shopStatus'

/**
 * GET /shop/status → { open }. The cart in the site rail asks this so it can stay hidden
 * while the shop is dark. Cached briefly at the edge; the shop pages themselves check on
 * every request.
 */
export async function GET() {
  const { open } = await getShopStatus()
  return Response.json(
    { open },
    { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' } },
  )
}
