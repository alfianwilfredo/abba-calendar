"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "./event-utils";
import axios from "axios";
import moment from "moment";
export default function DemoApp() {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [initialEvent, setInitialEvent] = useState(INITIAL_EVENTS);
  const [isBusy, setIsBusy] = useState(true);
  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible);
  }

  function handleDateSelect(selectInfo) {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;
    // calendarApi.unselect(); // clear date selection
    if (title) {
      storeEvent(selectInfo, title);
    }
  }

  async function handleEventClick(clickInfo) {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      let { data } = await axios({
        url: "http://localhost:8000/events/destroy",
        method: "delete",
        params: {
          id: clickInfo.event.id,
        },
      });
      if (data.code === 200) {
        alert(data.message[0]);
      } else {
        alert(data.message[0]);
      }
      setCurrentEvents((prev) => {
        return prev.filter((event) => event.id !== clickInfo.event.id);
      });
      clickInfo.event.remove();
    }
  }

  function handleEvents(events) {
    setCurrentEvents(events);
  }

  async function fetchEvents() {
    let { data } = await axios({
      url: "http://localhost:8000/events/lists",
    });
    if (data.code === 200) {
      setInitialEvent(data.result);
      setIsBusy(false);
    } else {
      setIsBusy(false);
      alert(data.message[0]);
    }
  }

  async function storeEvent(info, name) {
    let calendarApi = info.view.calendar;
    calendarApi.unselect(); // clear date selection
    let start = moment(info.start).format("YYYY-MM-DD HH:mm:ss");
    let end = moment(info.end).format("YYYY-MM-DD HH:mm:ss");
    let allDay = info.allDay;
    let { data } = await axios({
      url: "http://localhost:8000/events/store",
      method: "POST",
      data: {
        name,
        start_date: start,
        end_date: end,
        allDay,
      },
    });
    if (data.code === 201) {
      calendarApi.addEvent({
        id: data.result[0].id,
        title: name,
        start: info.startStr,
        end: info.endStr,
        allDay: info.allDay,
      });
      alert(data.message[0]);
    } else {
      alert(data.message[0]);
    }
  }

  async function eventChangeHandler(info) {
    let { data } = await axios({
      url: "http://localhost:8000/events/update",
      method: "patch",
      data: {
        id: info.event.id,
        name: info.event.title,
        start_date: info.event.start,
        end_date: info.event.end,
        allDay: info.event.allDay,
      },
    });
    if (data.code === 200) {
      alert(data.message[0]);
    } else {
      alert(data.message[0]);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
      {isBusy ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <h3>Loading...</h3>
        </div>
      ) : (
        <div className="demo-app">
          <Sidebar
            weekendsVisible={weekendsVisible}
            handleWeekendsToggle={handleWeekendsToggle}
            currentEvents={currentEvents}
          />
          <div className="demo-app-main">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={weekendsVisible}
              initialEvents={initialEvent} // alternatively, use the `events` setting to fetch from a feed
              select={handleDateSelect}
              eventContent={renderEventContent} // custom render function
              eventClick={handleEventClick}
              eventsSet={handleEvents} // called after events are initialized/added/changed/removed
              eventAdd={(data) => {
                storeEvent(data);
              }}
              eventChange={function (data) {
                eventChangeHandler(data);
              }}
              eventRemove={function () {
                console.log("eventRemove");
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

function Sidebar({ weekendsVisible, handleWeekendsToggle, currentEvents }) {
  return (
    <div className="demo-app-sidebar h-screen sticky top-0">
      <div className="demo-app-sidebar-section">
        <h2>Instructions</h2>
        <ul>
          <li>Select dates and you will be prompted to create a new event</li>
          <li>Drag, drop, and resize events</li>
          <li>Click an event to delete it</li>
        </ul>
      </div>
      <div className="demo-app-sidebar-section">
        <label>
          <input
            type="checkbox"
            checked={weekendsVisible}
            onChange={handleWeekendsToggle}
          ></input>
          toggle weekends
        </label>
      </div>
      <div className="demo-app-sidebar-section">
        <h2>All Events ({currentEvents.length})</h2>
        <ul>
          {currentEvents.map((event) => (
            <SidebarEvent key={event.id} event={event} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function SidebarEvent({ event }) {
  return (
    <li key={event.id}>
      <b>
        {formatDate(event.start, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </b>
      <i>{event.title}</i>
    </li>
  );
}
