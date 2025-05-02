import { Provider } from "../components/ui/provider";
import { Providers } from "./Providers";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body>
      <Providers>
        <Provider>
        {children}
        </Provider>
        </Providers>
      </body>
    </html>
  );
}
