// app/layout.jsx

import "./globals.css";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";

export const metadata = {
  title: "Car Marketplace",
  description: "Buy and sell cars online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="pt-14 md:pt-16 lg:pt-16">
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
