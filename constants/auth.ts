import { z } from "zod";

export const LoginSchema = z.object({
    username: z.string().nonempty("Username/Email is required").max(50, "Email must be at most 50 characters"),
    password: z.string().nonempty("Password is required").min(6, "Password must be at least 6 characters").max(50, "Password must be at most 50 characters"),
});


export const RegisterSchema = z.object({
    fullname: z.string().nonempty("Name is required").min(3, "Name must be at least 3 characters").max(50, "Name must be at most 50 characters"),
    email: z.string().nonempty("Email is required").email("Invalid email").max(50, "Email must be at most 50 characters"),
    password: z.string().nonempty("Password is required").min(6, "Password must be at least 6 characters").max(50, "Password must be at most 50 characters"),
});

export type LoginDTO = z.infer<typeof LoginSchema>;
export type RegisterDTO = z.infer<typeof RegisterSchema>;