import { db } from '../lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  orderBy,
  Timestamp,
  getDocs,
} from 'firebase/firestore';

export interface SOSAlert {
  id: string;
  userId: string;
  timestamp: Timestamp;
  location: {
    lat: number;
    lng: number;
  };
  status: 'pending' | 'resolved';
  deviceInfo?: {
    model: string;
    platform: string;
    version: string;
  };
  batteryLevel?: number;
}

export const listenToSOSAlerts = (callback: (alerts: SOSAlert[]) => void) => {
  const alertsRef = collection(db, 'sos_alerts');
  const q = query(
    alertsRef,
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const alerts: SOSAlert[] = [];
    snapshot.forEach((doc) => {
      alerts.push({ id: doc.id, ...doc.data() } as SOSAlert);
    });
    callback(alerts);
  });
};

export const getPendingAlerts = async () => {
  const alertsRef = collection(db, 'sos_alerts');
  const q = query(
    alertsRef,
    where('status', '==', 'pending'),
    orderBy('timestamp', 'desc')
  );

  const snapshot = await getDocs(q);
  const alerts: SOSAlert[] = [];
  snapshot.forEach((doc) => {
    alerts.push({ id: doc.id, ...doc.data() } as SOSAlert);
  });
  return alerts;
};

export const resolveSOSAlert = async (alertId: string) => {
  const alertRef = doc(db, 'sos_alerts', alertId);
  await updateDoc(alertRef, {
    status: 'resolved',
    resolvedAt: Timestamp.now(),
  });
};

export const getActiveUsersCount = async () => {
  const usersRef = collection(db, 'users');
  const q = query(
    usersRef,
    where('lastActive', '>=', Timestamp.fromDate(new Date(Date.now() - 15 * 60 * 1000))) // Users active in last 15 minutes
  );
  
  const snapshot = await getDocs(q);
  return snapshot.size;
}; 