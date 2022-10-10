import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import { getItem } from '../services/localStorageFuncs';

class Game extends Component {
  state = {
    questions: [],
    index: 0,
  };

  async componentDidMount() {
    const token = getItem('token');
    let response = await fetch(`https://opentdb.com/api.php?amount=5&token=${token}`);
    response = await response.json();
    console.log(response);
    this.setState({ questions: response.results });
    const errorCode = 3;
    const { history } = this.props;
    if (response.response_code === errorCode) {
      localStorage.removeItem('token');
      history.push('/');
    }
  }

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
    return this.shuffle(arrayQuestion);
  };

  render() {
    const { questions, index } = this.state;
    return (
      <div>
        <Header />
        { questions.length > 0 && (
          <>
            <h2 data-testid="question-category">
              { questions[index].category }
            </h2>
            <h3 data-testid="question-text">{questions[index].question }</h3>
            <div data-testid="answer-options">
              { this.questionRandom().map((question, i) => {
                if (question === questions[index].correct_answer) {
                  return (
                    <button
                      key={ i }
                      type="button"
                      data-testid="correct-answer"
                    >
                      { question }
                    </button>
                  );
                }
                return (
                  <button
                    key={ i }
                    type="button"
                    data-testid="wrong-answer"
                  >
                    { question }
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
};

export default Game;
