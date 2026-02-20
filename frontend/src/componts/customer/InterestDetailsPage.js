
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TableFooter,
  TablePagination,
} from "@mui/material";
import dayjs from "dayjs";
import api from "../../utils/api";

const InterestDetailsPage = () => {
  const [interestData, setInterestData] = useState([]);
  const [page, setPage] = useState(0); // current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // rows per page

  useEffect(() => {
    fetchInterestData();
  }, []);

  const fetchInterestData = async () => {
    try {
      const res = await api.get("/api/interests");
      setInterestData(res.data);
    } catch (err) {
      console.error("Error fetching interest details:", err);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Slice data for current page
  const paginatedData = interestData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box p={8}>
      <Typography variant="h5" gutterBottom>
        Interest Details
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ background: "#000", color: "#fff" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>S.No</TableCell>
              <TableCell sx={{ color: "#fff" }}>Customer Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Item</TableCell>
              <TableCell sx={{ color: "#fff" }}>Total Loan Amount</TableCell>
              <TableCell sx={{ color: "#fff" }}>Date</TableCell>
              <TableCell sx={{ color: "#fff" }}>Paid Amount</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={row._id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{row.customerName}</TableCell>
                <TableCell>{row.itemCode}</TableCell>
                <TableCell>{row.totalLoanAmount}</TableCell>
                <TableCell>{dayjs(row.paidDate).format("DD-MM-YYYY")}</TableCell>
                <TableCell>{row.paidAmount}</TableCell>
              </TableRow>
            ))}

            {interestData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                colSpan={6}
                count={interestData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Rows per page"
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InterestDetailsPage;
