import "@/styles/globals.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { QueryClient, QueryClientProvider } from "react-query";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import { APP_CONFIG } from "@/constants";
import OnlyMobile from "@/components/OnlyMobile";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{APP_CONFIG.APP_PAGE_TITLE}</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <OnlyMobile>
          <div className="md:container flex-col relative px-[16px] pb-28 overflow-hidden">
            <div className="mx-auto w-full">
              <ThirdwebProvider activeChain="ethereum">
                <Component {...pageProps} />
              </ThirdwebProvider>
            </div>
          </div>
          <Toaster
            toastOptions={{
              className: "font-dm-sans",
              duration: 5000,
            }}
          />
        </OnlyMobile>
      </QueryClientProvider>
    </>
  );
}
