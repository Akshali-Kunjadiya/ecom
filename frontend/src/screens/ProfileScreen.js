import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  userDetailsRequest,
  userDetailsSuccess,
  userDetailsFail,
} from "../features/userDetailsSlice";
import {
  userUpdateRequest,
  userUpdateSuccess,
  userUpdateFail,
  userUpdateReset
} from "../features/userUpdateSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import axios from "axios";
import { userLoginSuccess } from "../features/userLoginSlice";

function ProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const { loading, user, error } = useSelector((state) => state.userDetails);
  const { userInfo } = useSelector((state) => state.userlogin);
  const { success } = useSelector((state) => state.userUpdateProfile);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getUserDetails = (id) => async () => {
    try {
      dispatch(userDetailsRequest());

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/users/${id}/`,

        config
      );
      dispatch(userDetailsSuccess(data));
    } catch (err) {
      dispatch(
        userDetailsFail(
          err.responsse && err.responsse.data.detail
            ? err.response.data.detail
            : err.message
        )
      );
    }
  };

  const userUpdateProfile = (user) => async () => {
    try {
      dispatch(userUpdateRequest());

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/users/profile/update/`,
        user,
        config
      );
      dispatch(userUpdateSuccess(data));
      dispatch(userLoginSuccess(data));
    } catch (err) {
      dispatch(
        userUpdateFail(
          err.responsse && err.responsse.data.detail
            ? err.response.data.detail
            : err.message
        )
      );
    }
  };
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!user || !user.name||success) {
        dispatch(userUpdateReset());
        dispatch(getUserDetails("profile"));
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [userInfo, dispatch, navigate, user,success]);
  const submitHandler = (e) => {
    e.preventDefault();
    if (password != confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(userUpdateProfile({'id':user._id,'name':name,'email':email,'password':password}))
      setMessage("");
    }
  };
  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" style={{ margin: "1rem 0" }}>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
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
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>

          <Form.Group style={{ margin: "1rem 0" }}>
            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form.Group>
        </Form>
      </Col>
      <Col>
        <h2>My Orders</h2>
      </Col>
    </Row>
  );
}

export default ProfileScreen;
