import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Slider, Fade } from '@mui/material';

export default function VideoPlayer({ src, captions }) {
  const isEmbed = src.includes('youtube.com/embed') || src.includes('vimeo.com/video');
  const [currentCaption, setCurrentCaption] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  // Generate WebVTT file with start and end times
  const generateVTT = () => {
    let vtt = 'WEBVTT\n\n';
    captions.forEach((caption) => {
      const { startTime, endTime, text } = caption;
      vtt += `${startTime}.000 --> ${endTime}.000\n${text}\n\n`;
    });
    return URL.createObjectURL(new Blob([vtt], { type: 'text/vtt' }));
  };

  // Caption synchronization logic
  useEffect(() => {
    if (!isEmbed && videoRef.current) {
      const track = videoRef.current.textTracks[0];
      if (track) {
        track.mode = 'showing';
        track.oncuechange = () => {
          const activeCue = track.activeCues[0];
          setCurrentCaption(activeCue ? activeCue.text : '');
        };
      }
    }
  }, [isEmbed, captions]);

  // Handle video time updates
  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  // Handle video metadata load
  const handleLoadedMetadata = (e) => {
    setDuration(e.target.duration);
  };

  // Handle slider seek
  const handleSeek = (_, value) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value;
    }
  };

  return (
    <Box
      sx={{
        mb: 4,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: 3,
        position: 'relative',
      }}
    >
      {isEmbed ? (
        <>
          <iframe
            src={src}
            width="100%"
            height="400"
            style={{ border: 'none' }}
            allowFullScreen
            title="Embedded Video"
          />
          <Fade in={!!currentCaption}>
            <Typography
              variant="body1"
              sx={{
                position: 'absolute',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                bgcolor: 'rgba(0,0,0,0.7)',
                px: 2,
                py: 1,
                borderRadius: '4px',
                color: 'white',
              }}
            >
              {currentCaption}
            </Typography>
          </Fade>
        </>
      ) : (
        <>
          <video
            ref={videoRef}
            controls
            style={{ width: '100%', display: 'block' }}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          >
            <source src={src} type="video/mp4" />
            <track
              src={generateVTT()}
              kind="captions"
              label="English"
              default
            />
          </video>
          <Slider
            value={currentTime}
            max={duration}
            onChange={handleSeek}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              color: 'primary.main',
              height: 4,
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
                transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                '&:hover': {
                  width: 16,
                  height: 16,
                },
              },
            }}
          />
        </>
      )}
    </Box>
  );
}