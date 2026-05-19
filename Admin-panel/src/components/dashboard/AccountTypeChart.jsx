import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  Typography,
  Box,
} from "@mui/material";

export default function AccountTypeChart({
  byType = {},
}) {

  const data = [
    {
      name: "Individual",
      value: byType.individual || 0,
      color: "#F59E0B",
    },
    {
      name: "Business",
      value: byType.business || 0,
      color: "#0EA5E9",
    },
    {
      name: "Enterprise",
      value: byType.enterprise || 0,
      color: "#6366F1",
    },
  ];

  return (

    <Card
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        height: 400,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid",
        borderColor: "divider",
      }}
    >

      <Typography
        variant="subtitle1"
        fontWeight="700"
      >
        Account Type Split
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
        mb={2}
      >
        All submissions
      </Typography>

      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
        }}
      >

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={data}
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={5}
              dataKey="value"
            >

              {data.map((entry, index) => (

                <Cell
                  key={index}
                  fill={entry.color}
                  stroke="none"
                />

              ))}

            </Pie>

          </PieChart>

        </ResponsiveContainer>

      </Box>

      <Box
        display="flex"
        justifyContent="center"
        gap={3}
        mt={2}
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          pt: 2,
        }}
      >

        {data.map((item) => (

          <Box
            key={item.name}
            display="flex"
            alignItems="center"
            gap={1}
          >

            <Box
              sx={{
                width: 16,
                height: 8,
                borderRadius: "4px",
                bgcolor: item.color,
              }}
            />

            <Typography
              variant="caption"
              fontWeight="700"
              color="text.secondary"
            >
              {item.name} ({item.value})
            </Typography>

          </Box>

        ))}

      </Box>

    </Card>
  );
}