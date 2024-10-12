import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500">
      <div className="bg-white bg-opacity-60 p-10 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center text-orange-900">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xl mb-2 text-orange-900">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              style={{ color: "black" }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-xl mb-2 text-orange-900">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              style={{ color: "black" }}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 text-white p-2 rounded transition duration-300 hover:bg-orange-700 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-orange-900">
          Not a member?{" "}
          <a href="/signup" className="font-semibold">
            Sign Up for Free Now!
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
