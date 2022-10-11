import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import md5 from 'crypto-js/md5';
import Header from '../components/Header';
import { setItem, getJSONItem } from '../services/localStorageFuncs';

class Feedback extends Component {
  state = {
    message: '',
  };

  componentDidMount() {
    this.messageStatus();
    this.savePlayer();
  }

  savePlayer = () => {
    const { gravatarEmail, name, score } = this.props;
    const hash = md5(gravatarEmail).toString();
    const url = `https://www.gravatar.com/avatar/${hash}`;
    const savePlayers = getJSONItem('ranking') || [];
    const arrSort = [...savePlayers, { name, score, url }]
      .sort((a, b) => +b.score - +a.score);
    setItem('ranking', arrSort);
  };

  messageStatus = () => {
    const { assertions } = this.props;
    const min = 3;
    if (assertions < min) {
      this.setState({ message: 'Could be better...' });
    } else {
      this.setState({ message: 'Well Done!' });
    }
  };

  handleClick = () => {
    const { history: { push } } = this.props;
    push('/');
  };

  toRankingPage = () => {
    const { history: { push } } = this.props;
    push('/ranking');
  };

  render() {
    const { message } = this.state;
    const { score, assertions } = this.props;
    return (
      <>
        <Header />
        <div>
          <h3 data-testid="feedback-text">{message}</h3>
          <p data-testid="feedback-total-score">{score}</p>
          <p data-testid="feedback-total-question">{assertions}</p>
          <button
            type="button"
            data-testid="btn-play-again"
            onClick={ this.handleClick }
          >
            Play Again
          </button>

          <button
            type="button"
            data-testid="btn-ranking"
            onClick={ this.toRankingPage }
          >
            Ranking
          </button>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ player }) => ({
  assertions: player.assertions,
  score: player.score,
  gravatarEmail: player.gravatarEmail,
  name: player.name,
});

Feedback.propTypes = {
  assertions: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  gravatarEmail: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps)(Feedback);
