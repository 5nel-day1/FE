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
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AdminProblemDetail from "./pages/AdminProblemDetail/AdminProblemDetail";
import AdminRelatedReports from "./pages/AdminRelatedReports/AdminRelatedReports";
import AdminResolution from "./pages/AdminResolution/AdminResolution";

import { Toaster } from "sonner";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          {/* 학생 */}
          <Route path="/" element={<StudentLogin />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />

          {/* 관리자 로그인 */}
          <Route path="/admin/login" element={<ManagerLogin />} />

          {/* 제보 */}
          <Route path="/reports/:id" element={<ReportDetail />} />
          <Route path="/student/report" element={<ReportCreate />} />
          <Route path="/reports/complete" element={<ReportComplete />} />

          {/* 내 제보 */}
          <Route path="/my-report" element={<MyReport />} />
          <Route path="/my-report/:id" element={<MyReportDetail />} />

          {/* 마이페이지 */}
          <Route path="/mypage" element={<MyPage />} />

          {/* 관리자 대시보드 */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* 신규 등록 제보 상세 */}
          <Route
            path="/admin/problems/submitted/:reportId"
            element={<AdminProblemDetail />}
          />

          {/* 기존 문제 상세 */}
          <Route
            path="/admin/problems/:problemId"
            element={<AdminProblemDetail />}
          />

          {/* 관련 제보 */}
          <Route
            path="/admin/problems/:problemId/reports"
            element={<AdminRelatedReports />}
          />

          {/* 처리 결과 */}
          <Route
            path="/admin/problems/:problemId/resolution"
            element={<AdminResolution />}
          />
        </Route>
      </Routes>

      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}
