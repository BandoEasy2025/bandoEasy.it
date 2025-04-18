import React from 'react'

const Button = ({ children, onClick, className = '' }) => {
  return (
    <button 
      className={`button ${className}`}
      onClick={onClick}
    >
      {children}
      <style jsx>{`
        .button {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .button:hover {
          background-color: #0051a8;
        }
      `}</style>
    </button>
  )
}

export default Button 