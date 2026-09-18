package com.example.orangeenergycontractapp

import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.Button
import android.widget.RadioGroup
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Dropdown menu setup
        val actvIdType = findViewById<AutoCompleteTextView>(R.id.actvIdType)
        val idTypes = arrayOf("NASSCORP ID", "National ID", "Passport", "Driver's License", "Voter ID")
        actvIdType?.setAdapter(ArrayAdapter(this, android.R.layout.simple_dropdown_item_1line, idTypes))

        // Auto-fill pricing based on offer selection
        val rgOffers = findViewById<RadioGroup>(R.id.rgOffers)
        val etSubscriptionFees = findViewById<TextInputEditText>(R.id.etSubscriptionFees)
        val etMonthlyPayment = findViewById<TextInputEditText>(R.id.etMonthlyPayment)

        rgOffers?.setOnCheckedChangeListener { _, checkedId ->
            when (checkedId) {
                R.id.rbEssentialPlus -> {
                    etSubscriptionFees?.setText("2500")
                    etMonthlyPayment?.setText("1300")
                }
                R.id.rbComfortSiaPower -> {
                    etSubscriptionFees?.setText("10000")
                    etMonthlyPayment?.setText("6600")
                }
                R.id.rbPremiumFreezer -> {
                    etSubscriptionFees?.setText("12745")
                    etMonthlyPayment?.setText("12745")
                }
                R.id.rbPremiumFridge -> {
                    etSubscriptionFees?.setText("10000")
                    etMonthlyPayment?.setText("9995")
                }
                else -> {
                    etSubscriptionFees?.setText("")
                    etMonthlyPayment?.setText("")
                }
            }
        }

        val btnSubmit = findViewById<Button>(R.id.btnSubmit)
        btnSubmit?.setOnClickListener {
            val etFullName = findViewById<TextInputEditText>(R.id.etFullName)
            val etPhone = findViewById<TextInputEditText>(R.id.etPhone)
            val etAgentContact = findViewById<TextInputEditText>(R.id.etAgentContact)

            val tilPhone = findViewById<TextInputLayout>(R.id.tilPhone)
            val tilAgentContact = findViewById<TextInputLayout>(R.id.tilAgentContact)

            tilPhone?.error = null
            tilAgentContact?.error = null

            val phone = etPhone?.text?.toString()?.trim().orEmpty()
            val agentContact = etAgentContact?.text?.toString()?.trim().orEmpty()
            val phoneRegex = Regex("^07\\d{8}$")

            var isValid = true

            if (!phoneRegex.matches(phone)) {
                tilPhone?.error = "Phone must be 10 digits starting with 07"
                isValid = false
            }

            if (!phoneRegex.matches(agentContact)) {
                tilAgentContact?.error = "Agent contact must be 10 digits starting with 07"
                isValid = false
            }

            if (isValid) {
                Toast.makeText(this, "Complete Contract Validated!", Toast.LENGTH_SHORT).show()
            }
        }
    }
}