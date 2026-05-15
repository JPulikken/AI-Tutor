import React, { useState } from "react";
import { loginUser, registerUser, requestPasswordReset, resetPassword } from "../api/api";

const Login = ({ onLogin }) => {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resetPasswordValue, setResetPasswordValue] = useState("");
  const [resetStep, setResetStep] = useState("request");

  const isRegistering = mode === "register";

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setInfo("");
    setIsSubmitting(true);

    try {
      const payload = isRegistering
        ? formData
        : { email: formData.email, password: formData.password };
      const data = isRegistering ? await registerUser(payload) : await loginUser(payload);
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetRequest = async (event) => {
    event.preventDefault();
    setError("");
    setInfo("");
    setIsSubmitting(true);

    try {
      const data = await requestPasswordReset(resetEmail);
      setInfo(data.message || "If an account exists, reset instructions were generated.");
      if (data.resetToken) {
        setResetToken(data.resetToken);
        setInfo((current) => `${current} Dev reset token: ${data.resetToken}`);
      }
      setResetStep("reset");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setInfo("");
    setIsSubmitting(true);

    try {
      const data = await resetPassword(resetToken, resetPasswordValue);
      setInfo(data.message || "Password reset successful. You can now continue.");
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div>
          <p className="auth-eyebrow">AI-Tutor</p>
          <h1>{isRegistering ? "Create an account" : "Welcome back"}</h1>
          <p className="auth-copy">
            Sign in to save personalized lessons, stars, reports, and ASD-friendly learning settings.
          </p>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegistering && (
            <label>
              Name
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete={isRegistering ? "new-password" : "current-password"}
              minLength={8}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {info && <p className="dashboard-status success">{info}</p>}

          <button className="btn btn-primary btn-large" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Please wait..." : isRegistering ? "Create Account" : "Login"}
          </button>

          {!isRegistering && (
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => {
                setShowReset((value) => !value);
                setResetStep("request");
                setError("");
                setInfo("");
              }}
            >
              {showReset ? "Hide Password Reset" : "Forgot Password?"}
            </button>
          )}
        </form>

        {showReset && (
          <form className="auth-form" onSubmit={resetStep === "request" ? handleResetRequest : handleResetPassword}>
            {resetStep === "request" ? (
              <>
                <label>
                  Account Email
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(event) => setResetEmail(event.target.value)}
                    required
                  />
                </label>
                <button className="btn btn-secondary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Generating..." : "Generate Reset Token"}
                </button>
              </>
            ) : (
              <>
                <label>
                  Reset Token
                  <input
                    type="text"
                    value={resetToken}
                    onChange={(event) => setResetToken(event.target.value)}
                    required
                  />
                </label>
                <label>
                  New Password
                  <input
                    type="password"
                    value={resetPasswordValue}
                    onChange={(event) => setResetPasswordValue(event.target.value)}
                    minLength={8}
                    required
                  />
                </label>
                <button className="btn btn-secondary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </button>
              </>
            )}
          </form>
        )}
      </section>
    </main>
  );
};

export default Login;
