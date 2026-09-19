package com.example.orangeenergycontractapp

import android.content.Context
import androidx.work.Constraints
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager

class ContractRepository(private val context: Context) {
    private val dao = AppDatabase.getDatabase(context).contractDao()

    suspend fun saveDraftAndScheduleSync(draft: ContractDraft) {
        // 1. Always save to local database first
        dao.insertContract(draft)

        // 2. Schedule WorkManager task that runs as soon as network is AVAILABLE
        val constraints = Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build()

        val syncRequest = OneTimeWorkRequestBuilder<SyncWorker>()
            .setConstraints(constraints)
            .build()

        WorkManager.getInstance(context).enqueue(syncRequest)
    }
}