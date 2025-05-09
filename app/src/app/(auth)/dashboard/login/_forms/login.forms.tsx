"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { useAuth } from "@/app/(dashboard)/_ctx/auth.ctx";

// Define the Zod schema with optional validation
const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginForm = () => {
  const { login } = useAuth();
  // Initialize react-hook-form with the Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Submit handler
  const onSubmit = async (data: z.infer<typeof schema>) => {
    console.log(data);

    try {
      await login(data.username, data.password);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">What is your username?</legend>
          <input
            type="text"
            className="input"
            placeholder="Type here"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-red-400">{errors.username.message}</p>
          )}
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">What is your password?</legend>
          <input
            type="password"
            className="input"
            placeholder="Type here"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-400">{errors.password.message}</p>
          )}
        </fieldset>
      </div>
      <div className="card-actions justify-end mt-2">
        <button className="btn btn-primary">Login</button>
      </div>
    </form>
  );
};

export default LoginForm;
