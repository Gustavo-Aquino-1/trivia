import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { GiRank3 } from 'react-icons/gi';
import { getJSONItem } from '../services/localStorageFuncs';
import '../styles/Ranking.css';

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
      <div className="rank_container">
        <h1 className="title_rank" data-testid="ranking-title">
          <span className="title_rank">RANKING</span>
          <span className="rank_icon"><GiRank3 /></span>
        </h1>
        {
          players.length > 0 && (
            <div>
              {
                players.map((e, index) => (
                  <div
                    className="player_rank"
                    key={ e.url }
                  >
                    <img src={ e.url } alt="profile" />
                    <p data-testid={ `player-name-${index}` }>{e.name}</p>
                    <span className="arrow"><FaLongArrowAltRight /></span>
                    <p data-testid={ `player-score-${index}` }>{e.score}</p>
                  </div>
                ))
              }
            </div>
          )
        }
        <button
          className="btn_to_home"
          type="button"
          data-testid="btn-go-home"
          onClick={ this.handleClick }
        >
          Go Home
        </button>
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
