package com.example.orangeenergycontractapp

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class DraftsActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: DraftAdapter
    private lateinit var repository: ContractRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Simple programmatically setup list layout
        recyclerView = RecyclerView(this).apply {
            layoutManager = LinearLayoutManager(this@DraftsActivity)
        }
        setContentView(recyclerView)

        repository = ContractRepository(applicationContext)
        adapter = DraftAdapter(emptyList())
        recyclerView.adapter = adapter

        loadDrafts()
    }

    private fun loadDrafts() {
        CoroutineScope(Dispatchers.IO).launch {
            val pendingDrafts = repository.getUnsyncedDrafts()
            withContext(Dispatchers.Main) {
                adapter.updateData(pendingDrafts)
            }
        }
    }
}