
import React, { useState } from 'react'
import HeaderBar from './components/HeaderBar.tsx'
import HistoryContainer from './components/historyContainer.tsx'

function App() {

  const [matchStats, setMatchStats] = useState<any>([])

  return (
    <>
      <HeaderBar matchStats={matchStats} setMatchStats={setMatchStats}/>
      
      <HistoryContainer matchStats={matchStats}/>
    </>
  )
}

export default App
