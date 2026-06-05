import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corpse Admin",
  description: "Corpse Arena Admin Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#0a0a0a" }}>
        {children}
      </body>
    </html>
  );
}