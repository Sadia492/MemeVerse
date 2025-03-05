"use client";
import { authContext } from "@/providers/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginImg from "@/assets/Login-bro.png";
import Image from "next/image";

export default function page() {
  const [show, setShow] = useState(false);
  const router = useRouter();
  // const pathname = usePathname();
  const { signInUser, setUser } = useContext(authContext);
  const handleLogin = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    signInUser(email, password)
      .then((result) => {
        setUser(result.user);
        toast.success("Login successful");
        router.push("/");
      })
      .catch((error) => {
        toast.error(error.code);
      });
    form.reset();
  };
  return (
    <div className="flex flex-col-reverse gap-6 lg:flex-row justify-center items-center h-screen w-11/12 mx-auto">
      <div className="card flex-1 w-full p-4  shadow-2xl">
        <form onSubmit={handleLogin} className="card-body">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-myGreen from-0 to-70% to-myYellow text-transparent bg-clip-text text-center">
            LOGIN HERE
          </h2>

          <div className="form-control">
            <label className="label">
              <div className="label-text text-myYellow font-semibold">
                Email
              </div>
            </label>
            <br />
            <input
              type="email"
              name="email"
              placeholder="email"
              className="input input-bordered border-myYellow w-full "
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-myYellow font-semibold">
                Password
              </span>
            </label>
            <label className="input input-bordered border-myYellow w-full  flex  justify-between items-center gap-2">
              <input
                type={show ? "text" : "password"}
                name="password"
                placeholder="password"
                className=""
                required
              />

              <button onClick={() => setShow(!show)} type="button" className="">
                {show ? <FaEyeSlash></FaEyeSlash> : <FaEye></FaEye>}
              </button>
            </label>
            <label className="label">
              <a href="#" className="label-text-alt link link-hover">
                Forgot password?
              </a>
            </label>
          </div>

          <div className="form-control mt-6">
            <button className="btn bg-gradient-to-r from-myGreen to-myYellow w-full text-white">
              Login
            </button>
          </div>
          <p className="text-center">
            Don't have an account? Please{" "}
            <Link className="text-red-500 font-bold" href="/register">
              Register
            </Link>
          </p>
        </form>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <Image src={loginImg} alt={"img"}></Image>
      </div>
    </div>
  );
}
