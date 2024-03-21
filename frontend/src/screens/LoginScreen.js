import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  userLoginRequest,
  userLoginSuccess,
  userLoginFail,
  userLogout,
} from "../features/userLoginSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import axios from "axios";
import { Link, useLocation,useNavigate } from "react-router-dom";
function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const redirect = location.search ? location.search.split("=")[1] : "/";
  console.log(redirect)
  const { loading, userInfo, error } = useSelector((state) => state.userlogin);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const login = (email, password) => async () => {
    try {
      dispatch(userLoginRequest());
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/users/login/",
        { 'username': email, 'password': password },
        config
      );
      dispatch(userLoginSuccess(data));
    } catch (err) {
      dispatch(
        userLoginFail(
          err.response && err.response.data.detail
            ? err.response.data.detail
            : err.message
        )
      );
    }
  };
  useEffect(() => {
    if(userInfo){
      if(redirect=='/')
        navigate(redirect)
      else
      navigate(`/${redirect}`)
    }
    
  }, [userInfo,redirect,navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email,password));
  };
  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader/>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" style={{ margin: "1rem 0" }}>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password" style={{ margin: "1rem 0" }}>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>
        <Form.Group style={{ margin: "1rem 0" }}>
          <Button type="submit" variant="primary">
            Sign In
          </Button>
        </Form.Group>
      </Form>
      <Row className="py-3">
        <Col>
          New Customer?{" "}
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
}

export default LoginScreen;
