import React, { Component } from 'react';

class Loading extends Component {
  render() {
    return (
      <div className="modal-loading">
        <div data-testid="loading" className="loading">Crregando...</div>
      </div>
    );
  }
}

export default Loading;
