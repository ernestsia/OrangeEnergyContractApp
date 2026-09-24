import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { getAllLocalDrafts, getLocalBlob, saveLocalDraft, deleteLocalRecord } from '../db/indexedDB';
import type { EnergySubscription } from '../types';

class SynchronizationEngine {
  private isSyncing = false;
  private listeners: Set<(status: { syncing: boolean; pendingCount: number }) => void> = new Set();

  public subscribe(cb: (status: { syncing: boolean; pendingCount: number }) => void) {
  this.listeners.add(cb);
  return () => {
    this.listeners.delete(cb);
  }
  }
  private notify(syncing: boolean, pendingCount: number) {
    this.listeners.forEach((cb) => cb({ syncing, pendingCount }));
  }

  public async triggerSync(): Promise<{ successCount: number; failedCount: number }> {
    if (this.isSyncing || !navigator.onLine) return { successCount: 0, failedCount: 0 };

    this.isSyncing = true;
    let successCount = 0;
    let failedCount = 0;

    try {
      const localRecords = await getAllLocalDrafts();
      const pendingRecords = localRecords.filter(
        (r) => r.syncStatus === 'READY_FOR_SYNC' || r.syncStatus === 'SYNC_FAILED'
      );

      this.notify(true, pendingRecords.length);

      for (const record of pendingRecords) {
        try {
          record.syncStatus = 'SYNCING';
          await saveLocalDraft(record);

          let customerSigUrl = record.signatures.customerSignatureUrl;
          let agentSigUrl = record.signatures.agentSignatureUrl;

          if (record.signatures.customerSignatureBlobKey) {
            const blob = await getLocalBlob(record.signatures.customerSignatureBlobKey);
            if (blob) {
              const storageRef = ref(storage, `signatures/${record.id}/customer_signature.png`);
              await uploadBytes(storageRef, blob);
              customerSigUrl = await getDownloadURL(storageRef);
            }
          }

          if (record.signatures.agentSignatureBlobKey) {
            const blob = await getLocalBlob(record.signatures.agentSignatureBlobKey);
            if (blob) {
              const storageRef = ref(storage, `signatures/${record.id}/agent_signature.png`);
              await uploadBytes(storageRef, blob);
              agentSigUrl = await getDownloadURL(storageRef);
            }
          }

          const firestorePayload: EnergySubscription = {
            ...record,
            signatures: {
              ...record.signatures,
              customerSignatureUrl: customerSigUrl || '',
              agentSignatureUrl: agentSigUrl || '',
            },
            status: 'SUBMITTED',
            syncStatus: 'SYNCED',
            submittedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const docRef = doc(db, 'energySubscriptions', record.id);
          await setDoc(docRef, {
            ...firestorePayload,
            createdAtServer: serverTimestamp(),
            updatedAtServer: serverTimestamp(),
          }, { merge: true });

          await deleteLocalRecord(record.id);
          successCount++;
        } catch (err: any) {
          console.error(`Sync failed for ${record.id}:`, err);
          record.syncStatus = 'SYNC_FAILED';
          record.syncError = err.message || 'Network write failure.';
          await saveLocalDraft(record);
          failedCount++;
        }
      }
    } finally {
      this.isSyncing = false;
      const remaining = await getAllLocalDrafts();
      const pendingRemaining = remaining.filter((r) => r.syncStatus === 'READY_FOR_SYNC').length;
      this.notify(false, pendingRemaining);
    }

    return { successCount, failedCount };
  }
}

export const syncEngine = new SynchronizationEngine();