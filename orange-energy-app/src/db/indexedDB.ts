import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { EnergySubscription } from '../types';

interface OrangeEnergyDB extends DBSchema {
  subscriptions: {
    key: string;
    value: EnergySubscription;
    indexes: { 'by-syncStatus': string; 'by-updatedAt': string };
  };
  blobs: {
    key: string;
    value: { id: string; blob: Blob; type: 'signature_customer' | 'signature_agent' | 'doc_id' };
  };
}

let dbPromise: Promise<IDBPDatabase<OrangeEnergyDB>> | null = null;

export function getLocalDB() {
  if (!dbPromise) {
    dbPromise = openDB<OrangeEnergyDB>('orange_energy_offline_v1', 1, {
      upgrade(db) {
        const subStore = db.createObjectStore('subscriptions', { keyPath: 'id' });
        subStore.createIndex('by-syncStatus', 'syncStatus');
        subStore.createIndex('by-updatedAt', 'updatedAt');

        db.createObjectStore('blobs', { keyPath: 'id' });
      },
    });
  }
  return dbPromise;
}

export async function saveLocalDraft(subscription: EnergySubscription): Promise<void> {
  const db = await getLocalDB();
  await db.put('subscriptions', subscription);
}

export async function getLocalDraft(id: string): Promise<EnergySubscription | undefined> {
  const db = await getLocalDB();
  return db.get('subscriptions', id);
}

export async function getAllLocalDrafts(): Promise<EnergySubscription[]> {
  const db = await getLocalDB();
  return db.getAll('subscriptions');
}

export async function saveLocalBlob(
  id: string,
  blob: Blob,
  type: 'signature_customer' | 'signature_agent' | 'doc_id' = 'signature_customer'
): Promise<void> {
  const db = await getLocalDB();
  await db.put('blobs', { id, blob, type });
}

export async function getLocalBlob(id: string): Promise<Blob | undefined> {
  const db = await getLocalDB();
  const record = await db.get('blobs', id);
  return record?.blob;
}

export async function deleteLocalRecord(id: string): Promise<void> {
  const db = await getLocalDB();
  await db.delete('subscriptions', id);
  await db.delete('blobs', `sig_cust_${id}`);
  await db.delete('blobs', `sig_agent_${id}`);
}