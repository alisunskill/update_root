import Navbar from "./Navbar";
import Footer from "./Footer";
import React, { useState } from "react";

export default function Layout({ children }) {
  console.count('layout>>>>>')
  return (
    <div>
      <Navbar />
      <main> {children}</main>
      <Footer />
    </div>
  );
}
