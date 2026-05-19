import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer, Box, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, Divider, Badge, Chip,
} from '@mui/material';
import {
  DashboardRounded, PeopleAltRounded, ManageSearchRounded,
  CheckCircleRounded, CancelRounded, FolderRounded, SettingsRounded,
} from '@mui/icons-material';
import { useAdminStore } from '../../store/adminStore';

const NAV = [
  { label: 'MAIN' },
  { label: 'Dashboard',       path: '/',            icon: <DashboardRounded fontSize="small" /> },
  { label: 'All Submissions', path: '/submissions', icon: <PeopleAltRounded fontSize="small" /> },
  { label: 'Under Review',    path: '/UnderReview',      icon: <ManageSearchRounded fontSize="small" />, badge: true },
  { label: 'Approved',        path: '/approved',    icon: <CheckCircleRounded fontSize="small" /> },
  { label: 'Rejected',        path: '/rejected',    icon: <CancelRounded fontSize="small" /> },
  { label: 'RESOURCES' },
  { label: 'Documents',       path: '/documents',   icon: <FolderRounded fontSize="small" /> },
  { label: 'Settings',        path: '/settings',    icon: <SettingsRounded fontSize="small" /> },
];

export default function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const getStats  = useAdminStore((s) => s.getStats);
  const stats     = getStats();

  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0, '& .MuiDrawer-paper': { width: 240 } }}>
      {/* Logo */}
      <Box sx={{ px: 2.5, py: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: 2,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 800, color: '#fff',
        }}>A</Box>
        <Box>
          <Typography sx={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>
            AdminOS
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: 11, letterSpacing: '0.05em' }}>
            Onboarding Panel
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 2 }} />

      {/* Nav */}
      <List sx={{ px: 1, py: 2, flex: 1 }}>
        {NAV.map((item, i) =>
          !item.path ? (
            <Typography key={i} sx={{
              px: 2, pt: i === 0 ? 0 : 2, pb: 0.5,
              fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
              color: '#334155', textTransform: 'uppercase',
            }}>
              {item.label}
            </Typography>
          ) : (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{ py: 1, gap: 0 }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: location.pathname === item.path ? '#818cf8' : '#475569' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 13,
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  color: location.pathname === item.path ? '#e2e8f0' : '#94a3b8',
                }}
              />
              {item.badge && stats.pending > 0 && (
                <Chip
                  label={stats.pending}
                  size="small"
                  sx={{ height: 20, fontSize: 11, fontWeight: 700,
                        background: '#6366f1', color: '#fff', minWidth: 28 }}
                />
              )}
            </ListItemButton>
          )
        )}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 2 }} />

      {/* Admin profile */}
      <Box sx={{ px: 2.5, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', fontSize: 13, fontWeight: 700 }}>
          SA
        </Avatar>
        <Box>
          <Typography sx={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>Super Admin</Typography>
          <Typography sx={{ color: '#475569', fontSize: 11 }}>Full Access</Typography>
        </Box>
      </Box>
    </Drawer>
  );
}
