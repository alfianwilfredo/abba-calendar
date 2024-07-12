"use client";
import { useState, useEffect } from "react";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "./event-utils";
import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
  Field,
  Input,
  Label,
} from "@headlessui/react";
import clsx from "clsx";
import axios from "axios";
import moment from "moment";

export default function DemoApp() {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  let [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  let [isInstructionOpen, setIsInstructionOpen] = useState(false);
  let [name, setName] = useState("");
  let [details, setDetails] = useState("");
  let [selectedEvent, setSelectedEvent] = useState({});
  let [startDate, setStartDate] = useState("");
  let [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { isListOpen, setIsListOpen } = useState(false);
  let [isListEventOpen, setIsListEventOpen] = useState(false);
  let [isModalOpen, setIsModalOpen] = useState(false);
  let [contextModal, setContextModal] = useState("");
  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible);
  }
  let toggleInstruction = () => setIsInstructionOpen(!isInstructionOpen);
  let toggleCreateEvent = () => setIsCreateEventOpen(!isCreateEventOpen);
  let toggleDetails = () => setIsDetailsOpen(!isDetailsOpen);
  let toggleisListOpen = () => setIsListOpen(!isListOpen);
  let toggleListEvent = () => setIsListEventOpen(!isListEventOpen);
  let toggleModal = (context) => {
    setContextModal(context);
    setIsModalOpen(!isModalOpen);
  };
  useEffect(() => {
    fetchEvent();
  }, []);
  function resetForm() {
    setName("");
    setDetails("");
    setStartDate("");
    setEndDate("");
  }
  function handleDateSelect(selectInfo) {
    if (selectInfo.view.type === "dayGridMonth") {
      setStartDate(
        moment(selectInfo.start).startOf("day").format("YYYY-MM-DD HH:mm:ss")
      );
      setEndDate(
        moment(selectInfo.end)
          .endOf("day")
          .subtract(1, "days")
          .format("YYYY-MM-DD HH:mm:ss")
      );
    } else if (
      selectInfo.view.type === "timeGridWeek" ||
      selectInfo.view.type === "timeGridDay"
    ) {
      setStartDate(moment(selectInfo.start).format("YYYY-MM-DD HH:mm:ss"));
      setEndDate(moment(selectInfo.end).format("YYYY-MM-DD HH:mm:ss"));
    }
    toggleCreateEvent();
  }
  function handleEventClick(clickInfo) {
    fetchDetails(clickInfo.event.id);
  }

  let fetchDetails = async (id) => {
    let { data } = await axios({
      method: "get",
      url: "http://localhost:8000/events/details",
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        id,
      },
    });
    if (data.code === 200 && data.result.length) {
      toggleDetails();
      setSelectedEvent(data.result[0]);
    }
  };
  async function fetchEvent() {
    const { data } = await axios({
      method: "get",
      url: "http://localhost:8000/events/lists",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setCurrentEvents(data.result);
    setIsLoading(false);
  }

  function handleEvents(events) {
    console.log(events, "eventseventseventseventsevents");
    setCurrentEvents(events);
  }
  async function createEventHandler() {
    let { data } = await axios({
      method: "post",
      url: "http://localhost:8000/events/store",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        name,
        details,
        start_date: startDate,
        end_date: endDate,
      },
    });
    if (data.code === 201) {
      fetchEvent();
      toggleCreateEvent();
    } else {
      alert(data.message[0]);
    }
  }

  const handleChange = (event) => {
    switch (event.target.name) {
      case "name":
        setName(event.target.value);
        break;
      case "details":
        setDetails(event.target.value);
        break;
      case "start_date":
        setStartDate(event.target.value);
        break;
      case "end_date":
        setEndDate(event.target.value);
        break;
      default:
        break;
    }
  };
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center  w-screen">
          Loading...
        </div>
      ) : (
        <>
          <div className="sm:flex sm:flex-col sm:gap-4">
            <div className="sm:flex sm:flex-col sm:gap-4 sm:p-4">
              <div className="">
                <div>
                  <span className="capitalize">
                    new here? please read the instructions{" "}
                    <button
                      className="hover:underline"
                      onClick={toggleInstruction}
                    >
                      here
                    </button>
                  </span>
                </div>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      checked={weekendsVisible}
                      onChange={handleWeekendsToggle}
                    ></input>
                    Show Weekends
                  </label>
                </div>
                <div className="sm:flex sm:flex-col sm:gap-4 lg:flex lg:flex-row lg:justify-center lg:gap-4">
                  <div>
                    {currentEvents.length ? (
                      <button
                        onClick={toggleListEvent}
                        className="bg-black font-semibold capitalize text-white w-full rounded py-2 px-4"
                      >
                        list events
                      </button>
                    ) : (
                      <span className="bg-black text-white w-full rounded py-2 px-4">
                        No events
                      </span>
                    )}
                  </div>
                  <div>
                    <Button
                      className="bg-black text-white w-full rounded py-2 font-semibold px-4"
                      onClick={toggleCreateEvent}
                    >
                      Create Event
                    </Button>
                  </div>
                </div>
              </div>
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
                initialEvents={currentEvents} // alternatively, use the `events` setting to fetch from a feed
                select={handleDateSelect}
                eventContent={renderEventContent} // custom render function
                eventClick={handleEventClick}
                eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                /* you can update a remote database when these fire:
            eventChange={function(){}}
            eventAdd={function(){}}
            eventRemove={function(){}}
            */
              />
            </div>
          </div>
          <Dialog
            open={isCreateEventOpen}
            as="div"
            className="relative z-10 focus:outline-none"
            onClose={() => {
              toggleCreateEvent(), resetForm();
            }}
          >
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <DialogPanel
                  transition
                  className="w-full max-w-md rounded-xl bg-black/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                >
                  <div className="w-full max-w-md px-4 flex justify-between">
                    <DialogTitle
                      as="h3"
                      className="text-base/7 font-medium  capitalize"
                    >
                      new event
                    </DialogTitle>
                    <button
                      onClick={() => {
                        toggleCreateEvent(), resetForm();
                      }}
                      className="sm:w-5"
                    >
                      <svg
                        className="w-full h-full"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path
                            d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
                            fill="#0F0F0F"
                          ></path>{" "}
                        </g>
                      </svg>
                    </button>
                  </div>
                  <div className="w-full max-w-md px-4">
                    <Field>
                      <Input
                        className={clsx(
                          "mt-3 block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6",
                          "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
                        )}
                        type="text"
                        name="name"
                        value={name}
                        onChange={handleChange}
                        placeholder="Name"
                      />
                    </Field>
                    <Field>
                      <textarea
                        className={clsx(
                          "mt-3 block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6",
                          "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
                        )}
                        name="details"
                        value={details}
                        onChange={handleChange}
                        placeholder="Details"
                      />
                    </Field>
                    <Field>
                      <input
                        className={clsx(
                          "mt-3 block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6",
                          "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
                        )}
                        type="datetime-local"
                        name="start_date"
                        value={startDate}
                        onChange={handleChange}
                        placeholder="Start date"
                      />
                    </Field>
                    <Field>
                      <input
                        className={clsx(
                          "mt-3 block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6",
                          "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
                        )}
                        type="datetime-local"
                        name="end_date"
                        value={endDate}
                        onChange={handleChange}
                        placeholder="End date"
                      />
                    </Field>
                    <div className="flex justify-end">
                      <Button
                        onClick={createEventHandler}
                        className="mt-3 w-full items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
          <Dialog
            open={isInstructionOpen}
            as="div"
            className="relative z-10 focus:outline-none"
            onClose={toggleInstruction}
          >
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <DialogPanel
                  transition
                  className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                >
                  <div className="w-full max-w-md px-4 flex justify-between">
                    <DialogTitle
                      as="h3"
                      className="text-base/7 font-medium text-white capitalize"
                    >
                      instructions
                    </DialogTitle>
                    <button
                      onClick={toggleInstruction}
                      className="sm:w-5 lg:w-7"
                    >
                      <svg
                        className="w-full h-full"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path
                            d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
                            fill="#ffffff"
                          ></path>{" "}
                        </g>
                      </svg>
                    </button>
                  </div>
                  <div className="w-full max-w-md px-4">
                    <ul className="list-decimal">
                      <li className="ml-4">
                        Select dates and you will be prompted to create a new
                        event
                      </li>
                      <li className="ml-4">Click an event to delete it</li>
                    </ul>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
          <Dialog
            open={isDetailsOpen}
            as="div"
            className="relative z-10 focus:outline-none"
            onClose={toggleDetails}
          >
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <DialogPanel
                  transition
                  className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                >
                  <div className="w-full max-w-md px-4 flex justify-between">
                    <DialogTitle
                      as="h3"
                      className="text-base/7 font-medium text-white capitalize"
                    >
                      event details
                    </DialogTitle>
                    <button onClick={toggleDetails} className="sm:w-5 lg:w-7">
                      <svg
                        className="w-full h-full"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path
                            d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
                            fill="#ffffff"
                          ></path>{" "}
                        </g>
                      </svg>
                    </button>
                  </div>
                  <div className="w-full max-w-md flex flex-col px-4 mt-2">
                    <span>name: {selectedEvent.name}</span>
                    <span>details: {selectedEvent.details}</span>
                    <span>
                      start: {moment(selectedEvent.start).format("llll")}
                    </span>
                    <span>end: {moment(selectedEvent.end).format("llll")}</span>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
          <Dialog
            open={isListEventOpen}
            as="div"
            className="relative z-10 focus:outline-none"
            onClose={toggleListEvent}
          >
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <DialogPanel
                  transition
                  className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                >
                  <div className="w-full max-w-md px-4 flex justify-between">
                    <DialogTitle
                      as="h3"
                      className="text-base/7 font-medium text-white capitalize"
                    >
                      list of events
                    </DialogTitle>
                    <button onClick={toggleListEvent} className="sm:w-5 lg:w-7">
                      <svg
                        className="w-full h-full"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path
                            d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
                            fill="#ffffff"
                          ></path>{" "}
                        </g>
                      </svg>
                    </button>
                  </div>
                  <div className="w-full max-w-md px-4 flex flex-col">
                    <ul className="list-decimal">
                      {currentEvents.map((event) => (
                        <SidebarEvent key={event.id} event={event} />
                      ))}
                    </ul>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
        </>
      )}
    </>
  );
}

function renderEventContent(eventInfo) {
  return (
    <div className="w-full max-w-md flex gap-x-2 rounded">
      <b className="text-black">{eventInfo.timeText}</b>
      <i className="text-black">{eventInfo.event.title}</i>
    </div>
  );
}

function SidebarEvent({ event }) {
  return (
    <li className="ml-4" key={event.id}>
      <b>
        {formatDate(event.start, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </b>
      <i> {event.title}</i>
    </li>
  );
}
