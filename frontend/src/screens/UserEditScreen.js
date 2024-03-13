import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  userDetailsRequest,
  userDetailsSuccess,
  userDetailsFail,
} from "../features/userDetailsSlice";
import {
  userUpdateAdminRequest,
  userUpdateAdminSuccess,
  userUpdateAdminFail,
  userUpdateAdminReset,
} from "../features/userUpdateAdminSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import FormContainer from "../components/FormContainer";
function UserEditScreen() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setAdmin] = useState(false);
  const { userInfo } = useSelector((state) => state.userlogin);
  const { loading, user, error } = useSelector((state) => state.userDetails);
  const {
    loading: loadingUpdate,
    success,
    error: errorUpdate,
  } = useSelector((state) => state.userUpdateAdmin);
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
      const { data } = await axios.get(`/api/users/${id}/`, config);
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
  const updateAdminUser = (user) => async () => {
    try {
      dispatch(userUpdateAdminRequest());
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/users/update/${user._id}/`,
        user,
        config
      );
      dispatch(userUpdateAdminSuccess());
      dispatch(userDetailsSuccess(data));
    } catch (err) {
      dispatch(
        userUpdateAdminFail(
          err.responsse && err.responsse.data.detail
            ? err.response.data.detail
            : err.message
        )
      );
    }
  };

  useEffect(() => {
    if (success) {
      dispatch(userUpdateAdminReset());
      navigate(`/admin/userlist`);
    } else {
      if (!user.name || user._id !== Number(id)) {
        dispatch(getUserDetails(id));
      } else {
        setName(user.name);
        setEmail(user.email);
        setAdmin(user.isAdmin);
      }
    }
  }, [user, id,success,navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateAdminUser({_id:user._id,name,email,isAdmin}))
  };
  return (
    <div>
      <Link to="/admin/userlist">Go Back</Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate&&<Loader/>}
        {errorUpdate&&<Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" style={{ margin: "1rem 0" }}>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={name}
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
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="isAdmin" style={{ margin: "1rem 0" }}>
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e) => {
                  setAdmin(e.target.checked);
                }}
              ></Form.Check>
            </Form.Group>

            <Form.Group style={{ margin: "1rem 0" }}>
              <Button type="submit" variant="primary">
                Update
              </Button>
            </Form.Group>
          </Form>
        )}
      </FormContainer>
    </div>
  );
}

export default UserEditScreen;
