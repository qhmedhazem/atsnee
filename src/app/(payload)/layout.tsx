import "@payloadcms/next/css";

import React from "react";
import type { ServerFunctionClient } from "payload";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import config from "@payload-config";

import { importMap } from "./admin/importMap";

import { Montserrat } from "next/font/google";
const mont = Montserrat({ subsets: ["cyrillic"] });

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: Args) => (
  <RootLayout
    config={config}
    importMap={importMap}
    serverFunction={serverFunction}
  >
    <div className={mont.className}>{children}</div>
  </RootLayout>
);

export default Layout;
