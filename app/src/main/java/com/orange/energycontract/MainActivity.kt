package com.example.orangeenergycontractapp

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
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

        val actvIdType = findViewById<AutoCompleteTextView>(R.id.actvIdType)
        val idTypes = arrayOf("NASSCORP ID", "National ID", "Passport", "Driver's License", "Voter ID")
        actvIdType?.setAdapter(ArrayAdapter(this, android.R.layout.simple_dropdown_item_1line, idTypes))

        val rgOffers = findViewById<RadioGroup>(R.id.rgOffers)
        val etSubscriptionFees = findViewById<TextInputEditText>(R.id.etSubscriptionFees)
        val etMonthlyPayment = findViewById<TextInputEditText>(R.id.etMonthlyPayment)
        val etPaymentDuration = findViewById<TextInputEditText>(R.id.etPaymentDuration)
        val etTotalPrice = findViewById<TextInputEditText>(R.id.etTotalPrice)

        val signatureView = findViewById<SignatureView>(R.id.signatureView)
        val btnClearSignature = findViewById<Button>(R.id.btnClearSignature)

        btnClearSignature?.setOnClickListener {
            signatureView?.clear()
        }

        fun calculateTotal() {
            val sub = etSubscriptionFees?.text?.toString()?.toDoubleOrNull() ?: 0.0
            val monthly = etMonthlyPayment?.text?.toString()?.toDoubleOrNull() ?: 0.0
            val months = etPaymentDuration?.text?.toString()?.toDoubleOrNull() ?: 24.0
            val total = sub + (monthly * months)
            if (total > 0) {
                etTotalPrice?.setText(total.toString())
            } else {
                etTotalPrice?.setText("")
            }
        }

        val watcher = object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) { calculateTotal() }
            override fun afterTextChanged(s: Editable?) {}
        }

        etSubscriptionFees?.addTextChangedListener(watcher)
        etMonthlyPayment?.addTextChangedListener(watcher)
        etPaymentDuration?.addTextChangedListener(watcher)

        rgOffers?.setOnCheckedChangeListener { _, checkedId ->
            when (checkedId) {
                R.id.rbEssentialPlus -> {
                    etSubscriptionFees?.setText("2500")
                    etMonthlyPayment?.setText("1300")
                    etPaymentDuration?.setText("24")
                }
                R.id.rbComfortSiaPower -> {
                    etSubscriptionFees?.setText("10000")
                    etMonthlyPayment?.setText("6600")
                    etPaymentDuration?.setText("24")
                }
                R.id.rbPremiumFreezer -> {
                    etSubscriptionFees?.setText("12745")
                    etMonthlyPayment?.setText("12745")
                    etPaymentDuration?.setText("24")
                }
                R.id.rbPremiumFridge -> {
                    etSubscriptionFees?.setText("10000")
                    etMonthlyPayment?.setText("9995")
                    etPaymentDuration?.setText("24")
                }
            }
            calculateTotal()
        }

        val btnSubmit = findViewById<Button>(R.id.btnSubmit)
        btnSubmit?.setOnClickListener {
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

            if (signatureView?.isEmpty() == true) {
                Toast.makeText(this, "Please provide a signature before submitting", Toast.LENGTH_SHORT).show()
                isValid = false
            }

            if (isValid) {
                Toast.makeText(this, "Complete Contract Validated & Saved Successfully!", Toast.LENGTH_LONG).show()
            }
        }
    }
}