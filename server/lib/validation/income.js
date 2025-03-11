const { z } = require("zod");

const incomeIdValidation = z.string().regex(/^[0-9a-fA-F]{24}$/, {
  message: "invalid income id",
});
const incomeScheme = z.object({
  title: z.string(),
  description: z.string().optional(),
  amount: z.number(),
  tag: z.enum(["salary", "bonus", "gift", "other"]),
  currency: z.enum(["ILS", "USD", "EUR"]),
});

module.exports = { incomeScheme, incomeIdValidation };
