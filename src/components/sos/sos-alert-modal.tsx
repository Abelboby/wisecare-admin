'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AlertTriangle, X } from 'lucide-react';
import { SOSAlert, resolveSOSAlert } from '@/services/sos.service';

interface SOSAlertModalProps {
  alert: SOSAlert;
  isOpen: boolean;
  onClose: () => void;
  adminId: string;
}

export default function SOSAlertModal({ alert, isOpen, onClose, adminId }: SOSAlertModalProps) {
  const [notes, setNotes] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  const handleResolve = async () => {
    try {
      setIsResolving(true);
      await resolveSOSAlert(alert.id, adminId, notes);
      onClose();
    } catch (error) {
      console.error('Error resolving alert:', error);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <Dialog.Title className="ml-3 text-lg font-medium">
                      Active SOS Alert
                    </Dialog.Title>
                  </div>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">User</label>
                    <p className="mt-1">{alert.userId}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <p className="mt-1">
                      {alert.location.latitude}, {alert.location.longitude}
                    </p>
                  </div>

                  {alert.deviceInfo && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Device Info</label>
                      <p className="mt-1">
                        {alert.deviceInfo.model} ({alert.deviceInfo.platform})
                        <br />
                        Battery: {alert.deviceInfo.batteryLevel}%
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-700">Resolution Notes</label>
                    <textarea
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter notes about how the alert was resolved..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    onClick={handleResolve}
                    disabled={isResolving}
                  >
                    {isResolving ? 'Resolving...' : 'Resolve Alert'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 