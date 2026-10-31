import { Box, MenuItem, Paper, TextField } from "@mui/material";

import { Search } from "@mui/icons-material";

export default function PatientSearch({
  search,
  setSearch,
  balanceFilter,
  setBalanceFilter,
}) {
  return (
    <Paper
      sx={{
        p: 2,

        borderRadius: 3,

        border: "1px solid #eee3c5",

        mb: 3,
      }}
    >
      <Box display="flex" gap={2} flexWrap="wrap">
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patients..."
          sx={{
            flex: "1 1 260px",
            "& fieldset": {
              borderColor: "#eee3c5",
            },
          }}
          InputProps={{
            startAdornment: (
              <Search
                sx={{
                  mr: 1,
                  color: "#999",
                }}
              />
            ),
          }}
        />
        <TextField
          select
          label="Payment balance"
          value={balanceFilter}
          onChange={(e) => setBalanceFilter(e.target.value)}
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="all">All patients</MenuItem>
          <MenuItem value="unpaid">Has remaining balance</MenuItem>
        </TextField>
      </Box>
    </Paper>
  );
}
