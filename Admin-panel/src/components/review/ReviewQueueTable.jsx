import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar,
  Box,
  Button,
} from "@mui/material";

import StatusChip from "../common/StatusChip";

import RiskScore from "./RiskScore";
import ReviewerSelect from "./ReviewerSelect";

export default function ReviewQueueTable({ data }) {
  return (
    <Card sx={{ borderRadius: 2 }}>
      <Box p={3}>
        <Typography variant="h6" fontWeight="bold">
          Under Review Queue
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead
            sx={{
              background: "#F9FAFB",
            }}
          >
            <TableRow>
              <TableCell>Applicant</TableCell>
               <TableCell>Type</TableCell>
              <TableCell>Risk Score</TableCell>
              <TableCell>Risk Factor</TableCell>

              <TableCell>Status</TableCell>

              <TableCell>Assign</TableCell>

              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((item) => (
          <TableRow
  key={
    item._id ||
    item.id ||
    item.email
  }
>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar>{item.name[0]}</Avatar>

                    <Box>
                      <Typography fontWeight="600">{item.name}</Typography>

                      <Typography variant="body2" color="text.secondary">
                        {item.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <RiskScore score={item.risk} />
                </TableCell>

                <TableCell>
                  <StatusChip status={item.status} />
                </TableCell>

                <TableCell>
                  <ReviewerSelect />
                </TableCell>

                <TableCell>
                  <Button variant="outlined">Review</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
