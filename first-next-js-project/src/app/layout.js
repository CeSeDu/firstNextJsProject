import { Inter } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.css';
import BootstrapClient from "@/components/BootstrapClient.js";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ToDo App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className='{inter.className} bg-primary bg-opacity-25  container m-auto p-4 text-light'>{children}
      <BootstrapClient />
      </body>
    </html>
  );
}
