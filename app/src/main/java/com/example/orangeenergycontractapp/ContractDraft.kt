package com.example.orangeenergycontractapp

import androidx.room.Entity
import androidx.room.PrimaryKey

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