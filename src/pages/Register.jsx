// Register.js
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { register } from "@/features/auth/authSlice";
import { useState } from "react";

const formSchema = z
  .object({
    email: z.string().email(),
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    password: z
      .string()
      .min(8, { message: "Too short" })
      .max(15, { message: "Too long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values) => {
    setSubmitting(true);
    const userData = {
      email: values.email,
      name: values.username,
      password: values.password,
      re_password: values.confirmPassword,
    };
    try {
      await dispatch(register(userData)).unwrap();
      setSubmitting(false);
      toast.success("An Activation mail has been sent to your email");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="h-screen lg:h-screen w-screen flex flex-col lg:gap-2 justify-center items-center bg-black py-6 px-4">
      <Link
        to="/"
        className="flex items-center mb-6 text-lg lg:text-2xl font-bold text-white "
      >
        <img
          className="w-6 h-6 lg:w-8 lg:h-8 mr-2"
          src="/assets/logo.png"
          alt="logo"
        />
        SNIPPIFY
      </Link>
      <div className="flex flex-col gap-4 rounded-xl shadow-2xl bg-white px-10 py-8 w-80 lg:w-96">
        <h1 className="text-lg leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
          Create an account
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="re-enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-sm text-gray-500 text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-rose-600 font-medium hover:underline"
              >
                Login here
              </Link>
            </p>
            {submitting ? (
              <Button
                type="submit"
                className="w-full bg-rose-600 text-white hover:bg-rose-500"
                disabled={submitting}
              >
                Loading...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-rose-600 text-white hover:bg-rose-500"
              >
                Register
              </Button>
            )}
          </form>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
