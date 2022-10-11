import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getJSONItem } from '../services/localStorageFuncs';

class Ranking extends Component {
  state = {
    players: [],
  };

  componentDidMount() {
    const players = getJSONItem('ranking');
    this.setState({ players });
  }

  handleClick = () => {
    const { history } = this.props;
    history.push('/');
  };

  render() {
    const { players } = this.state;
    return (
      <div>
        <h1 data-testid="ranking-title">RANKING</h1>
        <button
          type="button"
          data-testid="btn-go-home"
          onClick={ this.handleClick }
        >
          Go Home
        </button>
        {
          players.length > 0 && (
            <div>
              {
                players.map((e, index) => (
                  <div
                    key={ e.url }
                  >
                    <p data-testid={ `player-name-${index}` }>{e.name}</p>
                    <h4 data-testid={ `player-score-${index}` }>{e.score}</h4>
                  </div>
                ))
              }
            </div>
          )
        }
      </div>
    );
  }
}

Ranking.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default Ranking;
