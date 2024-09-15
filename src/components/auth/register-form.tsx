import React, { useState, useContext } from "react";
import { auth, db } from "../../services/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { GlobalContext } from "../../context/global-state";
import { useAuthRedirect } from "./redirectAuth";

const SignUpForm: React.FC = () => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [profession, setProfession] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { dispatch } = useContext(GlobalContext);
  useAuthRedirect();
  const navigate = useNavigate();

  const inputStyles = {
    marginBottom: "10px",
    height: "50px",
    fontSize: "18px",
    color: "black",
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (
      password === confirmPassword &&
      password.length >= 6 &&
      fullName &&
      email
    ) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          name: fullName,
          email: user.email,
          uid: user.uid,
          profession: profession,
        });

        dispatch({
          type: "SET_USER",
          payload: {
            name: fullName,
            email: user.email,
            uid: user.uid,
            profession: profession,
          },
        });

        toast.success("Account created successfully");
        setLoading(false);
        navigate("/dashboard");
      } catch (e) {
        toast.error("Account creation failed, please try again");
        setLoading(false);
      }
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setLoading(false);
    } else {
      toast.error("Passwords do not match!");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <Input
          style={inputStyles}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          required
          prefix={<UserOutlined />}
        />
        <Input
          style={inputStyles}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          prefix={<MailOutlined />}
        />
        <Input.Password
          style={inputStyles}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          prefix={<LockOutlined />}
        />
        <Input.Password
          style={inputStyles}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
          prefix={<LockOutlined />}
        />
        <Input
          style={inputStyles}
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          placeholder="Profession"
          required
          prefix={<SolutionOutlined />}
        />
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          style={{
            height: '40px',
            marginTop: "20px",
            fontSize: "18px",
            fontWeight: "bold",
            background: "#BD0C47",
            borderColor: "#BD0C47",
          }}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm;
