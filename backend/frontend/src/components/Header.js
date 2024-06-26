import React from "react";
import { Navbar, Nav, Row, Container, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { userLogout } from '../features/userLoginSlice'
import { userDetailsReset } from '../features/userDetailsSlice'
import { orderListReset } from "../features/orderListSlice";
import { userListReset } from "../features/userListSlice";
import { Link, useLocation,useNavigate } from "react-router-dom";
import SearchBox from "./SearchBox";
function Header() {
  const { userInfo } = useSelector((state) => state.userlogin);
  const dispatch=useDispatch();
  const navigate = useNavigate();
  const logoutHandler=()=>{
    dispatch(userLogout())
    dispatch(userDetailsReset())
    dispatch(orderListReset())
    dispatch(userListReset())
    // navigate('/')
  }
 
  return (
    <Navbar expand="lg" bg="dark" variant="dark" collapseOnSelect>
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>ProdShop</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <SearchBox/>
          <Nav className="ms-auto ml-auto my-2 my-lg-0" navbarScroll>
            <LinkContainer to="/cart">
              <Nav.Link>
                <i className="fas fa-shopping-cart"></i>Cart
              </Nav.Link>
            </LinkContainer>

            {userInfo ? (
              <NavDropdown title={userInfo.name} id="username">
                <LinkContainer to="/profile">
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Item
                  onClick={() => {
                    logoutHandler();
                  }}
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link>
                  <i className="fas fa-user"></i>Login
                </Nav.Link>
              </LinkContainer>
            )}
            {userInfo&&userInfo.isAdmin && (
              <NavDropdown title='Admin' id="adminmenu">
                <LinkContainer to="/admin/userlist">
                  <NavDropdown.Item>Users</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/productlist">
                  <NavDropdown.Item>Products</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/orderlist">
                  <NavDropdown.Item>Orders</NavDropdown.Item>
                </LinkContainer>
                
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
