"use client"
import { useState, useEffect  } from 'react'
import { formatDate } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils'
import { Button, Dialog, DialogPanel, DialogTitle, Description, Field, Input, Label } from '@headlessui/react'
import clsx from 'clsx'
import axios from 'axios'

export default function DemoApp() {
  const [weekendsVisible, setWeekendsVisible] = useState(true)
  const [currentEvents, setCurrentEvents] = useState([])
  let [isCreateEventOpen, setIsCreateEventOpen] = useState(false)
  let [isInstructionOpen, setIsInstructionOpen] = useState(false)
  let [name, setName] = useState('')
  let [details, setDetails] = useState('')
  let [startDate, setStartDate] = useState('')
  let [endDate, setEndDate] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible)
  }
  let toggleInstruction = () => setIsInstructionOpen(!isInstructionOpen)
  let toggleCreateEvent = () => setIsCreateEventOpen(!isCreateEventOpen)
  function handleDateSelect(selectInfo) {
    let title = prompt('Please enter a new title for your event')
    console.log(selectInfo);
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    } else {
      console.log("no title");
    }
  }
  function handleEventClick(clickInfo) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }
  }

  async function fetchEvent() {
    const { data } = await axios({
      method: 'get',
      url: 'http://localhost:8000/events/lists',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    setCurrentEvents(data.result)
    setIsLoading(false)
  }
  useEffect(() => {
    fetchEvent()
  }, []);
  function handleEvents(events) {
    setCurrentEvents(events)
  }
  async function createEventHandler() {
    let { data } = await axios({
      method: 'post',
      url: 'http://localhost:8000/events/store',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        name,
        details,
        start_date: startDate,
        end_date: endDate
      }
    })
    if (data.code === 201) {
      fetchEvent()
    } else {
      alert(data.message)
    }
  }

  const handleChange = (event) => {
    switch (event.target.name) {
      case 'name':
        setName(event.target.value)
        break;
      case 'details':
        setDetails(event.target.value)
        break;
      case 'start_date':
        setStartDate(event.target.value)
        break;
      case 'end_date':
        setEndDate(event.target.value)
        break;
      default:
        break;
    }
  }
  return (
    <>
    {isLoading ? <div className='flex justify-center items-center  w-screen'>Loading...</div> : (<>
    <div className='flex justify-center items-center w-screen sm:py-12'>
      <div className='sm:w-3/4 lg:w-4/12'>
        <div className=''>
          <div className='demo-app-sidebar-section'>
            <span className='capitalize'>new here? please read the instructions <button onClick={toggleInstruction}>here</button></span>
          </div>
          <div className='demo-app-sidebar-section'>
            <label>
              <input
                type='checkbox'
                checked={weekendsVisible}
                onChange={handleWeekendsToggle}
              ></input>
              Show Weekends
            </label>
          </div>
          <div className='demo-app-sidebar-section'>
            {
              currentEvents.length ? (
                <button>See all events</button>
              ) : (
                <span>No events</span>
              )
            }
            <pre>
              {JSON.stringify(currentEvents)}
            </pre>
            <ul>
              {currentEvents.map((event) => (
                <SidebarEvent key={event.id} event={event} />
              ))}
            </ul>
          </div>
        </div>
        <div className='py-2'>
          <Button className="bg-white text-black w-full rounded py-2 font-semibold" onClick={toggleCreateEvent}>Create Event</Button>
        </div>
          <div className=''>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView='dayGridMonth'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={weekendsVisible}
            initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
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
    </div>
    <Dialog open={isCreateEventOpen} as="div" className="relative z-10 focus:outline-none" onClose={toggleCreateEvent}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <div className="w-full max-w-md px-4">
                <DialogTitle as="h3" className="text-base/7 font-medium text-white capitalize">
                  new event
                </DialogTitle>
              </div>
              <div className="w-full max-w-md px-4">
                <Field>
                  <Input
                    className={clsx(
                      'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                      'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                    )}
                    type='text'
                    name='name'
                    value={name}
                    onChange={handleChange}
                    placeholder='Name'
                  />
                </Field>
                <Field>
                  <textarea 
                    className={clsx(
                      'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                      'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                    )}
                    name='details'
                    value={details}
                    onChange={handleChange}
                    placeholder='Details'
                  />
                </Field>
                <Field>
                  <input 
                    className={clsx(
                      'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                      'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                    )}
                    type='date'
                    name='start_date'
                    value={startDate}
                    onChange={handleChange}
                    placeholder='Start date'
                  />
                </Field>
                <Field>
                  <input 
                    className={clsx(
                      'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                      'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                    )}
                    type='date'
                    name='end_date'
                    value={endDate}
                    onChange={handleChange}
                    placeholder='End date'
                  />
                </Field>
                <div className='flex justify-end'>
                  <Button onClick={createEventHandler} className="mt-3 w-full items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                    Submit
                  </Button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <Dialog open={isInstructionOpen} as="div" className="relative z-10 focus:outline-none" onClose={toggleInstruction}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle as="h3" className="text-base/7 font-medium text-white capitalize">
                instructions
              </DialogTitle>
              <div className="w-full max-w-md px-4">
                <ul className='list-decimal'>
                  <li>Select dates and you will be prompted to create a new event</li>
                  <li>Click an event to delete it</li>
                </ul>
              </div>
              <div className="mt-4">
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                  onClick={toggleInstruction}
                >
                  Got it, thanks!
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>)}
    </>
  )
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

function SidebarEvent({ event }) {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
      <i>{event.title}</i>
    </li>
  )
}