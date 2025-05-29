import React from "react";
import TabsComp, { Tab } from "@/components/Tabs";

import { Tabs as TabsInterface } from "@/payload-types";

const Tabs: React.FC<TabsInterface> = ({ tabs }) => {
  return (
    <TabsComp>
      {tabs?.map((tabInfo) => (
        <Tab key={tabInfo.id} href={tabInfo.link}>
          {tabInfo.label}
        </Tab>
      ))}
    </TabsComp>
  );
};

export default Tabs;
