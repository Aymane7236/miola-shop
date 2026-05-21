import React, { Component } from 'react';
import { Toast } from 'react-bootstrap';

class MyToast extends Component {
  render() {
    const toastCss = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)'
    };

    const { show, message, type } = this.props.children;
    const isSuccess = type === 'success';

    return (
      <div style={show ? toastCss : null}>
        <Toast
          className={`border text-white ${isSuccess ? 'border-success bg-success' : 'border-danger bg-danger'}`}
          show={show}
        >
          <Toast.Header
            className={`text-white ${isSuccess ? 'bg-success' : 'bg-danger'}`}
            closeButton={false}
          >
            <strong className="me-auto">
              {isSuccess ? 'Succès' : 'Supprimé'}
            </strong>
          </Toast.Header>
          <Toast.Body>{message}</Toast.Body>
        </Toast>
      </div>
    );
  }
}

export default MyToast;
