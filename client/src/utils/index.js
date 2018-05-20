
export const formatPlayers = obj => 
  Object.keys(obj)
    .filter( key => key[0] === 'p' )
    .map( key => ({ name: obj[key] }))