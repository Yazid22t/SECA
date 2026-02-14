import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function LoginView() {
  const { signIn, signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password);

    if (!success) {
      setError("Invalid Credentials");
    } else {
      window.location.href = "/dashboard";
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isSignUp ? "Register" : "Login"}</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : isSignUp ? "Register" : "Login"}
      </button>

      <p onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? "Already have account?" : "Create account"}
      </p>

      {error && <p>{error}</p>}
    </form>
  );
}
