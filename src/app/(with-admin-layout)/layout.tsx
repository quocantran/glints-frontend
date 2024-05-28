import React from "react";

import { Metadata } from "next";
import "tippy.js/dist/tippy.css";
import "../../styles/AdminLayout.scss";
import Sidebar from "@/components/admin/Sidebar/Sidebar";
import StyledComponentsRegistry from "@/lib/antd.registry";
import { ConfigProvider } from "antd";
import vi_VN from "antd/lib/locale/vi_VN";
import StoreProvider from "../StoreProvider";
import LayoutAdmin from "@/components/layout/LayoutAdmin";
import "react-quill/dist/quill.snow.css";
export const metadata: Metadata = {
  title: "Glints - Kênh Tuyển Dụng - Trang Tìm Kiếm Việc Làm Uy Tín",
  description: "Welcome to Next.js",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="admin-wrapper">
        <div className="admin-container">
          <StoreProvider>
            <ConfigProvider locale={vi_VN}>
              <StyledComponentsRegistry>
                <LayoutAdmin>
                  <Sidebar />
                  <div className="admin-content">{children}</div>
                </LayoutAdmin>
              </StyledComponentsRegistry>
            </ConfigProvider>
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
