interface statsRanking {
  totalDamageDealt: number[],
  deaths: number[],
  killParticipation: number[],
  totalMinionsKilled: number[],
  visionScore: number[]
}

const PentagonalGraphAPI = {
  calculateAverageRank: (data, summonerName: string, position:string) => {
        const playerRank: statsRanking = {
          totalDamageDealt: [],
          deaths: [],
          killParticipation: [],
          totalMinionsKilled: [],
          visionScore: []
        }
        let sampleSize: number = 0;
        //rank player stats in all five category out of 10
        for (let i = 0; i < data.length; i++) {
          const currentMatch = data[i];
          //filtering based on position
          if (position !== 'overall' && currentMatch.playerPosition.toUpperCase() !== position.toUpperCase()) {
            continue;
          }
          sampleSize++;  
          const combinedTeam = currentMatch.participants.blue.concat(currentMatch.participants.red);
    
          const stats: string[] = ['totalDamageDealt', 'deaths','killParticipation','totalMinionsKilled','visionScore'];
          
          //rank the player based on each stats
          for (let j = 0; j < stats.length; j++) {
            const currentStat:string = stats[j];
            let sortedPlayerStats;
    
            if (currentStat !== 'deaths') sortedPlayerStats = combinedTeam.toSorted((a,b) => a[currentStat]- b[currentStat]);
            else sortedPlayerStats = combinedTeam.toSorted((a,b) => b[currentStat]- a[currentStat]);
    
            // console.log(`sorted ${currentStat}:`, sortedPlayerStats)
            const rank = sortedPlayerStats.findIndex((player) => player.name.toUpperCase() === summonerName.toUpperCase()) + 1
            
            playerRank[currentStat].push(rank);
          } 
        }
        //calculate average score in each stats
        for (const stat in playerRank) {
          const total = playerRank[stat].reduce((acc:number,curr:number) => acc+=curr,0);
          //calculate how much points to give based on rank out of 10
          playerRank[stat] = (total/sampleSize);
          // if (champion === null) playerRank[stat] = (total/sampleSize);
          // else playerRank[stat] = (total/championPool[champion])
        }
        return playerRank
  }
}

export default PentagonalGraphAPI;