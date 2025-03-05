import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setVideoUrl, editCaption, deleteCaption } from '../redux/slices/captionsSlice';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  IconButton,
  Fade,
  Paper,
  Divider,
} from '@mui/material';
import { Edit, Delete, Download, PlayCircleOutline } from '@mui/icons-material';
import VideoPlayer from '../components/VideoPlayer';
import CaptionForm from '../components/CaptionForm';

export default function Home() {
  const dispatch = useDispatch();
  const { videoUrl, captions } = useSelector((state) => state.captions);
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const validateAndGenerateEmbedUrl = (url) => {
    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.hostname.includes('youtube.com') || parsedUrl.hostname.includes('youtu.be')) {
        const videoId = parsedUrl.pathname.includes('/v/')
          ? parsedUrl.pathname.split('/v/')[1]
          : parsedUrl.searchParams.get('v') || parsedUrl.pathname.split('/').pop();
        if (videoId && videoId.match(/^[a-zA-Z0-9_-]{11}$/)) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      if (parsedUrl.hostname.includes('vimeo.com')) {
        const videoId = parsedUrl.pathname.split('/').pop();
        if (videoId && videoId.match(/^\d+$/)) {
          return `https://player.vimeo.com/video/${videoId}`;
        }
      }

      if (parsedUrl.hostname.includes('dailymotion.com') || parsedUrl.hostname.includes('dai.ly')) {
        const videoId = parsedUrl.pathname.includes('/video/')
          ? parsedUrl.pathname.split('/video/')[1]
          : parsedUrl.pathname.split('/').pop();
        if (videoId && videoId.match(/^[a-zA-Z0-9]+$/)) {
          return `https://www.dailymotion.com/embed/video/${videoId}`;
        }
      }

      if (parsedUrl.hostname.includes('twitch.tv')) {
        const videoId = parsedUrl.pathname.split('/videos/')[1];
        if (videoId && videoId.match(/^\d+$/)) {
          return `https://player.twitch.tv/?video=${videoId}&parent=${window.location.hostname}`;
        }
      }

      if (parsedUrl.hostname.includes('facebook.com') || parsedUrl.hostname.includes('fb.watch')) {
        const videoId = parsedUrl.pathname.split('/videos/')[1] || parsedUrl.pathname.split('/')[2];
        if (videoId && videoId.match(/^\d+$/)) {
          return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}`;
        }
      }

      if (parsedUrl.pathname.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)) {
        return url;
      }

      return null;
    } catch (error) {
      console.error('Invalid URL:', error);
      return null;
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    const embedUrl = validateAndGenerateEmbedUrl(urlInput);
    if (embedUrl) {
      dispatch(setVideoUrl(embedUrl));
      setError('');
    } else {
      dispatch(setVideoUrl(''));
      setError('Invalid video URL. Please enter a valid YouTube, Vimeo, or direct video link.');
    }
  };

  const handleEditCaption = (index) => {
    setEditIndex(index);
  };

  const handleDeleteCaption = (index) => {
    dispatch(deleteCaption(index));
  };

  const handleExportCaptions = () => {
    const sortedCaptions = [...captions].sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a.startTime}Z`).getTime();
      const timeB = new Date(`1970-01-01T${b.startTime}Z`).getTime();
      return timeA - timeB;
    });

    let vttContent = 'WEBVTT\n\n';
    sortedCaptions.forEach((caption) => {
      vttContent += `${caption.startTime}.000 --> ${caption.endTime}.000\n${caption.text}\n\n`;
    });

    const blob = new Blob([vttContent], { type: 'text/vtt' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'captions.vtt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const sortedCaptions = [...captions].sort((a, b) => {
    const timeA = new Date(`1970-01-01T${a.startTime}Z`).getTime();
    const timeB = new Date(`1970-01-01T${b.startTime}Z`).getTime();
    return timeA - timeB;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          background: 'linear-gradient(45deg, #7C4DFF 30%, #FF6E40 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 4,
        }}
      >
        Video Caption Studio
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: '12px' }}>
        <Box component="form" onSubmit={handleUrlSubmit} sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Enter video URL (YouTube, Vimeo, or direct link)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            variant="outlined"
            sx={{ flexGrow: 1 }}
          />
          <Button type="submit" variant="contained" color="primary" startIcon={<PlayCircleOutline />}>
            Load Video
          </Button>
        </Box>
      </Paper>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {videoUrl ? (
        <Fade in={!!videoUrl} timeout={500}>
          <Box sx={{ mb: 4 }}>
            <VideoPlayer key={videoUrl} src={videoUrl} captions={sortedCaptions} />
          </Box>
        </Fade>
      ) : (
        <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', mb: 4 }}>
          Please load a video to start adding captions.
        </Typography>
      )}

      {videoUrl && (
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: '12px' }}>
          <CaptionForm editIndex={editIndex} setEditIndex={setEditIndex} />
        </Paper>
      )}

      {videoUrl && sortedCaptions.length > 0 && (
        <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            Captions
          </Typography>
          <List>
            {sortedCaptions.map((caption, index) => (
              <Fade in={true} key={index}>
                <ListItem
                  sx={{
                    mb: 1,
                    borderRadius: '8px',
                    transition: 'background-color 0.3s',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemText
                    primary={caption.text}
                    secondary={`${caption.startTime} - ${caption.endTime}`}
                    sx={{ flexGrow: 1 }}
                  />
                  <IconButton onClick={() => handleEditCaption(index)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteCaption(index)} color="error">
                    <Delete />
                  </IconButton>
                </ListItem>
              </Fade>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Download />}
            onClick={handleExportCaptions}
            sx={{ mt: 2 }}
          >
            Export Captions
          </Button>
        </Paper>
      )}
    </Container>
  );
}