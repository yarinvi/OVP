const { z } = require("zod");

const expenseIdValidation = z.string().regex(/^[0-9a-fA-F]{24}$/, {
  message: "invalid expense id",
});
const expenseScheme = z.object({
  title: z.string(),
  description: z.string().optional(),
  amount: z.number(),
  tag: z.enum([
    "food",
    "rent",
    "transport",
    "clothing",
    "entertainment",
    "health",
    "education",
    "other",
  ]),
  currency: z.enum(["ILS", "USD", "EUR"]),
});

module.exports = { expenseIdValidation, expenseScheme };
