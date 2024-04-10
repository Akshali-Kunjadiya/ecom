import React, { useEffect } from 'react'
import { Carousel, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    productTopRatedRequest,
    productTopRatedSuccess,
    productTopRatedFail,
  } from "../features/productTopRatedSlice";
  import Loader from './Loader';
  import Message from './Message';
  import axios from "axios";
function ProductCarousel() {
    const dispatch=useDispatch()
    const {error,loading,products}=useSelector(state=>state.productTopRated)
    const listTopProducts = ()=>async () => {
        dispatch(productTopRatedRequest());
        try {
          const { data } = await axios.get(`/api/products/top/`)
          dispatch(productTopRatedSuccess(data));
        } catch (err) {
    
          dispatch(productTopRatedFail(err.responsse && err.responsse.data.detail ? err.response.data.detail : err.message));
        }
      }
      useEffect(()=>{
        dispatch(listTopProducts())
      },[dispatch])
  return (
    loading?<Loader/>:
    error?<Message variant='danger'>{error}</Message>:
    (
        <Carousel pause='hover' className='bg-dark'>
            {products.map(product=>(
                <Carousel.Item key={product._id}>
                    <Link to={`/product/${product._id}`}>
                        <Image src={product.image} alt={product.name} fluid/>
                        <Carousel.Caption className='carousel.caption'>
                            <h4>{product.name}(${product.price})</h4>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    )
  )
}

export default ProductCarousel
