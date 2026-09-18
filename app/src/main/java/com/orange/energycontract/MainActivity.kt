package com.example.orangeenergycontractapp

import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val tilFullName = findViewById<TextInputLayout>(R.id.tilFullName)
        val tilPhone = findViewById<TextInputLayout>(R.id.tilPhone)
        val tilIdType = findViewById<TextInputLayout>(R.id.tilIdType)
        val tilIdNumber = findViewById<TextInputLayout>(R.id.tilIdNumber)
        val tilSerialNumber = findViewById<TextInputLayout>(R.id.tilSerialNumber)
        val tilSubscriptionFees = findViewById<TextInputLayout>(R.id.tilSubscriptionFees)
        val tilAgentName = findViewById<TextInputLayout>(R.id.tilAgentName)
        val tilAgentContact = findViewById<TextInputLayout>(R.id.tilAgentContact)

        val etFullName = findViewById<TextInputEditText>(R.id.etFullName)
        val etPhone = findViewById<TextInputEditText>(R.id.etPhone)
        val actvIdType = findViewById<AutoCompleteTextView>(R.id.actvIdType)
        val etIdNumber = findViewById<TextInputEditText>(R.id.etIdNumber)
        val etSerialNumber = findViewById<TextInputEditText>(R.id.etSerialNumber)
        val etSubscriptionFees = findViewById<TextInputEditText>(R.id.etSubscriptionFees)
        val etAgentName = findViewById<TextInputEditText>(R.id.etAgentName)
        val etAgentContact = findViewById<TextInputEditText>(R.id.etAgentContact)
        val btnSubmit = findViewById<Button>(R.id.btnSubmit)

        // Setup ID Type dropdown items (including NASSCORP ID)
        val idTypes = arrayOf("NASSCORP ID", "National ID", "Passport", "Driver's License", "Voter ID")
        val adapter = ArrayAdapter(this, android.R.layout.simple_dropdown_item_1line, idTypes)
        actvIdType?.setAdapter(adapter)

        btnSubmit?.setOnClickListener {
            tilFullName?.error = null
            tilPhone?.error = null
            tilIdType?.error = null
            tilIdNumber?.error = null
            tilSerialNumber?.error = null
            tilSubscriptionFees?.error = null
            tilAgentName?.error = null
            tilAgentContact?.error = null

            val fullName = etFullName?.text?.toString()?.trim().orEmpty()
            val phone = etPhone?.text?.toString()?.trim().orEmpty()
            val idType = actvIdType?.text?.toString()?.trim().orEmpty()
            val idNumber = etIdNumber?.text?.toString()?.trim().orEmpty()
            val serialNumber = etSerialNumber?.text?.toString()?.trim().orEmpty()
            val subscriptionFees = etSubscriptionFees?.text?.toString()?.trim().orEmpty()
            val agentName = etAgentName?.text?.toString()?.trim().orEmpty()
            val agentContact = etAgentContact?.text?.toString()?.trim().orEmpty()

            var isValid = true

            if (fullName.isEmpty()) {
                tilFullName?.error = "Customer Name is required"
                isValid = false
            }

            // Enforce strict 10-digit number starting with 07xxxxxxxx
            val phoneRegex = Regex("^07\\d{8}$")
            if (phone.isEmpty()) {
                tilPhone?.error = "Phone number is required"
                isValid = false
            } else if (!phoneRegex.matches(phone)) {
                tilPhone?.error = "Phone number must be 10 digits starting with 07"
                isValid = false
            }

            if (idType.isEmpty()) {
                tilIdType?.error = "Please select an ID Type"
                isValid = false
            }

            if (idNumber.isEmpty()) {
                tilIdNumber?.error = "ID Number is required"
                isValid = false
            }

            if (serialNumber.isEmpty()) {
                tilSerialNumber?.error = "Kit Serial Number is required"
                isValid = false
            }

            if (subscriptionFees.isEmpty()) {
                tilSubscriptionFees?.error = "Subscription Fees amount is required"
                isValid = false
            }

            if (agentName.isEmpty()) {
                tilAgentName?.error = "OE Installer/Agent Name is required"
                isValid = false
            }

            if (agentContact.isEmpty()) {
                tilAgentContact?.error = "OE Installer/Agent Contact is required"
                isValid = false
            } else if (!phoneRegex.matches(agentContact)) {
                tilAgentContact?.error = "Agent contact must be 10 digits starting with 07"
                isValid = false
            }

            if (isValid) {
                Toast.makeText(this, "Contract details validated!", Toast.LENGTH_SHORT).show()
            }
        }
    }
}