package com.example.orangeenergycontractapp

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.pdf.PdfDocument
import android.os.Environment
import android.widget.Toast
import java.io.File
import java.io.FileOutputStream
import java.io.IOException

object PdfGenerator {

    fun generateContractPdf(
        context: Context,
        fullName: String,
        address: String,
        phone: String,
        idType: String,
        idNumber: String,
        email: String,
        offerName: String,
        subFee: String,
        monthlyPayment: String,
        duration: String,
        totalAmount: String,
        agentName: String,
        agentContact: String,
        customerSig: Bitmap?,
        agentSig: Bitmap?
    ) {
        val pdfDocument = PdfDocument()
        val pageInfo = PdfDocument.PageInfo.Builder(595, 842, 1).create() // Standard A4 Size
        val page = pdfDocument.startPage(pageInfo)
        val canvas = page.canvas

        val paint = Paint().apply {
            color = Color.BLACK
            textSize = 12f
        }

        val titlePaint = Paint().apply {
            color = Color.parseColor("#FF6600")
            textSize = 18f
            isFakeBoldText = true
        }

        val sectionPaint = Paint().apply {
            color = Color.parseColor("#FF6600")
            textSize = 14f
            isFakeBoldText = true
        }

        var y = 40f

        // Title Header
        canvas.drawText("Orange Energy Subscriber Contract", 40f, y, titlePaint)
        y += 30f

        // Subscriber Details
        canvas.drawText("1. Subscriber Details", 40f, y, sectionPaint)
        y += 20f
        canvas.drawText("Full Name: $fullName", 40f, y, paint)
        y += 16f
        canvas.drawText("Address: $address", 40f, y, paint)
        y += 16f
        canvas.drawText("Phone: $phone | ID: $idType ($idNumber)", 40f, y, paint)
        y += 16f
        canvas.drawText("Email: $email", 40f, y, paint)
        y += 30f

        // Offer & Financial Details
        canvas.drawText("2. Selected Offer & Payment Schedule", 40f, y, sectionPaint)
        y += 20f
        canvas.drawText("Selected Offer: $offerName", 40f, y, paint)
        y += 16f
        canvas.drawText("Subscription Fee: $subFee LRD", 40f, y, paint)
        y += 16f
        canvas.drawText("Monthly Payment: $monthlyPayment LRD ($duration Months)", 40f, y, paint)
        y += 16f
        canvas.drawText("Total Contract Amount: $totalAmount", 40f, y, paint)
        y += 30f

        // Agent Info
        canvas.drawText("3. Orange Liberia Agent", 40f, y, sectionPaint)
        y += 20f
        canvas.drawText("Agent Name: $agentName | Contact: $agentContact", 40f, y, paint)
        y += 40f

        // Signatures
        canvas.drawText("4. Signatures", 40f, y, sectionPaint)
        y += 20f

        customerSig?.let {
            val scaledSig = Bitmap.createScaledBitmap(it, 200, 80, true)
            canvas.drawText("Customer Signature:", 40f, y, paint)
            canvas.drawBitmap(scaledSig, 40f, y + 10, paint)
        }

        agentSig?.let {
            val scaledSig = Bitmap.createScaledBitmap(it, 200, 80, true)
            canvas.drawText("Agent Signature:", 320f, y, paint)
            canvas.drawBitmap(scaledSig, 320f, y + 10, paint)
        }

        pdfDocument.finishPage(page)

        // Save PDF File to Documents directory
        val fileName = "Contract_${System.currentTimeMillis()}.pdf"
        val file = File(context.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS), fileName)

        try {
            pdfDocument.writeTo(FileOutputStream(file))
            Toast.makeText(context, "PDF saved: ${file.absolutePath}", Toast.LENGTH_LONG).show()
        } catch (e: IOException) {
            e.printStackTrace()
            Toast.makeText(context, "Failed to export PDF", Toast.LENGTH_SHORT).show()
        } finally {
            pdfDocument.close()
        }
    }
}