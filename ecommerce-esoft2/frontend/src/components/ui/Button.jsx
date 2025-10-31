import React from 'react';

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  let buttonStyle = {
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    border: 'none',
    fontWeight: 'bold',
    transition: 'background-color 0.3s'
  };
  
  // Aplicação de cores simples
  if (variant === 'primary') {
    buttonStyle = { ...buttonStyle, backgroundColor: '#4F46E5', color: 'white' };
  } else if (variant === 'secondary') {
    buttonStyle = { ...buttonStyle, backgroundColor: '#ccc', color: '#333' };
  }

  return (
    <button
      style={buttonStyle}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;