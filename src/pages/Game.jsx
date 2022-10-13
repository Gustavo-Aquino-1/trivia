import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { GiCuckooClock } from 'react-icons/gi';
import { TbPlayerTrackNext } from 'react-icons/tb';
import Header from '../components/Header';
import { getItem } from '../services/localStorageFuncs';
import '../styles/Game.css';
import { attScoreAction } from '../redux/actions';
import Timer from '../archive/audio/timer.mp3';
import right from '../archive/audio/resposta-certa.mp3';

const audio = new Audio(Timer);
const rightAudio = new Audio(right);

class Game extends Component {
  state = {
    questions: [],
    index: 0,
    isClicked: false,
    arrOptions: [],
    isDisabled: false,
    time: 30,
    transition: true,
  };

  async componentDidMount() {
    this.timer();
    try {
      audio.play();
    } catch (e) {
      console.log('Não foi possivel executar o audio');
    }
    await this.fetchApi();
  }

  componentWillUnmount() {
    audio.pause();
    audio.currentTime = 0;
  }

  fetchApi = async () => {
    const token = getItem('token');
    let response = await fetch(`https://opentdb.com/api.php?amount=5&token=${token}`);
    response = await response.json();
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
          this.setState({ isDisabled: true, isClicked: true, transition: false });
        }
      });
    }, second);
    this.setState({ timerId: idInterval });
  };

  shuffle = (array = []) => {
    const numberRandom = 0.5;
    return array.slice().sort(() => Math.random() - numberRandom);
  };

  nextQuestion = () => {
    const { index, questions } = this.state;
    if (index < questions.length - 1) {
      this.setState((state) => ({
        index: state.index + 1,
        time: 30,
        isClicked: false,
        isDisabled: false,
        arrOptions: [],
        transition: true,
      }), this.questionRandom);
      this.timer();
      audio.currentTime = 0;
      audio.play();
    } else {
      const { history } = this.props;
      history.push('/feedback');
    }
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
    const { timerId } = this.state;
    clearInterval(timerId);
    audio.pause();
    rightAudio.currentTime = 0;
    rightAudio.play();
    this.setState({ isClicked: true, isDisabled: true, transition: false });
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
    const { questions,
      index, isClicked, arrOptions, isDisabled, time, transition } = this.state;
    return (
      <div className="content-container">
        <Header />
        { questions.length > 0 && (
          <>
            <div
              className={ `info-questions ${transition && 'questions-info-animation'}` }
            >
              <h2 data-testid="question-category">
                { `${questions[index].category}` }
              </h2>
              <h3 data-testid="question-text">{`${questions[index].question}` }</h3>
            </div>
            <div className="timer-container">
              <div className="timer-icon"><GiCuckooClock /></div>
              <p className="timer-second">{time}</p>
            </div>
            <div
              data-testid="answer-options"
              className={ `answer-options ${transition && 'questions-info-animation'}` }
            >
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
            { isClicked && (
              <div className="button-right">
                <button
                  type="button"
                  data-testid="btn-next"
                  onClick={ this.nextQuestion }
                >
                  <span className="next-icon"><TbPlayerTrackNext /></span>
                  Next
                </button>
              </div>
            )}
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
