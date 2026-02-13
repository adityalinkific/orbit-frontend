
import { useEffect, useState } from "react";
import { meService } from "../../services/auth.service";

export default function Tasks() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        async function loadProfile() {
            try {
                const res = await meService();
                setProfile(res.data || res);
            } catch (err) {
                console.error("ME API ERROR 👉", err);
            }
        }

        loadProfile();
    }, []);

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Tasks</h1>
                    <p>Overview of your tasks and projects.</p>
                </div>

                <div className="user-role-box">
                    <span className="user-email">{profile?.email}</span>
                    <span className="user-role">
                        {profile?.role?.role || "USER"}
                    </span>
                </div>
            </div>

            <div className="widget-grid">
                <div className="widget">Pending Tasks</div>
                <div className="widget">Completed</div>
                <div className="widget">In Progress</div>
            </div>
        </div>
    );
}
