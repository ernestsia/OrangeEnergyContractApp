package com.example.orangeenergycontractapp

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(entities = [ContractDraft::class], version = 1, exportSchema = false)
abstract class ContractDatabase : RoomDatabase() {

    abstract fun contractDao(): ContractDao

    companion object {
        @Volatile
        private var INSTANCE: ContractDatabase? = null

        fun getDatabase(context: Context): ContractDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    ContractDatabase::class.java,
                    "orange_energy_contract_db"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}