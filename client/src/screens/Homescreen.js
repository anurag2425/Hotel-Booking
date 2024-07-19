import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import "antd/dist/reset.css";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

function Homescreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fromDate, setFromDate] = useState(null); // Changed to null to avoid defaulting to today
  const [toDate, setToDate] = useState(null); // Changed to null to avoid defaulting to today
  const [duplicateRooms, setDuplicateRooms] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [type, setType] = useState("all");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = (await axios.get("/api/rooms/getallrooms")).data;
        setRooms(data);
        setDuplicateRooms(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        console.log(error);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  useLayoutEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  function filterByDate(dates) {
    const start = moment(dates[0]);
    const end = moment(dates[1]);

    // setFromDate(start.isValid() ? start.format("DD-MM-YYYY") : null);
    // setToDate(end.isValid() ? end.format("DD-MM-YYYY") : null);
    setFromDate(start.format("DD-MM-YYYY"));
    setToDate(end.format("DD-MM-YYYY"));

    const tempRooms = duplicateRooms.filter((room) => {
      let available = true;
      if (room.currentbookings.length > 0) {
        for (const booking of room.currentbookings) {
          const bookingStart = moment(booking.fromdate, "DD-MM-YYYY");
          const bookingEnd = moment(booking.todate, "DD-MM-YYYY");

          // Check if the selected range overlaps with any existing booking
          if (
            start.isSameOrBefore(bookingEnd, "day") &&
            end.isSameOrAfter(bookingStart, "day")
          ) {
            available = false;
            break;
          }
        }
      }
      return available;
    });

    setRooms(tempRooms);
  }

  function filterBySearch() {
    const tempRooms = duplicateRooms.filter((room) =>
      room.name.toLowerCase().includes(searchKey.toLowerCase())
    );

    setRooms(tempRooms);
  }

  function filterByType(e) {
    setType(e);
    if (e !== "all") {
      const tempRooms = duplicateRooms.filter(
        (room) => room.type.toLowerCase() === e.toLowerCase()
      );
      setRooms(tempRooms);
    } else {
      setRooms(duplicateRooms);
    }
  }

  return (
    <div className="container">
      <div className="row mt-5 bs">
        <div className="col-md-3">
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
        </div>

        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Search rooms"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            onKeyUp={filterBySearch}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-control"
            value={type}
            onChange={(e) => filterByType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="delux">Delux</option>
            <option value="non-delux">Non Delux</option>
          </select>
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : error ? (
          <Error />
        ) : (
          rooms.map((room) => (
            <div className="col-md-9 mt-3" key={room._id}>
              <Room room={room} fromdate={fromDate} todate={toDate} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Homescreen;
