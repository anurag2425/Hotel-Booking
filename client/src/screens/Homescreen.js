import React, { useEffect, useState } from "react";
import axios from "axios";
import "antd/dist/reset.css";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import { DatePicker, Space } from "antd";

const { RangePicker } = DatePicker;

function Homescreen() {
  const [rooms, setrooms] = useState([]);
  const [loading, setLoading] = useState();
  const [error, seterror] = useState();
  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const [duplicaterooms, setduplicaterooms] = useState([]);
  useEffect(async () => {
    try {
      setLoading(true);
      const data = (await axios.get("/api/rooms/getallrooms")).data;
      setrooms(data);
      setduplicaterooms(data);
      setLoading(false);
    } catch (error) {
      seterror(true);
      console.log(error);
      setLoading(false);
    }
  }, []);
  function filterByDate(dates) {
    setfromdate(moment(dates[0]).format("DD-MM-YYYY"));
    settodate(moment(dates[1]).format("DD-MM-YYYY"));

    var temprooms = [];
    var availbility = false;
    for (const room of duplicaterooms) {
      if (room.currentbookings.length > 0) {
        for (const booking of room.currentbookings) {
          if (
            !moment(moment(dates[0]).format("DD-MM-YYYY")).isBetween(
              booking.fromdate,
              booking.todate
            ) &&
            !moment(moment(dates[1]).format("DD-MM-YYYY")).isBetween(
              booking.fromdate,
              booking.todate
            )
          ) {
            if (
              moment(dates[0]).format("DD-MM-YYYY") !== booking.fromdate &&
              moment(dates[0]).format("DD-MM-YYYY") !== booking.todate &&
              moment(dates[1]).format("DD-MM-YYYY") !== booking.fromdate &&
              moment(dates[1]).format("DD-MM-YYYY") !== booking.todate
            ) {
              availbility = true;
            }
          }
        }
      }
      if (availbility===true|| room.currentbookings.length===0)
        {
          temprooms.push(room)
        }
        setrooms({temproom})
    }
  }
  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-md-3">
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : rooms.length > 1 ? (
          rooms.map((room) => {
            return;
            <div className="col-md-9 mt-3">
              <Room room={room} fromdate={fromdate} todate={todate} />
            </div>;
          })
        ) : (
          <Error />
        )}
      </div>
    </div>
  );
}

export default Homescreen;
