import React from 'react'

import { RichText } from '@/components/RichText'

// Hero sections have been removed - this component is kept for backward compatibility
export const LowImpactHero: React.FC<any> = ({ children, richText }) => {
  return (
    <div className="container mt-16">
      <div className="max-w-[48rem]">
        {children || (richText && <RichText data={richText} enableGutter={false} />)}
      </div>
    </div>
  )
}
