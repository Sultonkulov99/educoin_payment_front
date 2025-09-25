import React, { useEffect, useState } from "react";

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
    return d.toLocaleDateString("ru-RU"); // 24.10.2025 format
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
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl font-bold mb-4">Educoin to'lovlar jadvali</h2>
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full bg-white text-sm sm:text-base">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">T/R</th>
              <th className="px-6 py-3 text-left font-semibold">Markaz nomi</th>
              <th className="px-6 py-3 text-left font-semibold">Boshlanish vaqti</th>
              <th className="px-6 py-3 text-left font-semibold">Tugash vaqti</th>
              <th className="px-6 py-3 text-left font-semibold">To'lov turi</th>
              <th className="px-6 py-3 text-left font-semibold">To'lov miqdori</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentPayments.map((payment, index) => (
              <tr
                key={payment.id}
                className="hover:bg-blue-50 transition duration-200"
              >
                <td className="px-4 py-3 text-gray-600">
                  {(currentPage - 1) * rowsPerPage + (index + 1)}
                </td>
                <td className="px-6 py-3 font-medium">{payment.centerName}</td>
                <td className="px-6 py-3">{formatDate(payment.startDate)}</td>
                <td className="px-6 py-3">{formatDate(payment.endDate)}</td>
                <td className="px-6 py-3">{payment.paidVia}</td>
                <td className="px-6 py-3 font-semibold text-green-600">
                  {formatAmount(payment.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-4 space-x-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
