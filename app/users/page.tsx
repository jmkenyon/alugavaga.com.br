import React from 'react'
import EmptyStateMessenger from './components/EmptyStateMessenger'

function page() {
  return (
    <div className='hidden lg:block lg:pl-80 h-full
'>
        <EmptyStateMessenger/>
    </div>
  )
}

export default page