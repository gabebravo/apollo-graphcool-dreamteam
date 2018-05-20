import { gql } from 'apollo-boost';

export const REM_GET_TEAMS = gql`
  {
    allTeams {
      id
      name
      players {
        id
        name
      }
    }
  }
`;