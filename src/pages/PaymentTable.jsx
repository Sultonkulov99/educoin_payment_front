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
  Button,
  Box,
} from "@mui/material";

export default function PaymentsTable() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== API FETCH =====
  useEffect(() => {
    fetch("https://educoin.fixoo.uz/payments")
      .then((res) => res.json())
      .then((data) => {
        // Center -> Payments flatten
        const formatted = data.flatMap((center) =>
          center.payments.map((p) => ({
            id: p.id,
            centerName: center.name,
            startDate: p.startDate,
            endDate: p.endDate,
            paidVia: p.paidVia,
            amount: p.amount,
          }))
        );
        setPayments(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching payments:", err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ru-RU"); // 24.10.2025
  };

  const formatAmount = (value) => {
    return new Intl.NumberFormat("uz-UZ").format(value) + " so'm";
  };

  // ===== PAGINATION =====
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(payments.length / rowsPerPage);

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentPayments = payments.slice(indexOfFirst, indexOfLast);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  if (loading) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4, color: "gray" }}>
        Loading...
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Educoin to'lovlar jadvali
      </Typography>
      <TableContainer component={Paper} elevation={4}>
        <Table>
          <TableHead sx={{ backgroundColor: "primary.light" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>T/R</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Markaz nomi</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Boshlanish vaqti</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tugash vaqti</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>To'lov turi</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>To'lov miqdori</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPayments.map((payment, index) => (
              <TableRow key={payment.id} hover>
                <TableCell>
                  {(currentPage - 1) * rowsPerPage + (index + 1)}
                </TableCell>
                <TableCell>{payment.centerName}</TableCell>
                <TableCell>{formatDate(payment.startDate)}</TableCell>
                <TableCell>{formatDate(payment.endDate)}</TableCell>
                <TableCell>{payment.paidVia}</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "green" }}>
                  {formatAmount(payment.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mt: 3,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Typography variant="body1" sx={{ alignSelf: "center" }}>
            Page {currentPage} of {totalPages}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
}
