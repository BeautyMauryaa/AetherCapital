import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, Box, CircularProgress,
  Chip,
} from '@mui/material';
import {
  CheckCircleRounded, CancelRounded, ManageSearchRounded,
} from '@mui/icons-material';
import { useAdminStore } from '../store/adminStore';

const STATUS_CONFIG = {
  approved: {
    label:  'Approve',
    color:  'success',
    icon:   <CheckCircleRounded />,
    bg:     '#e8f5e9',
    text:   '#2e7d32',
    prompt: 'Approving this submission will mark it as verified.',
  },
  rejected: {
    label:  'Reject',
    color:  'error',
    icon:   <CancelRounded />,
    bg:     '#ffebee',
    text:   '#c62828',
    prompt: 'Rejecting will notify the applicant. Please provide a reason.',
  },
  under_review: {
    label:  'Mark Under Review',
    color:  'info',
    icon:   <ManageSearchRounded />,
    bg:     '#e1f5fe',
    text:   '#0277bd',
    prompt: 'This will move the submission to the review queue.',
  },
};

export default function StatusUpdateModal({ open, onClose, submission }) {
  const updateStatus = useAdminStore((s) => s.updateStatus);
  const [targetStatus, setTargetStatus] = useState('');
  const [note,         setNote]         = useState('');
  const [loading,      setLoading]      = useState(false);
  const [result,       setResult]       = useState(null); // {success, error}

  const handleSelect = (status) => {
    setTargetStatus(status);
    setResult(null);
  };

  const handleConfirm = async () => {
    if (!targetStatus) return;
    setLoading(true);
    const res = await updateStatus(submission._id, targetStatus, note);
    setLoading(false);
    setResult(res);
   if (res.success) {

  // update current submission locally
  submission.status = targetStatus;
  submission.reviewNote = note;
  submission.reviewedAt = new Date();

  setTimeout(() => {
    setTargetStatus('');
    setNote('');
    setResult(null);

    onClose(true); // pass refresh flag
  }, 800);
}
  };

  const handleClose = () => {
    if (loading) return;
    setTargetStatus('');
    setNote('');
    setResult(null);
    onClose();
  };

  const cfg = STATUS_CONFIG[targetStatus];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 18 }}>
        Update Submission Status
      </DialogTitle>

      <DialogContent dividers>
        {/* Applicant info */}
        <Box sx={{ mb: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
          <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
            {submission?.firstName} {submission?.lastName}
          </Typography>
          <Typography sx={{ fontSize: 13, color: '#64748b' }}>
            {submission?.email} · {submission?.accountType}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Chip
              label={`Current: ${submission?.status?.replace('_', ' ') || 'submitted'}`}
              size="small"
              sx={{ fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}
            />
          </Box>
        </Box>

        {/* Status options */}
        <Typography sx={{ fontWeight: 600, fontSize: 13, mb: 1.5, color: '#475569' }}>
          Select new status:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
          {Object.entries(STATUS_CONFIG).map(([status, c]) => (
            <Box
              key={status}
              onClick={() => handleSelect(status)}
              sx={{
                px: 2, py: 1.5, borderRadius: 2, cursor: 'pointer',
                border: '2px solid',
                borderColor:   targetStatus === status ? c.text  : '#e2e8f0',
                bgcolor:       targetStatus === status ? c.bg    : '#fff',
                color:         targetStatus === status ? c.text  : '#64748b',
                fontWeight:    600, fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 1,
                transition: 'all 0.15s',
                '&:hover': { borderColor: c.text, bgcolor: c.bg },
              }}
            >
              {c.icon} {c.label}
            </Box>
          ))}
        </Box>

        {/* Prompt + note */}
        {cfg && (
          <>
            <Typography sx={{ fontSize: 13, color: cfg.text, mb: 2, fontWeight: 500 }}>
              {cfg.prompt}
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note for this status change..."
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </>
        )}

        {/* Result feedback */}
        {result && (
          <Box sx={{
            mt: 2, p: 1.5, borderRadius: 2,
            bgcolor: result.success ? '#e8f5e9' : '#ffebee',
            color:   result.success ? '#2e7d32' : '#c62828',
            fontSize: 13, fontWeight: 600,
          }}>
            {result.success ? '✓ Status updated successfully' : `✕ ${result.error}`}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={loading}
          sx={{ borderRadius: 2, textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!targetStatus || loading}
          sx={{
            borderRadius: 2, textTransform: 'none', fontWeight: 600,
            bgcolor: cfg?.text || '#6366f1',
            '&:hover': { bgcolor: cfg?.text || '#4f46e5', filter: 'brightness(0.9)' },
          }}
        >
          {loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : `Confirm ${cfg?.label || ''}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}