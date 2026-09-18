package com.example.orangeenergycontractapp

import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.textfield.TextInputEditText

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val etFullName = findViewById<TextInputEditText>(R.id.etFullName)
        val etPhone = findViewById<TextInputEditText>(R.id.etPhone)
        val etSerialNumber = findViewById<TextInputEditText>(R.id.etSerialNumber)
        val btnSubmit = findViewById<Button>(R.id.btnSubmit)

        btnSubmit?.setOnClickListener {
            val fullName = etFullName?.text?.toString()?.trim().orEmpty()
            val phone = etPhone?.text?.toString()?.trim().orEmpty()
            val serialNumber = etSerialNumber?.text?.toString()?.trim().orEmpty()

            if (fullName.isEmpty() || phone.isEmpty() || serialNumber.isEmpty()) {
                Toast.makeText(this, "Please fill in all required fields", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "Contract submitted for $fullName", Toast.LENGTH_LONG).show()
            }
        }
    }
}