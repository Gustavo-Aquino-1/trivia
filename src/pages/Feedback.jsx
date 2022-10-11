import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import { actionCleanScore } from '../redux/actions';

class Feedback extends Component {
  state = {
    message: '',
  };

  componentDidMount() {
    this.messageStatus();
  }

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
    const { history: { push }, clean } = this.props;
    push('/');
    clean();
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
});

const mapDispatchToProps = (dispatch) => ({
  clean: () => dispatch(actionCleanScore()),
});

Feedback.propTypes = {
  assertions: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  clean: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
