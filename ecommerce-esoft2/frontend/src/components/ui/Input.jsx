import React from 'react';

const Input = React.forwardRef(({ label, type = "text", id, name, required, ...props }, ref) => {
  // Estilo CSS puro
  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontSize: '14px'
  };

  return (
    <div style={{ marginBottom: '15px' }}>
      {label && (
        <label htmlFor={id || name} style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
          {label} {required && <span style={{ color: 'red' }}>*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        id={id || name}
        name={name}
        style={inputStyle}
        {...props}
      />
    </div>
  );
});

export default Input;