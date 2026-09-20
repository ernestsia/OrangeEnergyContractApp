package com.example.orangeenergycontractapp

import androidx.lifecycle.LiveData
import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update

@Dao
interface ContractDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDraft(draft: ContractDraft): Long

    @Query("SELECT * FROM contracts WHERE isSynced = 0")
    suspend fun getUnsyncedDrafts(): List<ContractDraft>

    @Update
    suspend fun updateDraft(draft: ContractDraft)

    @Query("UPDATE contracts SET isSynced = 1 WHERE id = :id")
    suspend fun markAsSynced(id: Long)

    @Query("SELECT COUNT(*) FROM contracts WHERE isSynced = 1")
    fun getSyncedCount(): LiveData<Int>

    @Query("SELECT COUNT(*) FROM contracts WHERE isSynced = 0")
    fun getPendingCount(): LiveData<Int>
}