import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loginAction } from '../redux/actions';
import { setItem } from '../services/localStorageFuncs';

class Login extends Component {
  state = {
    email: '',
    name: '',
    isBtnDisabled: true,
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
    const response = await fetch('https://opentdb.com/api_token.php?command=request');
    const { token } = await response.json();
    setItem('token', token);
  };

  handleClick = async (e) => {
    await this.fetchApi();
    e.preventDefault();
    const { name, email } = this.state;
    const { dispatch, history } = this.props;
    dispatch(loginAction({ email, name }));
    history.push('/game');
  };

  render() {
    const { name, email, isBtnDisabled } = this.state;
    return (
      <div>
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
      </div>
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
