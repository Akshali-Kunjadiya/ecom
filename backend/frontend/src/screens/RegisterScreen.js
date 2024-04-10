import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  userRegisterRequest,
  userRegisterSuccess,
  userRegisterFail,
  userLogout,
} from "../features/userRegisterSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import axios from "axios";
import { userLoginSuccess } from "../features/userLoginSlice";

function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const redirect = location.search ? location.search.split("=")[1] : "/";
  const { loading, userInfo, error } = useSelector((state) => state.userRegister);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const register = (name,email, password) => async () => {
    try {
      dispatch(userRegisterRequest());
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/users/register/",
        {'name':name, 'email': email, 'password': password },
        config
      );
      dispatch(userRegisterSuccess(data));
      dispatch(userLoginSuccess(data));
    } catch (err) {
      dispatch(
        userRegisterFail(
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
    
  }, [userInfo, redirect, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    if(password!=confirmPassword){
      setMessage('Passwords do not match')
    }
    else{

      dispatch(register(name,email, password));
    }
  };
  return (
    <FormContainer>
      <h1>Sign In</h1>
      {message&&<Message variant='danger'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader/>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name" style={{ margin: "1rem 0" }}>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            value={name}
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="email" style={{ margin: "1rem 0" }}>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={email}
            required
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
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>
        
        <Form.Group controlId="passwordconfirm" style={{ margin: "1rem 0" }}>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            required
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>

        <Form.Group style={{ margin: "1rem 0" }}>
          <Button type="submit" variant="primary">
            Register
          </Button>
        </Form.Group>
      </Form>
      <Row className="py-3">
        <Col>
          Have an Account?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            Sign In
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
}

export default RegisterScreen;
