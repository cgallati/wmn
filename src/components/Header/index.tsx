import { getCachedGlobal } from '@/utilities/getGlobals'

import './index.css'
import { HeaderClient } from './index.client'

type Props = {
  vertical?: boolean
}

export async function Header({ vertical = false }: Props) {
  const header = await getCachedGlobal('header', 1)()

  return <HeaderClient header={header} vertical={vertical} />
}
