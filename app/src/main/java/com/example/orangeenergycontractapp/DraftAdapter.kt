package com.example.orangeenergycontractapp

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class DraftAdapter(private var drafts: List<ContractDraft>) :
    RecyclerView.Adapter<DraftAdapter.DraftViewHolder>() {

    class DraftViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tvCustomerName: TextView = itemView.findViewById(R.id.tvCustomerName)
        val tvPhone: TextView = itemView.findViewById(R.id.tvPhone)
        val tvOffer: TextView = itemView.findViewById(R.id.tvOffer)
        val tvSyncStatus: TextView = itemView.findViewById(R.id.tvSyncStatus)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): DraftViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_contract_draft, parent, false)
        return DraftViewHolder(view)
    }

    override fun onBindViewHolder(holder: DraftViewHolder, position: Int) {
        val draft = drafts[position]
        holder.tvCustomerName.text = draft.fullName
        holder.tvPhone.text = "Phone: ${draft.phone}"
        holder.tvOffer.text = "Offer: ${draft.offerName}"
        
        if (draft.isSynced) {
            holder.tvSyncStatus.text = "Status: Synced to Cloud"
            holder.tvSyncStatus.setTextColor(0xFF388E3C.toInt()) // Green
        } else {
            holder.tvSyncStatus.text = "Status: Pending Sync"
            holder.tvSyncStatus.setTextColor(0xFFD32F2F.toInt()) // Red
        }
    }

    override fun getItemCount(): Int = drafts.size

    fun updateData(newDrafts: List<ContractDraft>) {
        drafts = newDrafts
        notifyDataSetChanged()
    }
}