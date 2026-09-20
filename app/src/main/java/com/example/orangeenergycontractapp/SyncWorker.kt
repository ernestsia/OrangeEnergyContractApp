package com.example.orangeenergycontractapp

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await

class SyncWorker(
    appContext: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        val database = ContractDatabase.getDatabase(applicationContext)
        val dao = database.contractDao()
        val firestore = FirebaseFirestore.getInstance()

        return try {
            val unsyncedDrafts = dao.getUnsyncedDrafts()

            for (draft in unsyncedDrafts) {
                // Construct payload document for Firestore
                val contractData = hashMapOf(
                    "fullName" to draft.fullName,
                    "address" to draft.address,
                    "phone" to draft.phone,
                    "idType" to draft.idType,
                    "idNumber" to draft.idNumber,
                    "email" to draft.email,
                    "offerName" to draft.offerName,
                    "totalAmount" to draft.totalAmount,
                    "agentName" to draft.agentName,
                    "agentContact" to draft.agentContact,
                    "createdAt" to draft.createdAt,
                    "syncedAt" to System.currentTimeMillis()
                )

                // Upload document to "contracts" collection in Firestore
                firestore.collection("contracts")
                    .add(contractData)
                    .await()

                // Mark as synced locally in Room DB
                dao.updateDraft(draft.copy(isSynced = true))
            }

            Result.success()
        } catch (e: Exception) {
            e.printStackTrace()
            Result.retry()
        }
    }
}