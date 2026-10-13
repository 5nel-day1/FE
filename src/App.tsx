import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import Main from "./pages/Main/Main";
import StudentLogin from "./pages/Login/StudentLogin";
import ManagerLogin from "./pages/Login/ManagerLogin";
import Signup from "./pages/Signup/Signup";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/login/manager" element={<ManagerLogin />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
