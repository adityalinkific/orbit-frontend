import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { loginService, meService } from "../../services/auth.service";
import Toast from "../../components/feedback/Toast";
import Loader from "../../components/common/Loader";
import { GiDna1 } from "react-icons/gi";
import { MdOutlineLink } from "react-icons/md";
import { FaRocket } from "react-icons/fa";
import api from "../../services/api";


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
    // ✅ STEP 1: Call login API
    const res = await loginService(form);

    // ✅ STEP 2: Get token
    const rawToken = res.token;

    // ✅ STEP 3: Clean token (avoid "Bearer Bearer")
    const cleanToken = rawToken.startsWith("Bearer ")
      ? rawToken.split(" ")[1]
      : rawToken;

    // ✅ STEP 4: Store token
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("token", cleanToken);

    // ✅ STEP 5: (optional) set axios default header
    api.defaults.headers.common["Authorization"] = `Bearer ${cleanToken}`;

    // ✅ STEP 6: Fetch user
    const meRes = await meService();
    const user = meRes?.data?.data;

    if (!user) {
      throw new Error("Failed to fetch user");
    }

    // ✅ STEP 7: Save auth state
    login(
      {
        token: cleanToken,
        user,
      },
      rememberMe
    );

    navigate("/dashboard", { replace: true });

  } catch (err) {
    console.error("LOGIN ERROR 👉", err);

    const msg = (err.message || "").toLowerCase();
    let toastMsg = "Invalid email or password";
    let emailErr = true;
    let passErr = true;

    if (msg.includes("password")) {
      toastMsg = "Invalid Password";
      emailErr = false;
      passErr = true;
    } else if (msg.includes("email") || msg.includes("user")) {
      toastMsg = "Invalid Email Address and Password";
    } else {
      toastMsg = err.message || "Invalid Email Address and Password";
    }

    setToast(toastMsg);
    setErrors({ email: emailErr, password: passErr });

    setShake(true);
    setTimeout(() => setShake(false), 450);
  }

  setLoading(false);
};


  return (
    <div className="w-full flex flex-col lg:flex-row min-h-screen font-sans animate-in fade-in duration-500">
      {toast && <Toast msg={toast} onClose={() => setToast(null)} className="!px-4 !py-2 !text-sm !h-max leading-none max-lg:!top-4 max-lg:!right-auto max-lg:!left-1/2 max-lg:-translate-x-1/2 max-lg:w-max max-lg:max-w-[90%]" />}

      {/* LEFT SECTION */}
      <div className="relative w-full lg:w-1/2 bg-gradient-to-br from-[#1b4fd8] via-[#2f7cff] to-[#4f9cff] text-white p-10 lg:p-[70px] overflow-hidden flex flex-col items-center lg:items-start text-center lg:text-left min-h-[450px] lg:min-h-screen justify-center lg:justify-start">
        
        {/* Glow Effects */}
        <div className="absolute w-[300px] h-[300px] lg:w-[420px] lg:h-[420px] bg-white rounded-full blur-[120px] opacity-35 -top-[120px] -left-[120px] animate-pulse"></div>
        <div className="absolute w-[300px] h-[300px] lg:w-[420px] lg:h-[420px] bg-[#5aa2ff] rounded-full blur-[120px] opacity-35 -bottom-[160px] -right-[160px] animate-pulse"></div>
        <div className="absolute w-[200px] h-[200px] lg:w-[280px] lg:h-[280px] bg-white rounded-full blur-[80px] opacity-35 top-[30px] right-[20px] lg:top-[120px] lg:right-[80px]"></div>
        <div className="absolute w-[200px] h-[200px] lg:w-[320px] lg:h-[320px] bg-[#6fb1ff] rounded-full blur-[80px] opacity-35 bottom-[30px] left-[20px] lg:bottom-[120px] lg:left-[80px]"></div>

        {/* Brand */}
        <div className="relative z-10 flex items-center font-extrabold tracking-[1.5px] text-3xl lg:text-[44px] justify-center lg:justify-start">
          <div className="w-[60px] h-[60px] lg:w-[100px] lg:h-[100px] bg-white/20 rounded-[12px] lg:rounded-[18px] grid place-items-center backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.25)] mr-3 lg:mr-5">
            <img src="assets/icons/orbit-icon.svg" alt="Orbit Logo" className="w-[50px] h-[50px] lg:w-[90px] lg:h-[90px] animate-[spin_14s_linear_infinite] hover:animate-none" />
          </div>
          <span>Orbit</span>
        </div>

        {/* Copy */}
        <h1 className="relative z-10 mt-[30px] lg:mt-[100px] text-[32px] lg:text-[56px] leading-[1.1] lg:leading-[1.05] tracking-tight drop-shadow-2xl font-bold">
          Future of <br />
          <span className="text-[#eaf1ff]">Work Management</span>
        </h1>
        <p className="relative z-10 mt-4 lg:mt-5 text-sm lg:text-[15px] max-w-[440px] opacity-90 mx-auto lg:mx-0">
          Experience the next generation of project orchestration. Seamless,
          intuitive, and powerful.
        </p>

        {/* Features */}
        <div className="relative z-10 mt-[30px] lg:mt-[60px] flex gap-3 lg:gap-[26px] justify-center lg:justify-start flex-wrap">
          <div className="flex flex-col items-center gap-3 lg:gap-4">
            <div className="w-[60px] h-[60px] lg:w-[100px] lg:h-[100px] bg-white/20 rounded-[12px] lg:rounded-[18px] grid place-items-center text-2xl lg:text-[42px] backdrop-blur-md shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:scale-105 hover:shadow-2xl hover:z-10">
              <GiDna1 />
            </div>
            <span className="text-[10px] lg:text-[11px] tracking-[2px] opacity-80 font-semibold uppercase text-center">ALIGN</span>
          </div>
          <div className="flex flex-col items-center gap-3 lg:gap-4">
            <div className="w-[60px] h-[60px] lg:w-[100px] lg:h-[100px] bg-white/20 rounded-[12px] lg:rounded-[18px] grid place-items-center text-2xl lg:text-[42px] backdrop-blur-md shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:scale-105 hover:shadow-2xl hover:z-10">
              <MdOutlineLink />
            </div>
            <span className="text-[10px] lg:text-[11px] tracking-[2px] opacity-80 font-semibold uppercase text-center">CONNECT</span>
          </div>
          <div className="flex flex-col items-center gap-3 lg:gap-4">
            <div className="w-[60px] h-[60px] lg:w-[100px] lg:h-[100px] bg-white/20 rounded-[12px] lg:rounded-[18px] grid place-items-center text-2xl lg:text-[42px] backdrop-blur-md shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:scale-105 hover:shadow-2xl hover:z-10">
              <FaRocket />
            </div>
            <span className="text-[10px] lg:text-[11px] tracking-[2px] opacity-80 font-semibold uppercase text-center">ACCELERATE</span>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full flex-1 lg:w-1/2 flex justify-center items-center bg-white p-8 sm:p-10 lg:p-[70px] min-h-[500px] lg:min-h-screen">
        <div className={`w-full max-w-[360px] transition-transform ${shake ? "animate-bounce" : ""}`}>
          <h2 className="text-[#4c90ff] text-[28px] font-semibold mb-1">Welcome Back</h2>
          <span className="text-[#666] text-sm">Enter your credentials to access your workspace.</span>

          <form onSubmit={submit} className="text-slate-800 mt-6">
            <label className="block text-xs font-semibold text-[#777]">Email Address</label>
            <input
              className={`w-full px-4 py-3.5 mt-1.5 rounded-xl border outline-none transition-all ${
                errors.email ? "border-red-500 bg-red-50 focus:ring-4 focus:ring-red-500/20" : "border-gray-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15"
              }`}
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setErrors({ ...errors, email: false });
                setToast(null);
              }}
            />
            {errors.email && (
              <small className="text-red-500 text-xs mt-1.5 block">Invalid email address</small>
            )}

            <div className="flex justify-between mt-6">
              <label className="block text-xs font-semibold text-[#777]">Password</label>
            </div>

            <div className="relative mt-1.5 w-full">
              <input
                className={`w-full pl-4 pr-10 py-3.5 rounded-xl border outline-none transition-all ${
                  errors.password ? "border-red-500 bg-red-50 focus:ring-4 focus:ring-red-500/20" : "border-gray-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15"
                }`}
                type={show ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  setErrors({ ...errors, password: false });
                  setToast(null);
                }}
              />
              <span 
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-400 hover:text-gray-700 transition"
                onClick={() => setShow(!show)}
              >
                {show ? "🫣" : "👀"}
              </span>
            </div>

            {errors.password && (
              <small className="text-red-500 text-xs mt-1.5 block">Incorrect password</small>
            )}

            <div className="flex items-center gap-2 mt-5 mb-5">
              <input
                type="checkbox"
                id="rem"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="rem"
                className="text-[13px] text-[#666] cursor-pointer"
              >
                Remember me
              </label>
              <div className="flex-1"></div>
              <span className="text-[12px] text-[#1f6efb] cursor-pointer hover:underline">Forgot Password?</span>
            </div>

            {loading ? (
              <div className="flex justify-center mt-2.5">
                <Loader />
              </div>
            ) : (
              <button className="w-full bg-gradient-to-br from-[#1f6efb] to-[#3f8cff] text-white py-3.5 rounded-xl font-semibold mt-2.5 hover:-translate-y-px shadow-lg hover:shadow-[0_10px_20px_rgba(31,110,251,0.25)] transition-all">
                Log In
              </button>
            )}
          </form>

        </div>
      </div>
    </div>
  );
}
