import { db } from '@/lib/firebase';
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
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

export interface SOSAlert {
  id: string;
  userId: string;
  timestamp: Timestamp;
  location: {
    latitude: number;
    longitude: number;
  };
  status: 'active' | 'resolved';
  deviceInfo?: {
    model: string;
    batteryLevel: number;
    platform: string;
  };
  resolvedAt?: Timestamp;
  resolvedBy?: string;
  notes?: string;
}

// Listen to active SOS alerts in real-time
export const listenToActiveSOSAlerts = (callback: (alerts: SOSAlert[]) => void) => {
  const alertsRef = collection(db, 'sos_alerts');
  const q = query(
    alertsRef,
    where('status', '==', 'active'),
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

// Get all SOS alerts for the last 24 hours
export const get24HourAlerts = async () => {
  const alertsRef = collection(db, 'sos_alerts');
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const q = query(
    alertsRef,
    where('timestamp', '>=', yesterday),
    orderBy('timestamp', 'desc')
  );

  const snapshot = await getDocs(q);
  const alerts: SOSAlert[] = [];
  snapshot.forEach((doc) => {
    alerts.push({ id: doc.id, ...doc.data() } as SOSAlert);
  });
  return alerts;
};

// Create a new SOS alert
export const createSOSAlert = async (data: Omit<SOSAlert, 'id' | 'timestamp' | 'status'>) => {
  const alertsRef = collection(db, 'sos_alerts');
  const alert = {
    ...data,
    status: 'active',
    timestamp: serverTimestamp(),
  };

  const docRef = await addDoc(alertsRef, alert);
  return docRef.id;
};

// Resolve an SOS alert
export const resolveSOSAlert = async (alertId: string, adminId: string, notes?: string) => {
  const alertRef = doc(db, 'sos_alerts', alertId);
  await updateDoc(alertRef, {
    status: 'resolved',
    resolvedAt: serverTimestamp(),
    resolvedBy: adminId,
    notes: notes || '',
  });
};

// Get total active SOS alerts count
export const getActiveSOSCount = async () => {
  const alertsRef = collection(db, 'sos_alerts');
  const q = query(alertsRef, where('status', '==', 'active'));
  const snapshot = await getDocs(q);
  return snapshot.size;
}; 