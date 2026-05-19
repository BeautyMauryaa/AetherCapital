import React, { useState } from 'react';
import {
  AppBar, Toolbar, InputAdornment, TextField, IconButton,
  Avatar, Badge, Box, Typography,
} from '@mui/material';
import { SearchRounded, NotificationsRounded, BugReportRounded } from '@mui/icons-material';
import { useAdminStore } from '../../store/adminStore';

export default function Topbar({ title }) {
  const setSearch   = useAdminStore((s) => s.setSearch);
  const [val, setVal] = useState('');

  const handleSearch = (e) => {
    setVal(e.target.value);
    setSearch(e.target.value);
  };

  return (
    <AppBar position="static" elevation={0} sx={{
      background: '#fff',
      borderBottom: '1px solid #e2e8f0',
      color: '#0f172a',
    }}>
      <Toolbar sx={{ gap: 2, minHeight: '64px !important' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', flex: 'none' }}>
          {title}
        </Typography>

        <Box sx={{ flex: 1 }} />

        {/* Search */}
        <TextField
          size="small"
          placeholder="Search submissions..."
          value={val}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded sx={{ color: '#94a3b8', fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: 280,
            '& .MuiOutlinedInput-root': {
              background: '#f8fafc',
              '& fieldset': { borderColor: '#e2e8f0' },
              '&:hover fieldset': { borderColor: '#cbd5e1' },
            },
          }}
        />

        {/* Notifications */}
        <IconButton size="small" sx={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}>
          <Badge badgeContent={3} color="warning" sx={{ '& .MuiBadge-badge': { fontSize: 10 } }}>
            <NotificationsRounded sx={{ fontSize: 20, color: '#64748b' }} />
          </Badge>
        </IconButton>

        <IconButton size="small" sx={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}>
          <Badge badgeContent={5} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 10 } }}>
            <BugReportRounded sx={{ fontSize: 20, color: '#64748b' }} />
          </Badge>
        </IconButton>

        <Avatar sx={{
          width: 36, height: 36,
          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
        }}>
          SA
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}
