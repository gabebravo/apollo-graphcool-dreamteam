import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Collapse, Input, Button } from 'reactstrap';
import { gql } from 'apollo-boost';
import { Query, Mutation } from 'react-apollo';
import { REM_GET_TEAMS } from '../queries';
import { formatPlayers } from '../utils';

const DELETE_TEAM = gql`
  mutation deleteTeam($id: ID!) {
    deleteTeam(id: $id) {
      id
      name
      players {
        id
        name
      }
    }
  }
`;

const UPDATE_TEAM = gql`
  mutation updateTeam($id: ID!, $name: String!, $players: [TeamplayersPlayer!]) {
    updateTeam(id: $id, name: $name, players: $players) {
      id
      name
      players {
        id
        name
      }
    }
  }
`;

const DEFAULT_VALUES = {
  isOpen: false,
  id: '',
  mode: 'read',
  p1: '',
  p2: '',
  p3: '',
  p4: '',
  p5: ''
};

class TeamsList extends Component {
  state = DEFAULT_VALUES;

  componentWillUnmount = () => {
    this.setState(DEFAULT_VALUES);
  };

  render() {
    return (
      <div className="teams-wrapper">
        <h5>Dream Teams</h5>
        <Query query={REM_GET_TEAMS}>
          {({ loading, error, data }) => {
            if (loading) return <div>Loading...</div>;
            if (error) return <div>Error :(</div>;

            return (
              <ListGroup>
                {' '}
                {data.allTeams.length > 0
                  ? data.allTeams.map(team => {
                      return (
                        <div key={team.id}>
                          <ListGroupItem className="team-info">
                            <div className="d-flex justify-content-between">
                              <div>{team.name}</div>
                              <div>
                                <i
                                  className="far fa-eye"
                                  onClick={() =>
                                    this.setState({ isOpen: !this.state.isOpen, id: team.id, mode: 'read' })
                                  }
                                />
                                <i
                                  className="fas fa-edit"
                                  onClick={() => {
                                    const stateObj = team.players.reduce(
                                      (accum, player, index) => {
                                        accum[`p${index + 1}`] = player.name;
                                        return accum;
                                      },
                                      { isOpen: !this.state.isOpen, id: team.id, mode: 'edit' }
                                    );
                                    this.setState(stateObj);
                                  }}
                                />
                                <Mutation mutation={DELETE_TEAM}>
                                  {deleteTeam => (
                                    <i
                                      className="fas fa-trash-alt"
                                      onClick={() =>
                                        deleteTeam({
                                          variables: { id: team.id },
                                          refetchQueries: [{ query: REM_GET_TEAMS }]
                                        })
                                      }
                                    />
                                  )}
                                </Mutation>
                              </div>
                            </div>
                          </ListGroupItem>

                          <Collapse
                            isOpen={this.state.isOpen && this.state.mode === 'read' && this.state.id === team.id}
                          >
                            <ListGroup>
                              {team.players.map(player => <ListGroupItem key={player.id}>{player.name}</ListGroupItem>)}
                            </ListGroup>
                          </Collapse>

                          <Collapse
                            isOpen={this.state.isOpen && this.state.mode === 'edit' && this.state.id === team.id}
                          >
                            <ListGroup>
                              <div className="user-form-container">
                                {team.players.map((player, index) => {
                                  return (
                                    <Input
                                      key={player.id}
                                      type="text"
                                      placeholder="Player name"
                                      value={this.state[`p${index + 1}`]}
                                      onChange={e => this.setState({ [`p${index + 1}`]: e.target.value })}
                                    />
                                  );
                                })}
                              </div>
                              <Mutation mutation={UPDATE_TEAM}>
                                  {updateTeam => (
                                    <Button 
                                      color="success"
                                      onClick={() =>
                                        updateTeam({
                                          variables: { id: team.id, name: team.name, players: formatPlayers(this.state) },
                                          refetchQueries: [{ query: REM_GET_TEAMS }]
                                        }).then( result => this.setState({ isOpen: !this.state.isOpen }))
                                          .catch( error => console.log('error'))
                                      }
                                    >Update Team</Button>
                                  )}
                                </Mutation>
                            </ListGroup>
                          </Collapse>
                        </div>
                      );
                    })
                  : null}
              </ListGroup>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default TeamsList;
