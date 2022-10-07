import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loginAction } from '../redux/actions';
import { setItem } from '../services/localStorageFuncs';
import Loading from '../components/Loading';

class Login extends Component {
  state = {
    email: '',
    name: '',
    isBtnDisabled: true,
    loading: false,
  };

  validateInfo = () => {
    const { name, email } = this.state;
    if (name.length > 0 && email.length > 0) {
      this.setState({ isBtnDisabled: false });
    } else {
      this.setState({ isBtnDisabled: true });
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
    const { name, email, isBtnDisabled, loading } = this.state;
    return (
      <>
        { loading && <Loading />}
        <form>
          <input
            type="email"
            name="email"
            data-testid="input-gravatar-email"
            onChange={ this.handlerChange }
            value={ email }
          />
          <input
            type="text"
            name="name"
            data-testid="input-player-name"
            onChange={ this.handlerChange }
            value={ name }
          />
          <button
            type="submit"
            data-testid="btn-play"
            disabled={ isBtnDisabled }
            onClick={ this.handleClick }
          >
            Play
          </button>
          <button
            type="button"
            data-testid="btn-settings"
            onClick={ this.handleClick2 }
          >
            Configurações
          </button>
        </form>
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
