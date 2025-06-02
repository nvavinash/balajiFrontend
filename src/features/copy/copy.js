import React, {useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteItemFromCartAsync,
  selectItems,
  selectCartStatus,
  updateCartAsync,
  selectCartLoaded,
} from "./cartSlice";

import { Link, Navigate } from "react-router-dom";
import Modal from "../common/Modal";

export default function Cart() {
  
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const cartLoaded = useSelector(selectCartLoaded);
  const status = useSelector(selectCartStatus);

  const [openModal, setOpenModal] = useState(null);
 

  const totalAmount = items.reduce((amount, item) => {
    const price = item.product.discountPrice ? item.product.discountPrice : item.product.price;
    return price * item.quantity + amount;
  }, 0);

  const totalItems = items.reduce((total, item) => {
    return item.quantity + total;
  }, 0);

  const handleQuantity = (e, item) => {
    dispatch(updateCartAsync({ id:item.id, quantity: +e.target.value }));
   // console.log(e.target.value);
  };

  const handleRemove = (e, id) => {
    dispatch(deleteItemFromCartAsync(id));
  };

  // useEffect(() => {
  //   // Do something when items array changes
  // }, [items]);

  return (
    <>
      {!items.length && cartLoaded && <Navigate to="/" replace={true}></Navigate>}

      <div className="mx-auto mt-24 bg-white max-w-7xl px-4 sm:px-6 lg-px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {" "}
          Shopping Cart
        </h1>
        <div className="mt-8 border-t border-gray-200 px-4 py-6 sm:px-6">
          <div className="flow-root">
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.imageAlt}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <a href={item.product.id}>{item.product.title}</a>
                        </h3>
                        {item.product.discountPrice && (
                          <p className="line-through text-gray-700">
                            Rs.{item.product.price}
                          </p>
                        )}
                        {item.product.discountPrice ? (
                          <p className="ml-2">Rs. {item.product.discountPrice}</p>
                        ) : (
                          <p className="ml-2 strike-through">Rs.{item.product.price}</p>
                        )} 
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.brand}
                        {item.product.id}
                      </p> 
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="text-gray-500 mx-50">
                        <label
                          htmlFor="password"
                          className="inline mr-5 text-sm font-medium leading-6 text-gray-900"
                        >
                          Quantity
                        </label>
                        <select
                          onChange={(e) => handleQuantity(e, item)}
                          value={item.quantity}
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                        </select>
                      </div>

                      <div className="flex">
                        <Modal
                          title={`Delete ${item.product.title}`}
                          message="Are You Sure..?"
                          dangerOption="Delete"
                          cancelOption="Cancel"
                          dangerAction={(e)=>handleRemove(e,item.id)}
                          cancelAction = {()=> setOpenModal(-1)}
                          showModal = {openModal === item.id}
                        ></Modal>
                        {item.product.id && (
                          <button
                            onClick={(e) =>{setOpenModal(item.id)} }
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p>Rs. {totalAmount}</p>
          </div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Total Items in Cart</p>
            <p>{totalItems} items</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            Shipping and taxes calculated at checkout.
          </p>
         {status !== "loading" && <div className="mt-6">
            <Link
              to="/checkOutPage"
              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Checkout
            </Link>
          </div>}
          <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
            <p>
              or{" "}
              <Link to="/">
                <button
                  type="button"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}