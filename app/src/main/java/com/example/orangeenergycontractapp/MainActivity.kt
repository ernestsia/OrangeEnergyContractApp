package com.example.orangeenergycontractapp

import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.Html
import android.text.TextWatcher
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.Button
import android.widget.RadioButton
import android.widget.RadioGroup
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Repository setup
        val repository = ContractRepository(applicationContext)

        // Dropdown setup
        val actvIdType = findViewById<AutoCompleteTextView>(R.id.actvIdType)
        val idTypes = arrayOf("NASSCORP ID", "National ID", "Passport", "Driver's License", "Voter ID")
        actvIdType?.setAdapter(ArrayAdapter(this, android.R.layout.simple_dropdown_item_1line, idTypes))

        // Radio Buttons & Offers Setup
        val rb1 = findViewById<RadioButton>(R.id.rbEssentialPlusRevamp)
        val rb2 = findViewById<RadioButton>(R.id.rbComfortPlusSunking)
        val rb3 = findViewById<RadioButton>(R.id.rbComfortSiaPower)
        val rb4 = findViewById<RadioButton>(R.id.rbComfortPremiumFridge)
        val rb5 = findViewById<RadioButton>(R.id.rbComfortPremiumFreezer)

        rb1?.text = Html.fromHtml("<b>Essential Plus Revamp</b><br/>Subscription Fees: $2,500 LRD | Duration: 24 mos | Monthly: $1,300 LRD", Html.FROM_HTML_MODE_LEGACY)
        rb2?.text = Html.fromHtml("<b>Comfort Plus Sunking</b><br/>Subscription Fees: $5,250 LRD | Duration: 24 mos | Monthly: $6,600 LRD", Html.FROM_HTML_MODE_LEGACY)
        rb3?.text = Html.fromHtml("<b>Comfort Sia Power</b><br/>Subscription Fees: $10,000 LRD | Duration: 24 mos | Monthly: $6,600 LRD", Html.FROM_HTML_MODE_LEGACY)
        rb4?.text = Html.fromHtml("<b>Comfort Premium - Fridge</b><br/>Subscription Fees: $10,000 LRD | Duration: 24 mos | Monthly: $9,995 LRD", Html.FROM_HTML_MODE_LEGACY)
        rb5?.text = Html.fromHtml("<b>Comfort Premium - Freezer</b><br/>Subscription Fees: $12,745 LRD | Duration: 24 mos | Monthly: $12,745 LRD", Html.FROM_HTML_MODE_LEGACY)

        // Form Field References
        val rgOffers = findViewById<RadioGroup>(R.id.rgOffers)
        val etSubscriptionFees = findViewById<TextInputEditText>(R.id.etSubscriptionFees)
        val etMonthlyPayment = findViewById<TextInputEditText>(R.id.etMonthlyPayment)
        val etPaymentDuration = findViewById<TextInputEditText>(R.id.etPaymentDuration)
        val etTotalPrice = findViewById<TextInputEditText>(R.id.etTotalPrice)

        val etFullName = findViewById<TextInputEditText>(R.id.etFullName)
        val etAddress = findViewById<TextInputEditText>(R.id.etAddress)
        val etPhone = findViewById<TextInputEditText>(R.id.etPhone)
        val tilPhone = findViewById<TextInputLayout>(R.id.tilPhone)
        val etIdNumber = findViewById<TextInputEditText>(R.id.etIdNumber)
        val etEmail = findViewById<TextInputEditText>(R.id.etEmail)
        val etAgentName = findViewById<TextInputEditText>(R.id.etAgentName)
        val etAgentContact = findViewById<TextInputEditText>(R.id.etAgentContact)
        val tilAgentContact = findViewById<TextInputLayout>(R.id.tilAgentContact)

        val btnSubmit = findViewById<Button>(R.id.btnSubmit)
        val btnViewDrafts = findViewById<Button>(R.id.btnViewDrafts)

        // View Drafts Button Action
        btnViewDrafts?.setOnClickListener {
            startActivity(Intent(this, DraftsActivity::class.java))
        }

        // Signature References
        val customerSignatureView = findViewById<SignatureView>(R.id.customerSignatureView)
        val agentSignatureView = findViewById<SignatureView>(R.id.agentSignatureView)
        val btnClearCustomerSignature = findViewById<Button>(R.id.btnClearCustomerSignature)
        val btnClearAgentSignature = findViewById<Button>(R.id.btnClearAgentSignature)

        btnClearCustomerSignature?.setOnClickListener { customerSignatureView?.clear() }
        btnClearAgentSignature?.setOnClickListener { agentSignatureView?.clear() }

        // Formula: Total = Monthly Payment * Duration
        fun calculateTotal() {
            val monthly = etMonthlyPayment?.text?.toString()?.toDoubleOrNull() ?: 0.0
            val months = etPaymentDuration?.text?.toString()?.toDoubleOrNull() ?: 24.0
            val total = monthly * months

            if (total > 0) {
                etTotalPrice?.setText(String.format("%.2f LRD", total))
            } else {
                etTotalPrice?.setText("")
            }
        }

        // Live calculation listener
        val watcher = object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) { calculateTotal() }
            override fun afterTextChanged(s: Editable?) {}
        }

        etSubscriptionFees?.addTextChangedListener(watcher)
        etMonthlyPayment?.addTextChangedListener(watcher)
        etPaymentDuration?.addTextChangedListener(watcher)

        // Autofill logic when selecting an offer
        rgOffers?.setOnCheckedChangeListener { _, checkedId ->
            when (checkedId) {
                R.id.rbEssentialPlusRevamp -> {
                    etSubscriptionFees?.setText("2500")
                    etMonthlyPayment?.setText("1300")
                    etPaymentDuration?.setText("24")
                }
                R.id.rbComfortPlusSunking -> {
                    etSubscriptionFees?.setText("5250")
                    etMonthlyPayment?.setText("6600")
                    etPaymentDuration?.setText("24")
                }
                R.id.rbComfortSiaPower -> {
                    etSubscriptionFees?.setText("10000")
                    etMonthlyPayment?.setText("6600")
                    etPaymentDuration?.setText("24")
                }
                R.id.rbComfortPremiumFridge -> {
                    etSubscriptionFees?.setText("10000")
                    etMonthlyPayment?.setText("9995")
                    etPaymentDuration?.setText("24")
                }
                R.id.rbComfortPremiumFreezer -> {
                    etSubscriptionFees?.setText("12745")
                    etMonthlyPayment?.setText("12745")
                    etPaymentDuration?.setText("24")
                }
            }
            calculateTotal()
        }

        // Submit Button Handling
        btnSubmit?.setOnClickListener {
            // Reset error states
            tilPhone?.error = null
            tilAgentContact?.error = null

            // Validation logic
            val phone = etPhone?.text?.toString()?.trim().orEmpty()
            val agentContact = etAgentContact?.text?.toString()?.trim().orEmpty()
            val phoneRegex = Regex("^07\\d{8}$")

            if (!phoneRegex.matches(phone)) {
                tilPhone?.error = "Phone must be 10 digits starting with 07"
                return@setOnClickListener
            }
            if (!phoneRegex.matches(agentContact)) {
                tilAgentContact?.error = "Agent contact must be 10 digits starting with 07"
                return@setOnClickListener
            }
            if (customerSignatureView?.isEmpty() == true) {
                Toast.makeText(this, "Please provide the Customer Signature", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            if (agentSignatureView?.isEmpty() == true) {
                Toast.makeText(this, "Please provide the OE Installer/Agent Signature", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Extract values
            val selectedOfferId = rgOffers?.checkedRadioButtonId ?: -1
            val selectedRadioButton = findViewById<RadioButton>(selectedOfferId)
            val offerTitle = selectedRadioButton?.text?.toString()?.substringBefore("\n") ?: "N/A"

            val fullName = etFullName?.text?.toString()?.trim().orEmpty()
            val totalAmount = etTotalPrice?.text?.toString()?.trim().orEmpty()
            val address = etAddress?.text?.toString()?.trim().orEmpty()
            val idType = actvIdType?.text?.toString()?.trim().orEmpty()
            val idNumber = etIdNumber?.text?.toString()?.trim().orEmpty()
            val email = etEmail?.text?.toString()?.trim().orEmpty()
            val agentName = etAgentName?.text?.toString()?.trim().orEmpty()

            // Preview Dialog Before Submission
            AlertDialog.Builder(this)
                .setTitle("Preview Contract Details")
                .setMessage(
                    """
                    Customer: $fullName
                    Phone: $phone
                    Selected Offer: $offerTitle
                    Total Amount: $totalAmount
                    
                    Are you sure you want to submit this contract?
                    """.trimIndent()
                )
                .setPositiveButton("Confirm & Submit") { _, _ ->
                    // Export PDF locally
                    PdfGenerator.generateContractPdf(
                        context = this,
                        fullName = fullName,
                        address = address,
                        phone = phone,
                        idType = idType,
                        idNumber = idNumber,
                        email = email,
                        offerName = offerTitle,
                        subFee = etSubscriptionFees?.text?.toString().orEmpty(),
                        monthlyPayment = etMonthlyPayment?.text?.toString().orEmpty(),
                        duration = etPaymentDuration?.text?.toString().orEmpty(),
                        totalAmount = totalAmount,
                        agentName = agentName,
                        agentContact = agentContact,
                        customerSig = customerSignatureView?.getSignatureBitmap(),
                        agentSig = agentSignatureView?.getSignatureBitmap()
                    )

                    // Save Draft to Local DB & Schedule Auto-Sync
                    val draft = ContractDraft(
                        fullName = fullName,
                        address = address,
                        phone = phone,
                        idType = idType,
                        idNumber = idNumber,
                        email = email,
                        offerName = offerTitle,
                        totalAmount = totalAmount,
                        agentName = agentName,
                        agentContact = agentContact
                    )

                    CoroutineScope(Dispatchers.IO).launch {
                        repository.saveDraftAndScheduleSync(draft)
                        runOnUiThread {
                            Toast.makeText(
                                this@MainActivity,
                                "Contract Saved & Queued for Sync!",
                                Toast.LENGTH_LONG
                            ).show()
                        }
                    }
                }
                .setNegativeButton("Edit Form", null)
                .show()
        }
    }
}