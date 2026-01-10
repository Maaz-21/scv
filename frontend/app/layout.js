import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "ScanvengerHunt Marketplace",
  description: "A marketplace for buying and selling scrap items securely.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
