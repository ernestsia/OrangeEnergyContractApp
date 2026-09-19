package com.example.orangeenergycontractapp

import android.content.Context
import androidx.lifecycle.LiveData
import androidx.room.Dao
import androidx.room.Database
import androidx.room.Entity
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.Room
import androidx.room.RoomDatabase

@Entity(tableName = "contracts")
data class ContractDraft(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val fullName: String,
    val address: String,
    val phone: String,
    val idType: String,
    val idNumber: String,
    val email: String,
    val offerName: String,
    val totalAmount: String,
    val agentName: String,
    val agentContact: String,
    val isSynced: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)

@Dao
interface ContractDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertContract(contract: ContractDraft): Long

    @Query("SELECT * FROM contracts WHERE isSynced = 0")
    suspend fun getUnsyncedContracts(): List<ContractDraft>

    @Query("UPDATE contracts SET isSynced = 1 WHERE id = :id")
    suspend fun markAsSynced(id: Long)

    @Query("SELECT COUNT(*) FROM contracts WHERE isSynced = 1")
    fun getSyncedCount(): LiveData<Int>

    @Query("SELECT COUNT(*) FROM contracts WHERE isSynced = 0")
    fun getPendingCount(): LiveData<Int>
}

@Database(entities = [ContractDraft::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun contractDao(): ContractDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "orange_energy_db"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}