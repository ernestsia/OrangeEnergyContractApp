package com.example.orangeenergycontractapp

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

class SyncWorker(
    appContext: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        val database = AppDatabase.getDatabase(applicationContext)
        val dao = database.contractDao()
        val pendingContracts = dao.getUnsyncedContracts()

        if (pendingContracts.isEmpty()) {
            return Result.success()
        }

        val client = OkHttpClient()
        val scriptUrl = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE"

        var allSynced = true

        for (contract in pendingContracts) {
            val json = JSONObject().apply {
                put("fullName", contract.fullName)
                put("address", contract.address)
                put("phone", contract.phone)
                put("idType", contract.idType)
                put("idNumber", contract.idNumber)
                put("email", contract.email)
                put("offerName", contract.offerName)
                put("totalAmount", contract.totalAmount)
                put("agentName", contract.agentName)
                put("agentContact", contract.agentContact)
            }

            val body = json.toString().toRequestBody("application/json; charset=utf-8".toMediaType())
            val request = Request.Builder().url(scriptUrl).post(body).build()

            try {
                val response = client.newCall(request).execute()
                if (response.isSuccessful) {
                    dao.markAsSynced(contract.id)
                } else {
                    allSynced = false
                }
            } catch (e: Exception) {
                e.printStackTrace()
                allSynced = false
            }
        }

        return if (allSynced) Result.success() else Result.retry()
    }
}