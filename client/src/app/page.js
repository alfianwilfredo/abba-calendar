"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'

export default function Home() {
  const handleDateClick = (arg) => {
    toggleDialog()
  }
  let [isOpen, setIsOpen] = useState(false)
  function toggleDialog() {
    setIsOpen(!isOpen)
  }
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold underline text-center">Abba Calendar!</h1>
      </div>

      <div className="flex flex-col items-center justify-center  py-2">
        <FullCalendar
          plugins={[ dayGridPlugin, interactionPlugin ]}
          dateClick={handleDateClick}
        />
      </div>
      
      <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={toggleDialog}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                Payment successful
              </DialogTitle>
              <p className="mt-2 text-sm/6 text-white/50">
                Your payment has been successfully submitted. We’ve sent you an email with all of the details of your
                order.
              </p>
              <div className="mt-4">
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                  onClick={toggleDialog}
                >
                  Got it, thanks!
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}
