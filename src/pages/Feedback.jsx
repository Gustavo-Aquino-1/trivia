import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';

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

  render() {
    const { message } = this.state;
    return (
      <>
        <Header />
        <div>
          <p data-testid="feedback-text">Página de Feedback</p>
          <h3 data-testid="feedback-text">{message}</h3>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ player }) => ({
  assertions: player.assertions,
});

Feedback.propTypes = {
  assertions: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(Feedback);
