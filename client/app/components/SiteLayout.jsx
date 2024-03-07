"use client";
import { Layout } from "antd";
import { chainName } from "../utils/config";
import "antd/dist/reset.css";

const { Header, Footer, Content } = Layout;

export default function SiteLayout({ children }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 99,
          width: "100%",
          // display: "flex",
          alignItems: "center"
        }}
      >
        <p
          style={{
            textAlign: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "15px"
          }}
        >
          ERC20 Tracker
          <small style={{ fontSize: "10px" }}> {chainName}</small>
        </p>
      </Header>
      <Content
        style={{
          margin: "12px 8px",
          padding: 8,
          minHeight: "100%",
          color: "black",
          maxHeight: "100%"
        }}
      >
        {children}
      </Content>
      <Footer style={{ textAlign: "center" }}>
        <a
          href="https://github.com/Salmandabbakuti"
          target="_blank"
          rel="noopener noreferrer"
        >
          ©{new Date().getFullYear()} ERC20 Tracker. Powered by TheGraph &
          Next.js
        </a>
        <p style={{ fontSize: "12px" }}>v0.0.1</p>
      </Footer>
    </Layout>
  );
}
