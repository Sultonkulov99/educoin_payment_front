import React, { useEffect, useState } from "react";

export default function PaymentForm() {
  const [centerId, setCenterId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [amount, setAmount] = useState("");
  const [amountDisplay, setAmountDisplay] = useState("");
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await fetch("https://educoin.fixoo.uz/centers");
        const data = await res.json();
        setCenters(data);
      } catch (error) {
        console.error("Centersni olishda xatolik:", error);
      }
    };
    fetchCenters();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      alert("✅ To‘lovingiz muvofaqiyatli bo‘ldi!");
      // agar qayta qaytishda yana chiqmasin desangiz:
      // window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleAmountChange = (e) => {
    // faqat raqamlarni olib qolamiz
    const rawValue = e.target.value.replace(/\D/g, "");

    setAmount(rawValue);

    if (rawValue) {
      setAmountDisplay(
        new Intl.NumberFormat("uz-UZ").format(Number(rawValue))
      );
    } else {
      setAmountDisplay("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://educoin.fixoo.uz/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ centerId, fromDate, toDate, amount }),
      });

      const data = await res.json();

      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert("Xatolik: to'lov linkini olishning imkoni bo'lmadi!");
      }

      setCenterId("");
      setFromDate("");
      setToDate("");
      setAmount("");
      setAmountDisplay("");
    } catch (error) {
      console.error(error);
      alert("Server bilan bog'lanishda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          To‘lov qilish
        </h2>
        <p className="text-center text-gray-500 text-sm">
          Markaz uchun to‘lovni amalga oshiring
        </p>

        <div>
          <label className="block text-gray-600 mb-2 font-medium">
            Markazni tanlang
          </label>
          <select
            value={centerId}
            onChange={(e) => setCenterId(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
            required
          >
            <option value="">-- Markaz tanlang --</option>
            {centers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-600 mb-2 font-medium">
            Qaysi sanadan
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-2 font-medium">
            Qaysi sanagacha
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-2 font-medium">
            Summa (so'm)
          </label>
          <input
            type="text"
            value={amountDisplay}
            onChange={handleAmountChange}
            placeholder="Masalan: 500 000"
            className="w-full border border-gray-300 rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl py-3 font-semibold shadow-lg hover:scale-[1.02] transition-transform duration-200 disabled:opacity-50"
        >
          {loading ? "Yuklanmoqda..." : "To‘lash"}
        </button>
      </form>
    </div>
  );
}
