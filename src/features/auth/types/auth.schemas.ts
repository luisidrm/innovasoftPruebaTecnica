import { z } from 'zod';
// Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/;
// Register Request schema
export const RegisterRequestSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be 20 characters or less')
    .regex(
      passwordRegex,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
});
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
// Register Response schema
export const RegisterResponseSchema = z.object({
  status: z.string(),
  message: z.string()
});
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
// Login Request schema
export const LoginRequestSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
// Login Response schema
export const LoginResponseSchema = z.object({
  token: z.string(),
  expiration: z.string(),
  userid: z.string(),
  username: z.string()
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;