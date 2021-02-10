import React from "react";
import Layout from "./layout";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}

export const decorators = [
  (Story) => (
    <Layout>
      <Story />
    </Layout>
  )
]
