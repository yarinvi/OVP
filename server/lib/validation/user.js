const { z } = require("zod");

const userIdValidation = z.string().regex(/^[0-9a-fA-F]{24}$/, {
  message: "invalid user id",
});

const usernameValidation = z
  .string()
  .min(3, {
    message: "Username must be at least 3 characters long",
  })
  .max(20, {
    message: "Username must be at most 20 characters long",
  })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username must contain only letters, numbers, and underscores",
  });
const fullNameValidation = z
  .string()
  .min(4, {
    message: "Full name must be at least 4 characters long",
  })
  .max(20, {
    message: "Full name must be at most 20 characters long",
  })
  .regex(/^[a-zA-Z\s]*$/)
  .refine((data) => data.trim().split(" ").length > 1, {
    message: "Full name must contain only letters and spaces",
  });

const passwordValidation = z
  .string()
  .min(8, {
    message: "Password must be at least 8 characters long",
  })
  .max(15, {
    message: "Password must be at most 15 characters long",
  });
const updatedUsernameValidation = z
  .string()
  .min(3, {
    message: "Username must be at least 3 characters long",
  })
  .max(20, {
    message: "Username must be at most 20 characters long",
  })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username must contain only letters, numbers, and underscores",
  })
  .optional();

const updatedPasswordValidation = z
  .string()
  .min(8, {
    message: "Password must be at least 8 characters long",
  })
  .max(15, {
    message: "Password must be at most 15 characters long",
  })
  .optional();

const signUpSchema = z.object({
  fullName: fullNameValidation,
  username: usernameValidation,
  email: z.string().email(),
  password: passwordValidation,
});

const signInSchema = z.object({
  username: usernameValidation,
  password: passwordValidation,
});

const updatedUserScheme = z.object({
  fullName: fullNameValidation,
  username: updatedUsernameValidation,
  email: z.string().email().optional(),
  password: updatedPasswordValidation,
});

module.exports = {
  signUpSchema,
  signInSchema,
  userIdValidation,
  updatedUserScheme,
};
