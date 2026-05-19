import {
  Box,
  Grid,
  Card,
  Typography,
  TextField,
  Button,
  Switch,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

export default function Settings() {
  return (
    <Box>
      <Typography variant="h5" fontWeight="700" >
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Admin Profile Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider", height: '100%' }}>
            <Typography variant="subtitle1" fontWeight="700" mb={3}>
              Admin Profile
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                label="FULL NAME"
                defaultValue="Super Admin"
                variant="standard"
                InputLabelProps={{ shrink: true, sx: { fontWeight: 700, fontSize: '0.75rem' } }}
              />
              <TextField
                margin="normal"
                fullWidth
                label="EMAIL"
                defaultValue="admin@company.com"
                variant="standard"
                InputLabelProps={{ shrink: true, sx: { fontWeight: 700, fontSize: '0.75rem' } }}
              />
              <Button variant="contained" sx={{ mt: 3, borderRadius: 2, textTransform: 'none', px: 3, bgcolor: '#5B5FEF' }}>
                Save Changes
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Notification Preferences Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="subtitle1" fontWeight="700" mb={2}>
              Notification Preferences
            </Typography>
            <List disablePadding>
              <NotificationItem title="New Submission" subtitle="Alert on every new entry" defaultChecked />
              <Divider />
              <NotificationItem title="High Risk Flagged" subtitle="Risk score > 60" defaultChecked />
              <Divider />
              <NotificationItem title="Document Uploaded" subtitle="New file attached" />
              <Divider />
              <NotificationItem title="Status Changed" subtitle="Approved / Rejected" defaultChecked />
            </List>
          </Card>
        </Grid>

        {/* Risk Score Thresholds Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="subtitle1" fontWeight="700" mb={3}>
              Risk Score Thresholds
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="MEDIUM RISK (>=)" defaultValue="30" variant="standard" fullWidth InputLabelProps={{ shrink: true, sx: { fontWeight: 700, fontSize: '0.75rem' } }} />
              <TextField label="HIGH RISK (>=)" defaultValue="60" variant="standard" fullWidth InputLabelProps={{ shrink: true, sx: { fontWeight: 700, fontSize: '0.75rem' } }} />
              <TextField label="CRITICAL RISK (>=)" defaultValue="80" variant="standard" fullWidth InputLabelProps={{ shrink: true, sx: { fontWeight: 700, fontSize: '0.75rem' } }} />
              <Button variant="contained" sx={{ mt: 1, width: 'fit-content', borderRadius: 2, textTransform: 'none', px: 3, bgcolor: '#5B5FEF' }}>
                Update
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Required Documents Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="subtitle1" fontWeight="700" mb={2}>
              Required Documents
            </Typography>
            <List disablePadding>
              <DocumentItem title="Government ID" defaultChecked />
              <Divider />
              <DocumentItem title="Proof of Address" defaultChecked />
              <Divider />
              <DocumentItem title="Tax Registration" />
              <Divider />
              <DocumentItem title="Compliance Certificate" />
            </List>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

// Helper component for switches with subtitles
function NotificationItem({ title, subtitle, defaultChecked = false }) {
  return (
    <ListItem sx={{ px: 0, py: 1.5 }} secondaryAction={<Switch defaultChecked={defaultChecked} color="primary" />}>
      <ListItemText
        primary={<Typography variant="body2" fontWeight="600">{title}</Typography>}
        secondary={<Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
      />
    </ListItem>
  );
}

// Helper component for document switches
function DocumentItem({ title, defaultChecked = false }) {
  return (
    <ListItem sx={{ px: 0, py: 1 }} secondaryAction={<Switch defaultChecked={defaultChecked} color="primary" />}>
      <ListItemText primary={<Typography variant="body2" fontWeight="500">{title}</Typography>} />
    </ListItem>
  );
}