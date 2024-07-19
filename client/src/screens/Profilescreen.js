import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from "sweetalert2";
import { Tag } from "antd";

const { TabPane } = Tabs;

function Profilescreen() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="ml-3 mt-3">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Profile" key="1">
          <h1>My Profile</h1>
          <br />
          <h1>Name : {user?.name}</h1>
          <h1>Email : {user?.email}</h1>
          <h1>isAdmin : {user?.isAdmin ? "YES" : "No"}</h1>
        </TabPane>
        <TabPane tab="Bookings" key="2">
          <MyBookings />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Profilescreen;

export function MyBookings() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [bookings, setbookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, seterror] = useState();

  useEffect(() => {
    const postData = async () => {
      try {
        setLoading(true);
        const data = await (
          await axios.post("/api/bookings/getbookingsbyuserid", {
            userid: user._id,
          })
        ).data;
        setbookings(data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        seterror(err);
      }
    };
    postData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function cancelBooking(bookingid, roomid) {
    try {
      setLoading(true);
      const res = await (
        await axios.post("/api/bookings/cancelbooking", { bookingid, roomid })
      ).data;
      console.log(res);
      setLoading(false);
      Swal.fire("Congrats", "Booking Cancelled Successfully!", "success").then(
        (res) => window.location.reload()
      );
    } catch (err) {
      console.log(err);
      setLoading(false);
      Swal.fire("Oops! ", "Something went wrong", "error");
    }
  }
  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          {loading && <Loader />}
          {error && <Error message={error} />}
          <h1>My Bookings</h1>
          {bookings &&
            bookings.map((booking) => (
              <>
                <div className="bs">
                  <h1>{booking.room}</h1>
                  <p>BookingId : {booking._id}</p>
                  <p>
                    <b>CheckIn</b> : {booking.fromdate}
                  </p>
                  <p>
                    <b>CheckOut</b> : {booking.todate}
                  </p>
                  <p>
                    <b>Amount</b> : {booking.totalamount}
                  </p>
                  <p>
                    <b>Status</b> :{" "}
                    {booking.status === "booked" ? (
                      <Tag color="green">Confirmed</Tag>
                    ) : (
                      <Tag color="red">Cancelled</Tag>
                    )}
                  </p>
                  {booking.status !== "canceled" && (
                    <div className="text-right">
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          cancelBooking(booking._id, booking.roomid);
                        }}
                      >
                        CANCEL BOOKING
                      </button>
                    </div>
                  )}
                </div>
              </>
            ))}
        </div>
      </div>
    </div>
  );
}
