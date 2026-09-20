package com.example.orangeenergycontractapp

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
import com.google.firebase.FirebaseException
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.PhoneAuthCredential
import com.google.firebase.auth.PhoneAuthOptions
import com.google.firebase.auth.PhoneAuthProvider
import java.util.concurrent.TimeUnit

class LoginActivity : AppCompatActivity() {

    private var auth: FirebaseAuth? = null
    private var storedVerificationId: String? = null
    private var resendToken: PhoneAuthProvider.ForceResendingToken? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        try {
            auth = FirebaseAuth.getInstance()
            if (auth?.currentUser != null) {
                navigateToMain()
                return
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        val etPhone = findViewById<TextInputEditText>(R.id.etPhone)
        val etOtp = findViewById<TextInputEditText>(R.id.etOtp)
        val tilPhone = findViewById<TextInputLayout>(R.id.tilPhone)
        val tilOtp = findViewById<TextInputLayout>(R.id.tilOtp)
        val btnSendOtp = findViewById<Button>(R.id.btnSendOtp)
        val btnVerifyOtp = findViewById<Button>(R.id.btnVerifyOtp)

        // Step 1: Send OTP to agent phone
        btnSendOtp?.setOnClickListener {
            tilPhone?.error = null
            var phone = etPhone?.text?.toString()?.trim().orEmpty()

            if (phone.isEmpty()) {
                tilPhone?.error = "Please enter phone number"
                return@setOnClickListener
            }

            // Standardize local format (e.g. 0770000000 -> +231770000000)
            if (phone.startsWith("0")) {
                phone = "+231" + phone.substring(1)
            } else if (!phone.startsWith("+")) {
                phone = "+231$phone"
            }

            sendVerificationCode(phone, btnSendOtp, btnVerifyOtp, tilOtp)
        }

        // Step 2: Verify OTP entered by agent
        btnVerifyOtp?.setOnClickListener {
            val code = etOtp?.text?.toString()?.trim().orEmpty()
            if (code.length < 6) {
                tilOtp?.error = "Enter valid 6-digit code"
                return@setOnClickListener
            }

            val verificationId = storedVerificationId
            if (verificationId != null) {
                val credential = PhoneAuthProvider.getCredential(verificationId, code)
                signInWithPhoneAuthCredential(credential)
            }
        }
    }

    private fun sendVerificationCode(
        phone: String,
        btnSendOtp: Button?,
        btnVerifyOtp: Button?,
        tilOtp: TextInputLayout?
    ) {
        val callbacks = object : PhoneAuthProvider.OnVerificationStateChangedCallbacks() {
            override fun onVerificationCompleted(credential: PhoneAuthCredential) {
                // Instant verification or auto-retrieval
                signInWithPhoneAuthCredential(credential)
            }

            override fun onVerificationFailed(e: FirebaseException) {
                Toast.makeText(this@LoginActivity, "Verification Failed: ${e.message}", Toast.LENGTH_LONG).show()
            }

            override fun onCodeSent(
                verificationId: String,
                token: PhoneAuthProvider.ForceResendingToken
            ) {
                storedVerificationId = verificationId
                resendToken = token

                Toast.makeText(this@LoginActivity, "OTP sent to $phone", Toast.LENGTH_SHORT).show()
                btnSendOtp?.visibility = View.GONE
                btnVerifyOtp?.visibility = View.VISIBLE
                tilOtp?.visibility = View.VISIBLE
            }
        }

        val options = PhoneAuthOptions.newBuilder(auth ?: FirebaseAuth.getInstance())
            .setPhoneNumber(phone)
            .setTimeout(60L, TimeUnit.SECONDS)
            .setActivity(this)
            .setCallbacks(callbacks)
            .build()

        PhoneAuthProvider.verifyPhoneNumber(options)
    }

    private fun signInWithPhoneAuthCredential(credential: PhoneAuthCredential) {
        auth?.signInWithCredential(credential)
            ?.addOnCompleteListener(this) { task ->
                if (task.isSuccessful) {
                    Toast.makeText(this, "Login Successful!", Toast.LENGTH_SHORT).show()
                    navigateToMain()
                } else {
                    Toast.makeText(
                        this,
                        "Authentication Failed: ${task.exception?.localizedMessage}",
                        Toast.LENGTH_LONG
                    ).show()
                }
            }
    }

    private fun navigateToMain() {
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
        finish()
    }
}