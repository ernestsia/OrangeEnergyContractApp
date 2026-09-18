package com.example.orangeenergycontractapp

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Path
import android.os.Bundle
import android.util.AttributeSet
import android.view.MotionEvent
import android.view.View
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class SignatureActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val layout = android.widget.LinearLayout(this).apply {
            orientation = android.widget.LinearLayout.VERTICAL
            setPadding(32, 32, 32, 32)
        }

        val title = android.widget.TextView(this).apply {
            text = "OE Installer / Agent Signature"
            textSize = 20f
            setTypeface(null, android.graphics.Typeface.BOLD)
            setTextColor(Color.parseColor("#FF6600"))
            setPadding(0, 0, 0, 16)
        }

        val signaturePad = SignaturePad(this, null)
        val padParams = android.widget.LinearLayout.LayoutParams(
            android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
            0,
            1.0f
        ).apply {
            setMargins(0, 0, 0, 16)
        }
        signaturePad.layoutParams = padParams
        signaturePad.setBackgroundColor(Color.LTGRAY)

        val btnContainer = android.widget.LinearLayout(this).apply {
            orientation = android.widget.LinearLayout.HORIZONTAL
        }

        val btnClear = Button(this).apply {
            text = "Clear"
            setOnClickListener { signaturePad.clear() }
        }

        val btnSave = Button(this).apply {
            text = "Save & Complete Contract"
            setBackgroundColor(Color.parseColor("#FF6600"))
            setTextColor(Color.WHITE)
            setOnClickListener {
                Toast.makeText(this@SignatureActivity, "Contract Signed & Submitted Successfully!", Toast.LENGTH_LONG).show()
                finish()
            }
        }

        val buttonParams = android.widget.LinearLayout.LayoutParams(
            0,
            android.widget.LinearLayout.LayoutParams.WRAP_CONTENT,
            1.0f
        )
        btnClear.layoutParams = buttonParams
        btnSave.layoutParams = buttonParams

        btnContainer.addView(btnClear)
        btnContainer.addView(btnSave)

        layout.addView(title)
        layout.addView(signaturePad)
        layout.addView(btnContainer)

        setContentView(layout)
    }
}

class SignaturePad(context: Context, attrs: AttributeSet?) : View(context, attrs) {
    private val path = Path()
    private val paint = Paint().apply {
        isAntiAlias = true
        color = Color.BLACK
        style = Paint.Style.STROKE
        strokeJoin = Paint.Join.ROUND
        strokeCap = Paint.Cap.ROUND
        strokeWidth = 8f
    }

    override fun onDraw(canvas: Canvas) {
        canvas.drawPath(path, paint)
    }

    override fun onTouchEvent(event: MotionEvent): Boolean {
        val x = event.x
        val y = event.y
        when (event.action) {
            MotionEvent.ACTION_DOWN -> {
                path.moveTo(x, y)
                return true
            }
            MotionEvent.ACTION_MOVE -> path.lineTo(x, y)
            else -> return false
        }
        invalidate()
        return true
    }

    fun clear() {
        path.reset()
        invalidate()
    }
}