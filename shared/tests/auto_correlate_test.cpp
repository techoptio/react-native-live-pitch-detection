#include "ReactNativeLivePitchDetectionModule.h"

#include <gtest/gtest.h>

#include <cmath>
#include <vector>

using techoptio::reactnativelivepitchdetection::autoCorrelate;

namespace {

constexpr double kPi = 3.14159265358979323846;
constexpr double kSampleRate = 44100.0;
constexpr double kMinVolume = -20.0;
constexpr int kBufferSize = 4096;

std::vector<double> makeSine(double frequencyHz, double amplitude, int size = kBufferSize) {
  std::vector<double> buffer(static_cast<size_t>(size));
  for (int i = 0; i < size; ++i) {
    buffer[static_cast<size_t>(i)] =
        amplitude * std::sin(2.0 * kPi * frequencyHz * static_cast<double>(i) / kSampleRate);
  }
  return buffer;
}

} // namespace

TEST(AutoCorrelate, DetectsA4) {
  const auto buffer = makeSine(440.0, 0.5);
  const double detected = autoCorrelate(buffer, kSampleRate, kMinVolume);
  EXPECT_NEAR(detected, 440.0, 440.0 * 0.02);
}

TEST(AutoCorrelate, DetectsC4) {
  const auto buffer = makeSine(261.63, 0.5);
  const double detected = autoCorrelate(buffer, kSampleRate, kMinVolume);
  EXPECT_NEAR(detected, 261.63, 261.63 * 0.02);
}

TEST(AutoCorrelate, DetectsA5) {
  const auto buffer = makeSine(880.0, 0.5);
  const double detected = autoCorrelate(buffer, kSampleRate, kMinVolume);
  EXPECT_NEAR(detected, 880.0, 880.0 * 0.02);
}

TEST(AutoCorrelate, ReturnsNegativeOneForSilence) {
  const std::vector<double> buffer(kBufferSize, 0.0);
  EXPECT_EQ(autoCorrelate(buffer, kSampleRate, kMinVolume), -1);
}

TEST(AutoCorrelate, ReturnsNegativeOneBelowMinVolume) {
  // Amplitude low enough that RMS dB stays under -20.
  const auto buffer = makeSine(440.0, 0.0001);
  EXPECT_EQ(autoCorrelate(buffer, kSampleRate, kMinVolume), -1);
}
