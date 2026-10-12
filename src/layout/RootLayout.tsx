import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="w-full min-h-screen bg-[#F5F6F3]">
      <Outlet />
    </div>
  );
}