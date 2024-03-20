import React, { useState, useEffect } from "react";
import {  Table, Button  } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  orderListAdminRequest,
  orderListAdminSuccess,
  orderListAdminFail,
} from "../features/orderlistAdminSlice";

import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import axios from "axios";
import { LinkContainer } from "react-router-bootstrap";
import { userLoginSuccess } from "../features/userLoginSlice";
function OrderListAdminScreen() {
  const location = useLocation();
  const { loading, orders, error } = useSelector((state) => state.orderListAdmin);
  const { userInfo } = useSelector((state) => state.userlogin);
  const { success: successDelete } = useSelector((state) => state.userDelete);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const listOrders = () => async () => {
    try {
      dispatch(orderListAdminRequest());

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`/api/orders/`, config);
      dispatch(orderListAdminSuccess(data));
    } catch (err) {
      dispatch(
        orderListAdminFail(
          err.responsse && err.responsse.data.detail
            ? err.response.data.detail
            : err.message
        )
      );
    }
  };
  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  return (
    <div>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user&& order.user.name}</td>
                <td>{order.createdAt.substring(0,10)}</td>
                <td>{order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0,10)
                  ) : (
                    <i className="fas fa-check" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.delivereAt.substring(0,10)
                  ) : (
                    <i className="fas fa-check" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="light" className="btn-sm">
                      Details
                    </Button>
                  </LinkContainer>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default OrderListAdminScreen;
