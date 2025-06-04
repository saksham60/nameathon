// src/NameathonApp.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, TextField, Button, Card, CardContent,
  Stack, Alert, Snackbar, Paper, CircularProgress, Collapse, Divider, Chip
} from '@mui/material';
import CelebrationIcon from '@mui/icons-material/Celebration';
import BoyIcon from '@mui/icons-material/ChildFriendly';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://nameathon.onrender.com';

export default function NameathonApp() {
  const [showList, setShowList] = useState(false);
  const [form, setForm] = useState({ giverName: '', relation: '', name: '' });
  const [suggestions, setSuggestions] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [status, setStatus] = useState({}); // { id: "accepted" | "rejected" }

  useEffect(() => {
    fetch(`${API_BASE}/api/suggestions`)
      .then(r => r.json())
      .then(setSuggestions)
      .catch(e => console.error('Fetch error:', e));
  }, []);

  const toggleList = async () => {
    if (!showList) {
      setListLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/suggestions`);
        setSuggestions(await res.json());
      } catch (e) {
        setError('Could not fetch suggestions.');
      } finally {
        setListLoading(false);
      }
    }
    setShowList(prev => !prev);
  };

  const handleStatus = (id, newStatus) => {
    setStatus(prev => ({ ...prev, [id]: newStatus }));
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fceceb 0%, #e8f7ff 100%)' }}>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Stack direction="row" alignItems="center" justifyContent="center" gap={1} mb={2}>
          <CelebrationIcon sx={{ fontSize: 46, color: '#ff80ab' }} />
          <Typography variant="h3" fontWeight="bold" color="#5d6bff">Baby Nameathon</Typography>
          <BoyIcon sx={{ fontSize: 46, color: '#4dd0e1' }} />
        </Stack>
        <Typography variant="subtitle1" align="center" mb={4} color="text.secondary">
          The Nameathon has ended — thanks for <b>{suggestions.length}</b> fantastic ideas!
        </Typography>

        <Paper elevation={4} sx={{ p: 3, mb: 5, borderRadius: 3, backgroundColor: '#fff4f4' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>Rules</Typography>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.6 }}>
            <li>Must be a <b>boy</b> name.</li>
            <li>Must start with <b>T</b> or <b>R</b>.</li>
            <li>Winner gets fun baby-themed gifts!</li>
          </ul>
        </Paper>

        <Box sx={{ mb: 4 }}>
          <Stack spacing={2}>
            <Button variant={showList ? 'contained' : 'outlined'} size="large" onClick={toggleList}>
              {showList ? 'Hide Suggestions' : `View Suggestions (${suggestions.length})`}
            </Button>
          </Stack>
        </Box>

        <Collapse in={showList}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, maxHeight: 480, overflowY: 'auto', backgroundColor: '#ffffffdf', backdropFilter: 'blur(4px)' }}>
            {listLoading ? (
              <Stack alignItems="center" my={4}><CircularProgress /></Stack>
            ) : suggestions.length === 0 ? (
              <Typography align="center" color="text.secondary">No suggestions yet.</Typography>
            ) : (
              <Stack spacing={2}>
                {suggestions.map((s, idx) => (
                  <React.Fragment key={s.id}>
                    <Card variant="outlined" sx={{ bgcolor: status[s.id] === 'accepted' ? '#e8f5e9' : status[s.id] === 'rejected' ? '#ffebee' : idx % 2 ? '#f4f7ff' : '#fafafa' }}>
                      <CardContent sx={{ py: 1.5 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography fontWeight="bold">{s.name}</Typography>
                          {status[s.id] && (
                            <Chip
                              size="small"
                              color={status[s.id] === 'accepted' ? 'success' : 'error'}
                              label={status[s.id].toUpperCase()}
                            />
                          )}
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {s.giverName || 'Anonymous'}{s.relation && ` — ${s.relation}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(s.createdAt).toLocaleString()}
                        </Typography>

                        {!status[s.id] && (
                          <Stack direction="row" spacing={1} mt={1}>
                            <Button size="small" variant="contained" color="success" onClick={() => handleStatus(s.id, 'accepted')}>
                              Accept
                            </Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => handleStatus(s.id, 'rejected')}>
                              Reject
                            </Button>
                          </Stack>
                        )}
                      </CardContent>
                    </Card>
                    {idx !== suggestions.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </Stack>
            )}
          </Paper>
        </Collapse>

        <Snackbar open={success} autoHideDuration={4000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity="success">Thank you! Your suggestion was saved.</Alert>
        </Snackbar>
        <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
