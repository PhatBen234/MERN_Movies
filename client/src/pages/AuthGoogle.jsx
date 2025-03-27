import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import userApi from "../api/modules/user.api";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/userSlice";
import CircularProgress from "@mui/material/CircularProgress";

const AuthGoogle = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleGoogleAuth = async () => {
      const token = searchParams.get("token");

      if (!token) {
        navigate("/"); 
        return;
      }

      try {
        localStorage.setItem("actkn", token);

        const { response, err } = await userApi.getInfo();

        if (err || !response) {
          console.log("❌ Google login error:", err || "No response");
          localStorage.removeItem("actkn");
          navigate("/");
          return;
        }

        dispatch(setUser({ ...response, token }));

        navigate("/"); 
      } catch (error) {
        console.error("❌ Google login failed:", error);
        localStorage.removeItem("actkn");
        navigate("/");
      }
    };

    handleGoogleAuth();
  }, [searchParams, navigate, dispatch]);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <CircularProgress />
    </div>
  );
};

export default AuthGoogle;
