import type { FunctionComponent, ReactNode } from "react";
import Head from "next/head";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface Props {
  children: ReactNode;
}

const Layout: FunctionComponent<Props> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Flow App</title>
        <meta name="title" content="Flow App" />
        <meta name="description" content="flow trading web app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen flex-col">
        <Navbar
          links={[
            {
              label: "Home",
              href: "/",
            },
            {
              label: "Chart",
              href: "/chart",
            },
            {
              label: "Transactions",
              href: "/transactions",
            },
          ]}
        />
        <main className="mt-32 sm:mt-16">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
