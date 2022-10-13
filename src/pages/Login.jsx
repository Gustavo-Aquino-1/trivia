import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AiTwotoneSetting } from 'react-icons/ai';
import { FaPlay } from 'react-icons/fa';
import { GiPerspectiveDiceSixFacesRandom, GiTerror } from 'react-icons/gi';
import { loginAction, actionCleanScore } from '../redux/actions';
import { setItem } from '../services/localStorageFuncs';
import Loading from '../components/Loading';
import '../styles/Login.css';
import aud from '../archive/audio/show-do-milionario-abertura.mp3';

const audio = new Audio(aud);
audio.onerror = () => console.log('Houve um erro ao executar o audio');
audio.loop = true;

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      name: '',
      isBtnDisabled: true,
      loading: false,
      error: '',
    };
  }

  componentDidMount() {
    const root = document.querySelector('[data-testid="input-gravatar-email"]');
    root.addEventListener('input', () => {
      if (audio.currentTime <= 0) {
        audio.play();
      }
    });

    if (audio.paused) {
      try {
        audio.play();
      } catch (e) {
        console.log('Não foi possivel excutar o audio');
      }
    }
    const { dispatch } = this.props;
    dispatch(actionCleanScore());
  }

  componentWillUnmount() {
    audio.pause();
    audio.currentTime = 0;
  }

  validateInfo = () => {
    const { name, email } = this.state;
    if (name.length > 0 && email.length > 0) {
      this.setState({ isBtnDisabled: false, error: '' });
    } else {
      this.setState({
        isBtnDisabled: true,
        error: 'Digite um email válido e insira seu nome' });
    }
  };

  handlerChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value }, () => {
      this.validateInfo();
    });
  };

  fetchApi = async () => {
    const response = await fetch(
      'https://opentdb.com/api_token.php?command=request',
    );
    const { token } = await response.json();
    setItem('token', token);
  };

  handleClick = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    await this.fetchApi();
    this.setState({ loading: false });
    const { name, email } = this.state;
    const { dispatch, history } = this.props;
    dispatch(loginAction({ email, name }));
    history.push('/game');
  };

  handleClick2 = () => {
    const { history } = this.props;
    history.push('/settings');
  };

  render() {
    const { name, email, isBtnDisabled, loading, error } = this.state;
    return (
      <>
        { loading && <Loading /> }
        <div className="form-content-container">
          <form className="form-login">
            <div className="logo-icon">
              <GiPerspectiveDiceSixFacesRandom />
            </div>
            <input
              placeholder="Insira seu Email"
              type="email"
              name="email"
              data-testid="input-gravatar-email"
              onChange={ this.handlerChange }
              value={ email }
            />
            <input
              placeholder="Insira seu nome"
              type="text"
              name="name"
              data-testid="input-player-name"
              onChange={ this.handlerChange }
              value={ name }
            />
            { error && (
              <div className="error-message">
                <span className="icon-message"><GiTerror /></span>
                { error }
              </div>) }
            <button
              type="submit"
              data-testid="btn-play"
              disabled={ isBtnDisabled }
              onClick={ this.handleClick }
            >
              <FaPlay />
            </button>
            <button
              type="button"
              data-testid="btn-settings"
              onClick={ this.handleClick2 }
            >
              <AiTwotoneSetting />
            </button>
          </form>
        </div>
      </>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default connect()(Login);
