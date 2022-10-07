import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loginAction } from '../redux/actions';

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

  render() {
    const { name, email, isBtnDisabled } = this.state;
    const { dispatch } = this.props;
    return (
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
          onClick={ () => dispatch(loginAction({ email, name })) }
        >
          Play
        </button>
      </form>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(Login);
