import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import Home from "./pages/Home/Home";
import StudentLogin from "./pages/Login/StudentLogin";
import ManagerLogin from "./pages/Login/ManagerLogin";
import Signup from "./pages/Signup/Signup";
import ReportDetail from "./pages/ReportDetail/ReportDetail";
import ReportCreate from "./pages/ReportCreate/ReportCreate";
import ReportComplete from "./pages/ReportComplete/ReportComplete";
import MyReport from "./pages/MyReport/MyReport";
import MyReportDetail from "./pages/MyReportDetail/MyReportDetail";
import MyPage from "./pages/Mypage/Mypage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<StudentLogin />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login/manager" element={<ManagerLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reports/:id" element={<ReportDetail />} />
          <Route path="/student/report" element={<ReportCreate />} />
          <Route path="/reports/complete" element={<ReportComplete />} />
          <Route path="/my-report" element={<MyReport />} />
          <Route path="/my-report/:id" element={<MyReportDetail />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
