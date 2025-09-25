import { BrowserRouter, Route, Routes } from "react-router-dom"
import Payment from "./pages/Payment"
import PaymentsTable from "./pages/PaymentTable"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/payment" element= {<Payment/>} />
        <Route path="/payment/info" element= {<PaymentsTable/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App