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
  Chip,
  Button,
  LinearProgress,
} from "@mui/material";

export default function ReviewTable({ submissions = [] }) {

  const getRiskColor = (score) => {
    if (score >= 75) return "#ef4444";
    if (score >= 50) return "#f59e0b";
    return "#10b981";
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "none",
        border: "1px solid #e5e7eb",
      }}
    >
      <Box p={3}>
        <Typography variant="h6" fontWeight="700">
          Under Review Queue
        </Typography>
      </Box>

      <TableContainer>
        <Table>

          <TableHead sx={{ background: "#fafafa" }}>
            <TableRow>

              <TableCell sx={{ fontWeight: 700 }}>
                APPLICANT
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>
                TYPE
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>
                RISK SCORE
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>
                STATUS
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>
                ACTION
              </TableCell>

            </TableRow>
          </TableHead>

          <TableBody>

            {submissions.map((item, index) => (

              <TableRow
                key={item._id || index}
                hover
              >

                {/* Applicant */}
                <TableCell>

                  <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >

                    <Avatar
                      sx={{
                        bgcolor: "#7c3aed",
                      }}
                    >
                      {item.firstName?.[0]}
                    </Avatar>

                    <Box>

                      <Typography fontWeight="600">
                        {item.firstName} {item.lastName}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {item.email}
                      </Typography>

                    </Box>

                  </Box>

                </TableCell>

                {/* Type */}
                <TableCell>
                  {item.accountType || "Individual"}
                </TableCell>

                {/* Risk */}
                <TableCell width={220}>

                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >

                    <LinearProgress
                      variant="determinate"
                      value={item.riskScore || 0}
                      sx={{
                        flex: 1,
                        height: 8,
                        borderRadius: 10,

                        "& .MuiLinearProgress-bar": {
                          backgroundColor: getRiskColor(
                            item.riskScore || 0
                          ),
                        },
                      }}
                    />

                    <Typography
                      fontWeight="700"
                      color={getRiskColor(item.riskScore || 0)}
                    >
                      {item.riskScore || 0}
                    </Typography>

                  </Box>

                </TableCell>

                {/* Status */}
                <TableCell>

                  <Chip
                    label={item.status || "under_review"}
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: 600,
                    }}
                  />

                </TableCell>

                {/* Action */}
                <TableCell>

                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                    }}
                  >
                    Review
                  </Button>

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>
      </TableContainer>
    </Card>
  );
}