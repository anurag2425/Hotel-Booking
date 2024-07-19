import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import Swal from "sweetalert2";

function Bookingscreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [room, setRoom] = useState(null);
  const [totalamount, setTotalAmount] = useState(0);

  const { roomid, fromdate, todate } = useParams();
  const startDate = moment(fromdate, "DD-MM-YYYY");
  const endDate = moment(todate, "DD-MM-YYYY");
  const totaldays = endDate.diff(startDate, "days") + 1;

  useEffect(() => {
    async function fetchRoomData() {
      try {
        setLoading(true);
        const { data } = await axios.post("/api/rooms/getroombyid", {
          roomid: roomid,
        });
        setTotalAmount(data.rentperday * totaldays);
        setRoom(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching room data:", error);
        setLoading(false);
        setError(true);
      }
    }

    fetchRoomData();
  }, [roomid, totaldays]);

  useLayoutEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  async function bookRoom() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      // Handle case where user is not logged in or currentUser is null
      console.error("User not logged in");
      // Example: Redirect to login page or show error message
      return;
    }

    const bookingDetails = {
      room,
      userid: currentUser._id,
      fromdate: startDate,
      todate: endDate,
      totalamount,
      totaldays,
    };

    try {
      const result = await (
        await axios.post("/api/bookings/bookroom", bookingDetails)
      ).data;
      // Handle success if needed
      console.log(result);
      Swal.fire("Congrats", "Booking done successfully", "success").then(
        (res) => (window.location.href = "/profile")
      );
    } catch (error) {
      console.error("Error booking room:", error);
      Swal.fire("Oops!", "Something went wrong", "error");
      // Handle booking error, e.g., show error message to user
    }
  }

  if (loading) return <Loader />;
  if (error || !room) return <Error />;

  return (
    <div className="m-5">
      <div className="row justify-content-center mt-5 bs">
        <div className="col-md-5">
          <h1>{room.name}</h1>
          <img src={room.imageurls[0]} className="bigimg" alt={room.name} />
        </div>

        <div className="col-md-5">
          <div style={{ textAlign: "right" }}>
            <h1>Booking Details</h1>
            <hr />

            <b>
              <p>
                Name: {JSON.parse(localStorage.getItem("currentUser")).name}
              </p>
              <p>From Date : {startDate.format("DD-MM-YYYY")}</p>
              <p>To Date : {endDate.format("DD-MM-YYYY")}</p>
              <p>Max Count: {room.maxcount}</p>
            </b>
          </div>

          <div style={{ textAlign: "right" }}>
            <b>
              <h1>Amount</h1>
              <hr />
              <p>Total days: {totaldays}</p>
              <p>Rent per day: {room.rentperday} </p>
              <p>Total Amount: {totalamount}</p>
            </b>
          </div>

          <div style={{ float: "right" }}>
            <button className="btn btn-primary" onClick={bookRoom}>
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookingscreen;
