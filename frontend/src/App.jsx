import React from 'react'
import { DonationPage, DonationRecords } from './components'

function App() {
  return (
    <div className='bg-black h-screen'>
      <div className='flex flex-col items-center justify-center'>
        <h1 className="mt-4 text-5xl text-emerald-400 font-black">
          Donation Page
        </h1>
        <div className='bg-black'>
          <DonationPage />
          <div className='mt-32'>
            <DonationRecords />
          </div>
        </div>
       
       
    </div>

    </div>
    
  )
}

export default App
