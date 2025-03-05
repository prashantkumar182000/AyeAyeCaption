import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';

export default function TimestampInput({ label, value, onChange, sx }) {
  const [timestamp, setTimestamp] = useState(value || '');

  useEffect(() => {
    setTimestamp(value || '');
  }, [value]);

  const validateAndFormat = (input) => {
    // Remove all non-digit characters
    const numbers = input.replace(/[^0-9]/g, '');
    let formatted = '';

    // Auto-format as HH:MM:SS
    if (numbers.length > 0) {
      const hours = numbers.slice(0, 2);
      const minutes = numbers.slice(2, 4);
      const seconds = numbers.slice(4, 6);

      formatted = [hours, minutes, seconds]
        .filter(Boolean)
        .join(':')
        .substring(0, 8);
    }

    return formatted;
  };

  const handleChange = (e) => {
    const formatted = validateAndFormat(e.target.value);
    setTimestamp(formatted);
    onChange(formatted);
  };

  return (
    <TextField
      fullWidth
      label={label}
      value={timestamp}
      onChange={handleChange}
      variant="outlined"
      sx={sx}
      inputProps={{
        maxLength: 8,
        placeholder: '00:00:00',
      }}
    />
  );
}