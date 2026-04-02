import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { loginService, meService } from "../../services/auth.service";
import Toast from "../../components/feedback/Toast";
import Loader from "../../components/common/Loader";
import "./auth.css";
import { GiDna1 } from "react-icons/gi";
import { MdOutlineLink } from "react-icons/md";
import { FaRocket } from "react-icons/fa";



export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  

  const { login } = useAuth();
  const navigate = useNavigate();

const submit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrors({});

  try {
    // ✅ Step 1: Login → get token
    const res = await loginService(form);

    // ✅ Step 2: TEMPORARILY store token so interceptor can use it
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("token", res.token);

    // ✅ Step 3: Now call /me (token is available ✅)
    const meRes = await meService();
    const user = meRes?.data?.data;

    if (!user) {
      throw new Error("Failed to fetch user");
    }

    // ✅ Step 4: Save full auth state
    login(
      {
        token: res.token,
        user,
      },
      rememberMe
    );

    navigate("/dashboard", { replace: true });

  } catch (err) {
    console.error("LOGIN ERROR 👉", err);

    setToast("Invalid email or password");

    setErrors({
      email: true,
      password: true,
    });

    setShake(true);
    setTimeout(() => setShake(false), 450);
  }

  setLoading(false);
};




  return (
    <div className="orbit-auth fade-in">
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      <div className="orbit-auth-left">
        <div className="orbit-brand">
          <div className="orbit-logo-card">
            <img src="assets/icons/orbit-icon.svg" alt="Orbit Logo" />
          </div>
          <span>Orbit</span>
        </div>

        <div className="orb orb1"></div>
        <div className="orb orb2"></div>

        <h1>
          Future of <br />
          <span>Work Management</span>
        </h1>
        <p>
          Experience the next generation of project orchestration. Seamless,
          intuitive, and powerful.
        </p>

        <div className="orbit-features">
          <div className="feature-item">
            <div className="feature-card"><GiDna1 /></div>
            <span className="feature-tag">ALIGN</span>
          </div>
          <div className="feature-item">
            <div className="feature-card"><MdOutlineLink /></div>
            <span className="feature-tag">CONNECT</span>
          </div>
          <div className="feature-item">
            <div className="feature-card"><FaRocket /></div>
            <span className="feature-tag">ACCELERATE</span>
          </div>
        </div>
      </div>

      <div className="orbit-auth-right">
        <div className={`orbit-form slide-up ${shake ? "shake" : ""}`}>
          <h2 className="text-[#4c90ff]">Welcome Back</h2>
          <span>Enter your credentials to access your workspace.</span>

          <form onSubmit={submit} className="text-slate-800">
            <label>Email Address</label>
            <input
              className={errors.email ? "input-error" : ""}
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setErrors({ ...errors, email: false });
                setToast(null);
              }}
            />
            {errors.email && (
              <small className="error-text">Invalid email address</small>
            )}

            <div className="password-row">
              <label>Password</label>
            </div>

            <div className="password-wrap">
              <input
                className={errors.password ? "input-error" : ""}
                type={show ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  setErrors({ ...errors, password: false });
                  setToast(null);
                }}
              />
              <span onClick={() => setShow(!show)}>
                {show ? "🫣" : "👀"}
              </span>
            </div>

            {errors.password && (
              <small className="error-text">Incorrect password</small>
            )}

            <div className="remember">
              <input
                type="checkbox"
                id="rem"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: "auto", marginTop: 0 }}
              />
              <label
                htmlFor="rem"
                style={{ marginTop: 0, fontSize: "13px", color: "#666" }}
              >
                Remember me
              </label>
              <div style={{ flex: 1 }}></div>
              <span className="forgot">Forgot Password?</span>
            </div>

            {loading ? <Loader /> : <button>Log In</button>}
          </form>

          <div className="orbit-footer">

          </div>
        </div>
      </div>
    </div>
  );
}
