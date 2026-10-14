import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import Home from "./pages/Home/Home";
import StudentLogin from "./pages/Login/StudentLogin";
import ManagerLogin from "./pages/Login/ManagerLogin";
import Signup from "./pages/Signup/Signup";
import ReportDetail from "./pages/ReportDetail/ReportDetail";
import ReportCreate from "./pages/ReportCreate/ReportCreate";
import ReportComplete from "./pages/ReportComplete/ReportComplete";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/login/manager" element={<ManagerLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reports/:id" element={<ReportDetail />} />
          <Route path="/student/report" element={<ReportCreate />} />
          <Route path="/reports/complete" element={<ReportComplete />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
