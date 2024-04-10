import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  saveShippingAddress,
} from "../features/cartSlice";
import { useLocation, useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import axios from "axios";
import CheckoutSteps from "../components/CheckoutSteps";

function ShippingScreen() {
  const {shippingAddress} =useSelector((state)=>state.cart);
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const submitHandler=(e)=>{
    e.preventDefault()
    dispatch(saveShippingAddress({address,city,postalCode,country}))
    navigate(`/payment`)
  }
  
  return (
    <FormContainer>
    <CheckoutSteps step1 step2/>
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address" style={{ margin: "1rem 0" }}>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Address"
            value={address?address:''}
            required
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="city" style={{ margin: "1rem 0" }}>
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter City"
            value={city?city:''}
            required
            onChange={(e) => {
              setCity(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="postalCode" style={{ margin: "1rem 0" }}>
          <Form.Label>PostalCode</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter postalCode"
            value={postalCode?postalCode:''}
            required
            onChange={(e) => {
              setPostalCode(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="country" style={{ margin: "1rem 0" }}>
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter country"
            value={country?country:''}
            required
            onChange={(e) => {
              setCountry(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">
            Continue
        </Button>
      </Form>
    </FormContainer>
  );
}

export default ShippingScreen;
