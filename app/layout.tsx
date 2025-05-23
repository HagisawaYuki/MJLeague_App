import { Suspense } from "react";
import Header from "../components/Header";
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
        <Suspense>
          <Providers>
            <Provider>
              <Header></Header>
              {children}
            </Provider>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
