import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { registerService } from "../../services/auth.service";
import Toast from "../../components/feedback/Toast";
import Loader from "../../components/common/Loader";
import "./auth.css";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await registerService(form);

      // If backend returns token, auto login
      if (res.token) {
        login(res);
        navigate("/dashboard", { replace: true });
      } else {
        setToast("User created successfully");
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("REGISTER ERROR 👉", err);
      setToast(err.message || "Registration failed");
    }

    setLoading(false);
  };

 return (
  <div className="orbit-auth fade-in">
    {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

    <div className="orbit-auth-right full-center">
      <div className="orbit-form slide-up">
        <h2>Create Account</h2>
        <span>Super admin can onboard users.</span>

        <form onSubmit={submit}>
          <label>Name</label>
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <label>Email</label>
          <input
            required
            type="email"
            placeholder="name@company.com"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <label>Password</label>
          <input
            required
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          {loading ? <Loader /> : <button>Create User</button>}
        </form>
      </div>
    </div>
  </div>
);

}
