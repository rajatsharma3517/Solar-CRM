import { useState } from "react";
import { User, Lock, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: username.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      // Save JWT
      localStorage.setItem("token", data.token);

      // Save logged-in user
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      console.log("Login successful:", data);

      // Go to CRM Dashboard
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#eef5ff] flex items-center justify-center px-6">

      {/* Soft Background Glow */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl"></div>

      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl"></div>

      {/* Login Card */}
      <div
        className="
          relative
          w-full
          max-w-md
          overflow-hidden
          rounded-4xl
          border
          border-white/70
          bg-white/60
          backdrop-blur-2xl
          shadow-[0_20px_60px_rgba(15,23,42,0.12)]
          p-10
        "
      >

        {/* Glass Reflection */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-60 w-60 rounded-full bg-white/60 blur-3xl"></div>

        {/* Logo */}
        <div className="relative z-10 flex justify-center mb-6">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-300/40">

            <span className="text-2xl text-white">
              ☀
            </span>

          </div>

        </div>

        {/* Heading */}
        <div className="relative z-10 text-center mb-8">

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Solar CRM
          </h1>

          <p className="mt-3 text-gray-500">
            Welcome back. 👋
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Sign in to continue
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="relative z-10"
        >

          {/* Username */}
          <div className="mb-5">

            <label className="mb-2 block text-sm font-medium text-slate-700">
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
                transition
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
                placeholder="Enter username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
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
          <div className="mb-5">

            <label className="mb-2 block text-sm font-medium text-slate-700">
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
                transition
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
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
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

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="ml-2 text-gray-400 transition hover:text-gray-600"
              >

                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}

              </button>

            </div>

          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              mt-2
              flex
              w-full
              items-center
              justify-center
              rounded-2xl
              bg-blue-600
              py-3.5
              font-medium
              text-white
              shadow-lg
              shadow-blue-200
              transition
              duration-200
              hover:bg-blue-700
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-70
            "
          >

            {loading ? (
              <>
                <LoaderCircle
                  size={20}
                  className="mr-2 animate-spin"
                />

                Signing in...
              </>
            ) : (
              "Sign In"
            )}

          </button>

        </form>

      </div>

    </div>
  );
}