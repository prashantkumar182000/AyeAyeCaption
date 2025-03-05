import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCaption, editCaption } from '../redux/slices/captionsSlice';
import { Box, TextField, Button, Snackbar, Alert, Fade } from '@mui/material';
import TimestampInput from './TimeStampInput';

export default function CaptionForm({ editIndex, setEditIndex }) {
  const dispatch = useDispatch();
  const { captions } = useSelector((state) => state.captions);
  const [caption, setCaption] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editIndex !== null) {
      const { text, startTime, endTime } = captions[editIndex];
      setCaption(text);
      setStartTime(startTime);
      setEndTime(endTime);
    }
  }, [editIndex, captions]);

  const validateTimestamps = (start, end) => {
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (!regex.test(start) || !regex.test(end)) {
      return 'Invalid timestamp format. Use HH:MM:SS.';
    }
    if (start >= end) {
      return 'End time must be greater than start time.';
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateTimestamps(startTime, endTime);
    if (!caption.trim()) {
      setError('Caption cannot be empty.');
      return;
    }
    if (validationError) {
      setError(validationError);
      return;
    }
    if (editIndex !== null) {
      dispatch(editCaption({ index: editIndex, caption: { text: caption, startTime, endTime } }));
      setEditIndex(null);
    } else {
      dispatch(addCaption({ text: caption, startTime, endTime }));
    }
    setCaption('');
    setStartTime('');
    setEndTime('');
    setError('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <TextField
        fullWidth
        label="Enter caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <TimestampInput
        label="Start Time (HH:MM:SS)"
        value={startTime}
        onChange={setStartTime}
        sx={{ mb: 2 }}
      />
      <TimestampInput
        label="End Time (HH:MM:SS)"
        value={endTime}
        onChange={setEndTime}
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        {editIndex !== null ? 'Update Caption' : 'Add Caption'}
      </Button>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        TransitionComponent={Fade}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}