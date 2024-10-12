import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [name, setName] = useState("");
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
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        await login({ email, password });
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        console.error(errorData.message);
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500">
      <div className="bg-white bg-opacity-60 p-10 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center text-orange-900">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xl mb-2 text-orange-900">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              style={{ color: "black" }}
            />
          </div>
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
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-orange-900">
          Already a member?{" "}
          <a href="/login" className="font-semibold">
            Login Now!
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
