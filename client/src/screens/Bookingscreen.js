import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
function Bookingscreen({ match }) {
  const [loading, setLoading] = useState(true);
  const [error, seterror] = useState();
  const [room, setroom] = useState();
  const roomid=match.params.roomid
  const fromdate=moment(match.params.fromdate,'DD-MM-YYYY')
  const todate=moment(match.params.todate,'DD-MM-YYYY')
  const totaldays=moment.duration(todate.diff(fromdate)).asDays()+1

  const [totalamount,settotalamount]=useState() 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    try {
      setLoading(true);
      const data = (
        await axios.post("/api/rooms/getroombyid", {
          roomid: match.params.roomid,
        })
      ).data;
      settotalamount(data.rentperday * totaldays)
      setroom(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      seterror(true);
    }
  }, []);

  async function bookRoom()
  {
     const bookingDetails={
      room,
      userid:JSON.parse(localStorage.getItem('currentUser'))._id,
      fromdate,
      todate,
      totalamount,
      totaldays
     }

     try {
      const result=await axios.post('/api/bookings/bookroom',bookingDetails)
     } catch (error) {
      
     }
  }

  return (
    <div className="m-5">
      {loading ? (
        <h1>
          <Loader />
        </h1>
      ) : room ? (
        <div>
          <div className="row justify-content-center mt-5 bs">
            <div className="col-md-5">
              <h1>{room.name}</h1>
              <img src={room.imageurls[0]} className="bigimg" />
            </div>

            <div className="col-md-5">
              <div style={{ textAlign: "right" }}>
                <h1>Booking Details</h1>
                <hr />

                <b>
                  <p>Name: {JSON.parse(localStorage.getItem('currentUser')).name}</p>
                  <p>From Date : {match.params.fromdate}</p>
                  <p>To Date :{match.params.todate}</p>
                  <p>Max Count:{room.maxcount}</p>
                </b>
              </div>

              <div style={{ textAlign: "right" }}>
                <b>
                  <h1>Amount</h1>
                  <hr />
                  <p>Total days:{totaldays}</p>
                  <p>Rent per day:{room.rentperday} </p>
                  <p>Total Amount:{totalamount}</p>
                </b>
              </div>

              <div style={{ float: "right" }}>
                <button className="btn btn-primary"onClick={bookRoom}>Pay Now</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
}

export default Bookingscreen;
