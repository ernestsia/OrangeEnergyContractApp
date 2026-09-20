package com.example.orangeenergycontractapp

import android.content.Context
import androidx.work.Constraints
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager

class ContractRepository(private val context: Context) {

    private val contractDao = ContractDatabase.getDatabase(context).contractDao()

    suspend fun saveDraftAndScheduleSync(draft: ContractDraft) {
        // 1. Save to local Room DB immediately (works 100% offline)
        contractDao.insertDraft(draft)

        // 2. Define network constraint: trigger sync when connected to the internet
        val constraints = Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build()

        val syncWorkRequest = OneTimeWorkRequestBuilder<SyncWorker>()
            .setConstraints(constraints)
            .build()

        // 3. Enqueue background sync worker
        WorkManager.getInstance(context).enqueue(syncWorkRequest)
    }

    suspend fun getUnsyncedDrafts(): List<ContractDraft> {
        return contractDao.getUnsyncedDrafts()
    }
}