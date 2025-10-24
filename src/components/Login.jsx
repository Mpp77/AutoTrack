import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import "../App.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isCreatingAccount) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: serverTimestamp(),
        });

        setMessage("✅ Account created successfully!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("✅ Logged in successfully!");
      }

      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage("❌ " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="glass-card">
      <h1 className="app-title">AutoTrack</h1>
      <h2 className="text-lg mb-6">
          {isCreatingAccount ? "Create Account" : "Sign In"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">
            {isCreatingAccount ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300">
          {isCreatingAccount ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsCreatingAccount(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#60a5fa",
                  cursor: "pointer",
                }}
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setIsCreatingAccount(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#60a5fa",
                  cursor: "pointer",
                }}
              >
                Create one
              </button>
            </>
          )}
        </p>

        {message && <p className="mt-4 text-sm">{message}</p>}
      </div>
    </div>
  );
}
