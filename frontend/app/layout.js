import "../styles/globals.css";
import Link from "next/link";

export const metadata = {
  title: "BIBSPORT",
  description: "Result ini di buat oleh tim BIBSPORT dari PT. GALIH JAVA PRODUCTION",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link
          rel="icon"
          href="https://bibsport.id/assets/img/favicon.png"
          type="image/png"
        />
        <link
          rel="apple-touch-icon"
          href="https://bibsport.id/assets/img/apple-touch-icon.png"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
