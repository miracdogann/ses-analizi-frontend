import React from 'react';
import "../styles/css/modal.css"; // Modal için stil dosyası

function Modal({ message, onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Analiz Sonucu</h3>
                <p style={{whiteSpace:"pre-line"}}>{message}</p>
                <button onClick={onClose}>Tamam</button>
            </div>
        </div>
    );
}

export default Modal;
