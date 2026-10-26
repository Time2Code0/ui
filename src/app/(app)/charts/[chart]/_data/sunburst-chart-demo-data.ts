import type { SunburstNode } from "../_charts";

export const sunburstDemoData: SunburstNode = {
  children: [
    {
      children: [
        {
          children: [
            {
              children: [
                { name: "Direct", value: 52 },
                { name: "Channel", value: 38 },
              ],
              name: "North America",
            },
            { name: "EMEA", value: 60 },
            { name: "APAC", value: 48 },
          ],
          name: "Enterprise",
        },
        {
          children: [
            { name: "Teams", value: 90 },
            { name: "Solo", value: 55 },
          ],
          name: "Pro",
        },
        { name: "Starter", value: 95 },
      ],
      name: "Product",
    },
    {
      children: [
        {
          children: [
            { name: "Strategy", value: 72 },
            { name: "Implementation", value: 88 },
          ],
          name: "Consulting",
        },
        {
          children: [
            { name: "Premium", value: 48 },
            { name: "Standard", value: 42 },
          ],
          name: "Support",
        },
        { name: "Training", value: 55 },
      ],
      name: "Services",
    },
    {
      children: [
        { name: "Referrals", value: 120 },
        { name: "Affiliates", value: 75 },
        {
          children: [
            { name: "Regional", value: 64 },
            { name: "Global", value: 46 },
          ],
          name: "Resellers",
        },
      ],
      name: "Partners",
    },
    {
      children: [
        { name: "Licensing", value: 85 },
        { name: "Events", value: 42 },
      ],
      name: "Other",
    },
  ],
  name: "Revenue",
};
