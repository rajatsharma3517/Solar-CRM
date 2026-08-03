import { useState } from "react";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

export default function Login() {
  // Form data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Show / hide password
  const [showPassword, setShowPassword] = useState(false);

  // Remember me
  const [rememberMe, setRememberMe] = useState(false);

  // Temporary submit function
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Username:", username);
    console.log("Password:", password);
    console.log("Remember me:", rememberMe);

    // Backend login API baad mein yahan connect karenge
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F4F8FD] flex items-center justify-center px-6">

      {/* Background Soft Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute left-1/2 top-[-180px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-200/40 blur-[140px]" />

        <div className="absolute left-1/2 bottom-[-220px] h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-sky-100/60 blur-[140px]" />

      </div>

      {/* Login Card */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          overflow-hidden
          rounded-[32px]
          border
          border-white/80
          bg-white/60
          p-10
          backdrop-blur-2xl
          shadow-[0_25px_60px_rgba(15,23,42,0.10)]
        "
      >

        {/* Glass Reflection */}
        <div className="absolute -left-16 -top-20 h-52 w-52 rounded-full bg-white/60 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 mb-6 flex justify-center">

          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-blue-600
              shadow-lg
              shadow-blue-300/40
            "
          >
            <span className="text-2xl text-white">
              ☀
            </span>
          </div>

        </div>

        {/* Heading */}
        <div className="relative z-10 mb-8 text-center">

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Solar CRM
          </h1>

          <p className="mt-3 text-gray-500">
            Welcome back 👋
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Sign in to continue
          </p>

        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="relative z-10"
        >

          {/* Username */}
          <div className="mb-5">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Username
            </label>

            <div
              className="
                flex
                items-center
                rounded-2xl
                border
                border-gray-200
                bg-white/70
                px-4
                py-3.5
                backdrop-blur-xl
                transition-all
                duration-200
                focus-within:border-blue-500
                focus-within:bg-white
                focus-within:ring-4
                focus-within:ring-blue-100
              "
            >

              <User
                size={20}
                className="shrink-0 text-gray-400"
              />

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                className="
                  ml-3
                  w-full
                  bg-transparent
                  text-gray-700
                  outline-none
                  placeholder:text-gray-400
                "
              />

            </div>

          </div>

          {/* Password */}
          <div className="mb-4">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <div
              className="
                flex
                items-center
                rounded-2xl
                border
                border-gray-200
                bg-white/70
                px-4
                py-3.5
                backdrop-blur-xl
                transition-all
                duration-200
                focus-within:border-blue-500
                focus-within:bg-white
                focus-within:ring-4
                focus-within:ring-blue-100
              "
            >

              <Lock
                size={20}
                className="shrink-0 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                className="
                  ml-3
                  w-full
                  bg-transparent
                  text-gray-700
                  outline-none
                  placeholder:text-gray-400
                "
              />

              {/* Password Eye */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  ml-2
                  shrink-0
                  text-gray-400
                  transition
                  hover:text-slate-700
                "
              >

                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}

              </button>

            </div>

          </div>

          {/* Remember Me */}
          <div className="mb-6 flex items-center justify-between">

            <label className="flex cursor-pointer items-center gap-2">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="
                  h-4
                  w-4
                  cursor-pointer
                  rounded
                  border-gray-300
                  accent-blue-600
                "
              />

              <span className="text-sm text-gray-500">
                Remember me
              </span>

            </label>

          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-blue-600
              px-5
              py-3.5
              font-semibold
              text-white
              shadow-lg
              shadow-blue-200
              transition-all
              duration-200
              hover:bg-blue-700
              hover:shadow-xl
              active:scale-[0.98]
            "
          >

            Sign In

            <ArrowRight size={19} />

          </button>

        </form>

        {/* Footer */}
        <div className="relative z-10 mt-7 text-center">

          <p className="text-xs text-gray-400">
            Secure Login • Solar CRM
          </p>

        </div>

      </div>

    </div>
  );
}