import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import md5 from 'crypto-js/md5';
import '../styles/Header.css';

class Header extends Component {
  state = {
    playerImg: '',
  };

  componentDidMount() {
    const { email } = this.props;
    const hash = md5(email).toString();
    const response = `https://www.gravatar.com/avatar/${hash}`;
    this.setState({ playerImg: response });
  }

  render() {
    const { email, name, score } = this.props;
    const { playerImg } = this.state;
    return (
      <header>
        <p>{email}</p>
        <p data-testid="header-player-name">{name}</p>
        <img
          src={ playerImg }
          alt="player"
          data-testid="header-profile-picture"
        />
        <p data-testid="header-score">
          {score}
          &nbsp;
          points
        </p>
      </header>
    );
  }
}

const mapStateToProps = ({ player }) => ({
  email: player.gravatarEmail,
  name: player.name,
  score: player.score,
});

Header.propTypes = {
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(Header);
