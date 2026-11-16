import { EcommerceProvider } from "@payloadcms/plugin-ecommerce/client/react";
import { stripeCheckoutAdapterClient } from "@/payments/stripeCheckout/client";
import React from "react";

import { HeaderThemeProvider } from "./HeaderTheme";
import { ThemeProvider } from "./Theme";
import { SonnerProvider } from "@/providers/Sonner";

export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <SonnerProvider />
        <EcommerceProvider
          enableVariants={true}
          api={{
            cartsFetchQuery: {
              depth: 2,
              populate: {
                products: {
                  slug: true,
                  title: true,
                  gallery: true,
                  inventory: true,
                },
                variants: {
                  title: true,
                  inventory: true,
                },
              },
            },
          }}
          paymentMethods={[stripeCheckoutAdapterClient()]}
        >
          {children}
        </EcommerceProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  );
};
