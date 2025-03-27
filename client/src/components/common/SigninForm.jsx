import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../../api/modules/user.api";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import { setUser } from "../../redux/features/userSlice";

// Google Icon Component
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: 10 }}>
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

const SigninForm = ({ switchAuthState }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 🔥 Dùng chung cho cả login thường và Google login
  const handleAuthSuccess = async (token) => {
    try {
      localStorage.setItem("actkn", token);

      const { response: userInfo, err: infoErr } = await userApi.getInfo();

      if (infoErr) {
        setErrorMessage(infoErr.message);
        localStorage.removeItem("actkn");
        return;
      }

      dispatch(setUser({ ...userInfo, token }));
      dispatch(setAuthModalOpen(false));
      toast.success("Sign in success");
    } catch (error) {
      setErrorMessage("Failed to get user info");
      localStorage.removeItem("actkn");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google OAuth callback
  useEffect(() => {
    const handleGoogleAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get("userId");

      if (!userId) return;

      setIsLoading(true);

      try {
        const { response, err } = await userApi.googleLogin(userId);

        if (response) {
          await handleAuthSuccess(response.token);
          window.history.replaceState({}, document.title, "/login"); // clear query param
        }

        if (err) {
          setErrorMessage(err.message);
          toast.error("Google Sign in failed");
        }
      } catch (error) {
        setErrorMessage("An error occurred during Google authentication");
      } finally {
        setIsLoading(false);
      }
    };

    handleGoogleAuth();
  }, [dispatch]);

  // Normal sign in form
  const signinForm = useFormik({
    initialValues: {
      username: "",
      password: ""
    },
    validationSchema: Yup.object({
      username: Yup.string().min(8, "Username minimum 8 characters").required("Username is required"),
      password: Yup.string().min(8, "Password minimum 8 characters").required("Password is required")
    }),
    onSubmit: async (values) => {
      setErrorMessage("");
      setIsLoading(true);

      const { response, err } = await userApi.signin(values);

      if (response) {
        await handleAuthSuccess(response.token);
        signinForm.resetForm();
      }

      if (err) {
        setErrorMessage(err.message);
        setIsLoading(false);
      }
    }
  });

  const handleGoogleLogin = () => {
    userApi.initiateGoogleLogin();
  };

  return (
    <Box component="form" onSubmit={signinForm.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          name="username"
          placeholder="Username"
          fullWidth
          value={signinForm.values.username}
          onChange={signinForm.handleChange}
          onBlur={signinForm.handleBlur}
          color="success"
          error={signinForm.touched.username && Boolean(signinForm.errors.username)}
          helperText={signinForm.touched.username && signinForm.errors.username}
        />
        <TextField
          name="password"
          placeholder="Password"
          type="password"
          fullWidth
          value={signinForm.values.password}
          onChange={signinForm.handleChange}
          onBlur={signinForm.handleBlur}
          color="success"
          error={signinForm.touched.password && Boolean(signinForm.errors.password)}
          helperText={signinForm.touched.password && signinForm.errors.password}
        />
      </Stack>

      <LoadingButton
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        sx={{ marginTop: 4 }}
        loading={isLoading}
      >
        Sign in
      </LoadingButton>

      <Divider sx={{ my: 2 }}>
        <Typography variant="body2" color="text.secondary">
          OR
        </Typography>
      </Divider>

      <Button
        fullWidth
        variant="outlined"
        sx={{ marginTop: 1 }}
        onClick={handleGoogleLogin}
        startIcon={<GoogleIcon />}
        disabled={isLoading}
      >
        Sign in with Google
      </Button>

      <Button
        fullWidth
        sx={{ marginTop: 1 }}
        onClick={switchAuthState}
        disabled={isLoading}
      >
        Sign up
      </Button>

      {errorMessage && (
        <Box sx={{ marginTop: 2 }}>
          <Alert severity="error" variant="outlined">
            {errorMessage}
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default SigninForm;
