// src/NameathonApp.jsx
// ------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  Alert,
  Snackbar,
  Paper,
} from '@mui/material';
// import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
// import RedeemIcon from '@mui/icons-material/Redeem';

// Change this via Vite env var if you deploy the API somewhere else
const API_BASE = import.meta.env.VITE_API_BASE || 'https://nameathon.onrender.com';

export default function NameathonApp() {
  // ─── State ────────────────────────────────────────────────
  const [form, setForm] = useState({ giverName: '', relation: '', name: '' });
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // ─── Fetch existing suggestions on mount ─────────────────
  useEffect(() => {
    fetch(`${API_BASE}/api/suggestions`)
      .then((r) => r.json())
      .then(setSuggestions)
      .catch((e) => console.error('Fetch error:', e));
  }, []);

  // ─── Handlers ────────────────────────────────────────────
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => setForm({ giverName: '', relation: '', name: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = form.name.trim();
    if (!trimmed) return setError('Please enter a name suggestion.');
    const first = trimmed[0].toUpperCase();
    if (first !== 'T' && first !== 'R')
      return setError('Name must start with T or R.');

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, name: trimmed }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Error');
      const saved = await res.json();
      setSuggestions([saved, ...suggestions]);
      resetForm();
      setError('');
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── UI ──────────────────────────────────────────────────
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fceceb 0%, #e8f7ff 100%)',
      }}
    >
      <Container maxWidth="sm" sx={{ py: 6 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="center" gap={1} mb={2}>
          {/* <BabyChangingStationIcon sx={{ fontSize: 40, color: '#ff9aa2' }} /> */}
          <Typography variant="h3" fontWeight="bold" color="#5d6bff">
            Baby Nameathon
          </Typography>
          {/* <BabyChangingStationIcon sx={{ fontSize: 40, color: '#ff9aa2' }} /> */}
        </Stack>
        <Typography variant="subtitle1" align="center" mb={4} color="text.secondary">
          Help us pick the perfect boy name starting with <b>T</b> or <b>R</b>!
        </Typography>

        {/* RULES Card */}
        <Paper elevation={4} sx={{ p: 3, mb: 5, borderRadius: 3, backgroundColor: '#fff4f4' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {/* <RedeemIcon sx={{ mr: 1, verticalAlign: 'sub' }} />  */}
            Rules
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.6 }}>
            <li>Must be a <b>boy</b> name.</li>
            <li>Must start with the letter <b>T</b> <em>or</em> <b>R</b>.</li>
            <li>The chosen winner will receive fun baby‑themed gifts!</li>
          </ul>
        </Paper>

        {/* Form */}
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mb: 6 }}>
          <Stack spacing={2}>
            <TextField
              label="Your Name"
              name="giverName"
              value={form.giverName}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Relation to Baby"
              name="relation"
              value={form.relation}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Name Suggestion (T/R)"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
              size="small"
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ backgroundColor: '#5d6bff' }}
            >
              {loading ? 'Submitting…' : 'Submit'}
            </Button>
          </Stack>
        </Box>

         {/* Suggestions Count */}
        <Stack spacing={2}>
          {suggestions.length === 0 ? (
            <Typography align="center" color="text.secondary">
              No suggestions yet — be the first!
            </Typography>
          ) : (
            <Typography align="center" color="text.secondary" fontSize="1.1rem">
              {suggestions.length} suggestion{suggestions.length > 1 ? 's' : ''} made so far
            </Typography>
          )}
        </Stack>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Thank you! Your suggestion was saved.
        </Alert>
      </Snackbar>
    </Box>
  );
}

