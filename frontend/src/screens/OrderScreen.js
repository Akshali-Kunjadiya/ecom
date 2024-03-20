import React, { useState, useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  orderDetailsRequest,
  orderDetailsSuccess,
  orderDetailsFail,
} from "../features/orderDetailsSlice";
import {
  orderPayRequest,
  orderPaySuccess,
  orderPayFail,
  orderPayReset,
} from "../features/orderPaySlice";
import {
  orderDeliveredRequest,
  orderDeliveredSuccess,
  orderDeliveredFail,
  orderDeliveredReset,
} from "../features/orderDeliveredSlice";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import axios from "axios";

function OrderScreen() {
  const { id } = useParams();
  const orderId = id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sdkReady, setSdkReady] = useState(false);
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { success: successPay, loading: loadingPay } = useSelector(
    (state) => state.orderPay
  );
  const { success: successDeliver, loading: loadingDeliver } = useSelector(
    (state) => state.orderDelivered
  );

  const { userInfo } = useSelector((state) => state.userlogin);
  let itemsPrice;
  if (!loading && !error) {
    itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  }
  const getOrderDetails = (id) => async () => {
    try {
      dispatch(orderDetailsRequest());

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`/api/orders/${id}/`, config);
      dispatch(orderDetailsSuccess(data));
    } catch (err) {
      dispatch(
        orderDetailsFail(
          err.responsse && err.responsse.data.detail
            ? err.response.data.detail
            : err.message
        )
      );
    }
  };

  const payOrder = (id, paymentResult) => async () => {
    try {
      dispatch(orderPayRequest());

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/orders/${id}/pay/`,
        paymentResult,
        config
      );
      dispatch(orderPaySuccess(data));
    } catch (err) {
      dispatch(
        orderPayFail(
          err.responsse && err.responsse.data.detail
            ? err.response.data.detail
            : err.message
        )
      );
    }
  };

  const deliverOrder = (order) => async () => {
    try {
      dispatch(orderDeliveredSuccess());

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver/`,
        {},
        config
      );
      dispatch(orderDeliveredSuccess(data));
    } catch (err) {
      dispatch(
        orderDeliveredFail(
          err.responsse && err.responsse.data.detail
            ? err.response.data.detail
            : err.message
        )
      );
    }
  };
  // Ab3aEexMeeF7lrpAvS6ETqOQSTBgX_w-9VbFcXjr79oQz9PFCN2pyH2OM6LGGUyuEHPjTM_itxRoSD5U
  // const addPayPalScript = () => {
  //   const script = document.createElement("script");
  //   script.type = "text/javascript";
  //   script.src =
  //     '<script src="https://www.paypal.com/sdk/js?client-id=AXn8i78SWb4cW5o2hFGyablD8FB03StSij37NXwVmUy0ZfbhtBY0BFNQ220WgLc5Xp34Y5_w4c70zCCp&currency=USD">';
  //   script.asyn = true;
  //   script.onload = () => {
  //     setSdkReady(true);
  //   };
  //   document.body.appendChild(script);
  // };

  // const PayPalButton = window.paypal.Buttons.driver("react", {
  //   React,
  //   ReactDOM,
  // });
  const createOrder = (data, action) => {
    return action.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: `${order.totalPrice}`,
          },
        },
      ],
    });
  };
  const onApprove = (paymentResult) => {
    // console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  };
  const deliverHandler = () => {
    // console.log(paymentResult);
    dispatch(deliverOrder(order));
  };
  useEffect(() => {
    if(!userInfo){
      navigate('/login')
    }
    if (
      !order ||
      order._id !== Number(orderId) ||
      successPay ||
      successDeliver
    ) {
      dispatch(orderPayReset());
      dispatch(orderDeliveredReset());
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      setSdkReady(true);
    }
  }, [dispatch, order, orderId, successPay,successDeliver]);
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <h1>Order: {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name:</strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email:</strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Shipping: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}
                {"  "}
                {order.shippingAddress.postalCode},{"  "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.delivereAt}
                </Message>
              ) : (
                <Message variant="warning">Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="warning">Not paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>

              {order.orderItems.length === 0 ? (
                <Message variant="info">Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1} sm={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Item:</Col>
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tex:</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  <PayPalScriptProvider
                    options={{
                      clientId:
                        "Ab3aEexMeeF7lrpAvS6ETqOQSTBgX_w-9VbFcXjr79oQz9PFCN2pyH2OM6LGGUyuEHPjTM_itxRoSD5U",
                    }}
                  >
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                    />
                  </PayPalScriptProvider>
                </ListGroup.Item>
              )}
            </ListGroup>
            {loadingDeliver && <Loader/>}
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                
                  <ListGroup.Item style={{padding:'5px'}}>
                    <Button
                      className="btn btn-block"
                      style={{ width: '100%' }}
                      bsSize="large"
                      onClick={() => {
                        deliverHandler();
                      }}
                    >
                      Mark As Deliver
                    </Button>
                  </ListGroup.Item>
                
              )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderScreen;
