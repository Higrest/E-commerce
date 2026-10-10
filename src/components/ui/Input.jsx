import React from 'react';

export const Input = React.forwardRef(({ 
  label, 
  type = 'text', 
  error, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400
          ${error ? 'border-red-500 focus:ring-red-500 bg-red-50/10' : 'border-gray-200'}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
