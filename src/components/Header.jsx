import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import md5 from 'crypto-js/md5';

class Header extends Component {
  state = {
    playerImg: '',
    placar: 0,
  };

  componentDidMount() {
    const { email } = this.props;
    const hash = md5(email).toString();
    const response = `https://www.gravatar.com/avatar/${hash}`;
    this.setState({ playerImg: response });
  }

  render() {
    const { email, name } = this.props;
    const { playerImg, placar } = this.state;
    return (
      <header>
        <p>{email}</p>
        <p data-testid="header-player-name">{name}</p>
        <img
          src={ playerImg }
          alt="player"
          data-testid="header-profile-picture"
        />
        <p data-testid="header-score">{placar}</p>
      </header>
    );
  }
}


const mapStateToProps = ({ player }) => ({
  email: player.gravatarEmail,
  name: player.name,
});

Header.propTypes = {
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(Header);
