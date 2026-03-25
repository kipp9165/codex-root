export const metadata = {
  title: "Invention Radar v0.1",
  description: "Real-time invention intelligence by Codex Labs"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
