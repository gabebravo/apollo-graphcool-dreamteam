import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';
import { REM_GET_TEAMS } from '../queries';

const DELETE_PLAYER = gql`
  mutation deletePlayer($id: String!) {
    deletePlayer(id: $id) @client
  }
`;

const ADD_TEAM = gql`
  mutation createTeam($name: String!, $players: [TeamplayersPlayer!]) {
    createTeam(name: $name, players: $players) {
      id
      name
      players {
        id
        name
      }
    }
  }
`;

const RESET_TEAM = gql`
  mutation resetTeam($flag: Boolean) {
    resetTeam(flag: $flag) @client
  }
`;

const printPlayers = players =>
  players.map((player, index) => {
    return (
      <ListGroupItem key={index}>
        <div className="d-flex">
          <div className="player-name">{`${player.name}`}</div>
          <div className="player-btn">
            <Mutation mutation={DELETE_PLAYER}>
              {deletePlayer => (
                <Button size="sm" color="danger" onClick={() => deletePlayer({ variables: { id: player.id } })}>
                  Remove
                </Button>
              )}
            </Mutation>
          </div>
        </div>
      </ListGroupItem>
    );
  });

const PlayersList = ({ data }) => {
  const { name, players } = data.newTeam;
  const playerNames = players.map(player => ({ name: player.name }));

  return (
    <div className={players.length > 0 ? 'player-list-wrapper' : 'hide-elm'}>
      <ListGroup>{players.length > 0 ? printPlayers(players) : null}</ListGroup>
      <div className={players.length === 5 ? 'save-btn-wrapper' : 'hide-elm'}>
        <Mutation mutation={ADD_TEAM}>
          {createTeam => (
            <Mutation mutation={RESET_TEAM}>
              {resetTeam => (
                <Button
                  color="success"
                  onClick={() =>
                    createTeam({
                      variables: { name, players: playerNames },
                      refetchQueries: [{ query: REM_GET_TEAMS }]
                    })
                      .then(resetTeam({}))
                      .catch(error => console.log('error'))
                  }
                >
                  Save Team
                </Button>
              )}
            </Mutation>
          )}
        </Mutation>
      </div>
    </div>
  );
};

export default PlayersList;
