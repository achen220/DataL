import { ChangeEvent, useState} from "react";

interface FindUser {
  summonerName: string,
  region: string
}

function HeaderBar () {
  const [summonerName, setSummonerName] = useState<string>('');
  const [region, setRegion] =useState<string>('NA');

  const searchSummoner = async () => {
    const message: FindUser = {
      summonerName: summonerName,
      region: region
    }

    const response = await fetch('/api/getUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body:JSON.stringify(message)
    })

    const jsonResponse = await response.json();
    if (jsonResponse) {
      console.log(jsonResponse)
    } else {
      console.log('summoner not found')
    }
    setSummonerName('')
  }
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown relative">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a>Homepage</a></li>
            <li><a>Portfolio</a></li>
            <li><a>About</a></li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <select className="select select-primary w-1/3 max-w-xs">
          <option onClick={() => setRegion('NA')}>NA</option>
          <option onClick={() => setRegion('EUW')}>EUW</option>
          <option onClick={() => setRegion('EUN')}>EUN</option>
          <option onClick={() => setRegion('KR')}>KR</option>
        </select>
        <form onSubmit={(e)=>{
          e.preventDefault()
          searchSummoner()
          const formElement = e.target as HTMLFormElement;
          formElement.reset();
          }} className="flex items-center relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input id="nameInput" type="text" placeholder="Summoners Name" className="input input-bordered w-full max-w-xs px-10" 
          onChange={(e) => {setSummonerName(e.target.value)}} />
        </form>
      </div>
      <div className="navbar-end">
        <a className="btn btn-ghost normal-case text-xl">LOL Data</a>
      </div>
    </div>
  )
}

export default HeaderBar;