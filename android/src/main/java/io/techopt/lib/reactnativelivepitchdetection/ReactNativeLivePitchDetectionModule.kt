package io.techopt.lib.reactnativelivepitchdetection

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
import android.media.AudioRecord
import android.media.AudioFormat
import android.media.MediaRecorder
import com.facebook.react.bridge.Promise
import kotlin.concurrent.thread
import android.util.Log
@ReactModule(name = ReactNativeLivePitchDetectionModule.NAME)
class ReactNativeLivePitchDetectionModule(reactContext: ReactApplicationContext) :
  NativeReactNativeLivePitchDetectionSpec(reactContext) {

  private var isListening = false

  private var audioRecord: AudioRecord? = null
  private var recordingThread: Thread? = null
  
  private var sampleRate: Int = 44100

  private var updateIntervalMs: Int = 100

  private var minVolume: Double = 0.0
  private var bufferSize: Int = 4096

  override fun getName(): String {
    return NAME
  }

  override fun isListening(): Boolean {
    return isListening
  }

  override fun setOptions(bufferSize: Double, minVolume: Double, updateIntervalMs: Double) {
    this.minVolume = minVolume
    this.bufferSize = bufferSize.toInt()
    this.updateIntervalMs = updateIntervalMs.toInt()
  }

  override fun startListening(promise: Promise) {

    if (isListening) {
      promise.reject("E_ALREADY_LISTENING", "Already listening")
      return
    }

    audioRecord = AudioRecord(MediaRecorder.AudioSource.MIC, sampleRate, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT, bufferSize)
    
    audioRecord?.startRecording()

    recordingThread = thread(start = true) {
      val buffer = ShortArray(bufferSize)
      var lastUpdateTime = System.currentTimeMillis()

      while (isListening) {
        val currentTime = System.currentTimeMillis()

        if (currentTime - lastUpdateTime >= updateIntervalMs) {
          val read = audioRecord?.read(buffer, 0, bufferSize)

          if (read != null && read > 0) {
            detectPitch(buffer)
            lastUpdateTime = currentTime
          }
        }
      }
    }

    isListening = true

    promise.resolve(null)

  }

  override fun stopListening(promise: Promise) {
    isListening = false
    audioRecord?.stop()
    audioRecord?.release()
    audioRecord = null
    recordingThread?.interrupt()
    recordingThread = null
    promise.resolve(null)
  }

  private external fun nativeAutoCorrelate(buffer: ShortArray, sampleRate: Int, minVolume: Double): Double

  private fun detectPitch(buffer: ShortArray) {
    val frequency = nativeAutoCorrelate(buffer, sampleRate, minVolume)

    val eventData = Arguments.createMap().apply {
      putDouble("frequency", frequency)
    }
    
    emitOnFrequencyDetected(eventData)
  }

  companion object {
    const val NAME = "ReactNativeLivePitchDetection"
    
    init {
      System.loadLibrary("reactnativelivepitchdetection")
    }
  }
}
