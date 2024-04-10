import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
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
  userUpdateReset,
} from "../features/userUpdateSlice";
import {
  orderListRequest,
  orderListSuccess,
  orderListFail,
  orderListReset,
} from "../features/orderListSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import axios from "axios";
import { LinkContainer } from "react-router-bootstrap";
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
  const {
    loading: loadingOrders,
    orders,
    error: errorOrders,
  } = useSelector((state) => state.orderList);
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
          err.response && err.response.data.detail
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
          err.response && err.response.data.detail
            ? err.response.data.detail
            : err.message
        )
      );
    }
  };

  const listOrders = () => async () => {
    try {
      dispatch(orderListRequest());

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`/api/orders/myorders/`, config);
      dispatch(orderListSuccess(data));
    } catch (err) {
      dispatch(
        orderListFail(
          err.response && err.response.data.detail
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
      if (!user || !user.name || success || userInfo._id !==user._id) {
        dispatch(userUpdateReset());
        dispatch(getUserDetails("profile"));
        dispatch(listOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [userInfo, dispatch, navigate, user, success,orders]);
  const submitHandler = (e) => {
    e.preventDefault();
    if (password != confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(
        userUpdateProfile({
          id: user._id,
          name: name,
          email: email,
          password: password,
        })
      );
      setMessage("");
    }
  };
  // console.log(orders)
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
      <Col md={9}>
        <h2>My Orders</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger">{errorOrders}</Message>
        ) : (
          <Table striped responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Delivered</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.isPaid?order.paidAt.substring(0,10):(
                    <i className="fas fa-times" style={{color:'red'}}></i>
                  )}</td>
                  <td><LinkContainer to={`/order/${order._id}`}>
                    <Button className="btn-sm">Details</Button>
                  </LinkContainer></td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
}

export default ProfileScreen;
