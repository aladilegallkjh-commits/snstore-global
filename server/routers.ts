import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { createOrder, createProductVariant, getPublishedProducts, getPublishedProductsWithVariants, getStoreSettings, saveStoreSettings, updateProductVariant } from "./db";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  catalog: router({
    published: publicProcedure.query(() => getPublishedProducts()),
    settings: publicProcedure.query(() => getStoreSettings()),
    publishedWithVariants: publicProcedure.query(() => getPublishedProductsWithVariants()),
  }),
  orders: router({
    create: publicProcedure.input(z.object({ customerName: z.string().optional(), city: z.string().optional(), state: z.string().optional(), subtotal: z.string(), items: z.array(z.object({ productName: z.string(), variantLabel: z.string().optional(), quantity: z.number().int().positive(), unitPrice: z.string() })) })).mutation(({ input }) => createOrder(input)),
  }),
  admin: router({
    createVariant: adminProcedure.input(z.object({ productId: z.number().int().positive(), storage: z.string().optional(), ram: z.string().optional(), color: z.string().optional(), simType: z.string().optional(), price: z.string().optional(), promotionalPrice: z.string().optional(), sku: z.string().min(1), stock: z.number().int().min(0), status: z.enum(["Disponível", "Indisponível", "Reservado", "Vendido", "Sob consulta"]), supplierLot: z.string().optional() })).mutation(({ input }) => createProductVariant(input)),
    updateVariant: adminProcedure.input(z.object({ id: z.number().int().positive(), storage: z.string().optional(), ram: z.string().optional(), color: z.string().optional(), simType: z.string().optional(), price: z.string().optional(), promotionalPrice: z.string().optional(), sku: z.string().min(1).optional(), stock: z.number().int().min(0).optional(), status: z.enum(["Disponível", "Indisponível", "Reservado", "Vendido", "Sob consulta"]).optional(), supplierLot: z.string().optional() })).mutation(({ input }) => { const { id, ...values } = input; return updateProductVariant(id, values); }),
    saveSettings: adminProcedure.input(z.object({ storeName: z.string().min(1), whatsapp: z.string().optional(), instagram: z.string().optional(), email: z.string().optional(), description: z.string().optional(), defaultWhatsappMessage: z.string().optional(), defaultWarranty: z.string().optional(), stockNotice: z.string().optional(), cpoExplanation: z.string().optional() })).mutation(({ input }) => saveStoreSettings(input)),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
