import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';
import { getItem } from '../services/localStorageFuncs';
import '../styles/Game.css';
import { attScoreAction } from '../redux/actions';

class Game extends Component {
  state = {
    questions: [],
    index: 0,
    isClicked: false,
    arrOptions: [],
    isDisabled: false,
    time: 30,
  };

  async componentDidMount() {
    await this.fetchApi();
    this.timer();
  }

  fetchApi = async () => {
    const token = getItem('token');
    let response = await fetch(`https://opentdb.com/api.php?amount=5&token=${token}`);
    response = await response.json();
    console.log(response);
    this.setState({ questions: response.results }, this.questionRandom);
    const errorCode = 3;
    const { history } = this.props;
    if (response.response_code === errorCode) {
      localStorage.removeItem('token');
      history.push('/');
    }
  };

  timer = () => {
    const second = 1000;
    const idInterval = setInterval(() => {
      this.setState(({ time }) => ({
        time: time - 1,
      }), () => {
        const { time } = this.state;
        if (time === 0) {
          clearInterval(idInterval);
          this.setState({ isDisabled: true });
        }
      });
    }, second);
  };

  shuffle = (array = []) => {
    const numberRandom = 0.5;
    return array.slice().sort(() => Math.random() - numberRandom);
  };

  questionRandom = () => {
    const { questions, index } = this.state;
    const arrayQuestion = [
      questions[index].correct_answer,
      ...questions[index].incorrect_answers,
    ];
    this.setState({ arrOptions: this.shuffle(arrayQuestion) });
  };

  handleClick = (string, dificuldade) => {
    this.setState({ isClicked: true });
    const { time } = this.state;
    const { attScore } = this.props;
    let points;
    const initial = 10;
    const hard = 3;
    if (string === 'certa') {
      if (dificuldade === 'easy') {
        points = initial + (time * 1);
      } else if (dificuldade === 'medium') {
        points = initial + (time * 2);
      } else {
        points = initial + (time * hard);
      }
      attScore(points);
    }
  };

  render() {
    const { questions, index, isClicked, arrOptions, isDisabled, time } = this.state;
    return (
      <div>
        <Header />
        <p>{time}</p>
        { questions.length > 0 && (
          <>
            <h2 data-testid="question-category">
              { `${questions[index].category}` }
            </h2>
            <h3 data-testid="question-text">{`${questions[index].question}` }</h3>
            <div data-testid="answer-options">
              { arrOptions.map((question, i) => {
                if (question === questions[index].correct_answer) {
                  return (
                    <button
                      key={ i }
                      type="button"
                      data-testid="correct-answer"
                      onClick={ () => {
                        this.handleClick('certa', questions[index].difficulty);
                      } }
                      className={ isClicked && 'correct' }
                      disabled={ isDisabled }
                    >
                      { `${question}` }
                    </button>
                  );
                }
                return (
                  <button
                    key={ i }
                    type="button"
                    data-testid="wrong-answer"
                    onClick={ this.handleClick }
                    className={ isClicked && 'incorrect' }
                    disabled={ isDisabled }
                  >
                    { `${question}` }
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }
}

Game.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  attScore: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  attScore: (points) => dispatch(attScoreAction(points)),
});

export default connect(null, mapDispatchToProps)(Game);
