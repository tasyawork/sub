#!/usr/bin/env python3
"""Offline loudness → scale for caption cues.

Extracts mono WAV from prototype videos, measures RMS per word window,
and prints suggested scale / stretch / accent values for scene data.

Usage (from react-app/):
  python3 scripts/analyze-cues.py
"""

from __future__ import annotations

import json
import math
import struct
import subprocess
import tempfile
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"

# Minimal cue word windows mirrored from playerScenes.js
SCENES = {
    "calm": {
        "video": PUBLIC / "video.mp4",
        "cues": [
            {
                "i": 0,
                "speaker": "man",
                "words": [
                    ("Осуждённая,", 1.04, 1.86),
                    ("выходите", 1.98, 2.26),
                    ("с", 2.26, 2.34),
                    ("вещами", 2.34, 2.66),
                    ("к двери.", 2.78, 2.92),
                ],
            },
            {
                "i": 1,
                "speaker": "woman",
                "words": [("Где", 3.72, 3.96), ("адвокат?", 3.96, 4.46)],
            },
            {
                "i": 2,
                "speaker": "man",
                "words": [
                    ("Сначала", 6.62, 7.04),
                    ("надо", 7.04, 7.28),
                    ("надеть", 7.28, 7.46),
                    ("наручники.", 7.46, 7.92),
                ],
            },
            {
                "i": 3,
                "speaker": "woman",
                "words": [
                    ("Почему?", 9.98, 10.34),
                    ("Не", 10.58, 10.62),
                    ("имеете", 10.62, 10.88),
                    ("права.", 10.88, 11.30),
                ],
            },
            {
                "i": 4,
                "speaker": "man",
                "words": [
                    ("Вы", 11.58, 11.72),
                    ("хотите", 11.72, 11.96),
                    ("встретиться", 11.96, 12.34),
                    ("с адвокатом?", 12.34, 12.92),
                ],
            },
            {
                "i": 5,
                "speaker": "man",
                "words": [
                    ("Надо", 13.18, 13.34),
                    ("надеть", 13.34, 13.66),
                    ("наручники.", 13.66, 14.16),
                    ("Вы", 14.72, 14.84),
                    ("же", 14.84, 14.94),
                    ("буйная.", 14.94, 15.26),
                ],
            },
            {
                "i": 6,
                "speaker": "man",
                "words": [
                    ("Вас", 15.74, 15.92),
                    ("люди", 15.92, 16.10),
                    ("боятся.", 16.10, 16.52),
                ],
            },
        ],
    },
    "emotion": {
        "video": PUBLIC / "video-emotion.mp4",
        "cues": [
            {
                "i": 0,
                "speaker": "other",
                "words": [
                    ("Зовут", 0.00, 0.56),
                    ("за", 0.56, 0.70),
                    ("то,", 0.70, 0.88),
                    ("что", 0.92, 1.10),
                    ("нацистов", 1.10, 1.80),
                    ("уважают.", 1.80, 3.10),
                ],
            },
            {
                "i": 2,
                "speaker": "other2",
                "words": [("Ты", 9.55, 9.78), ("немка?", 9.78, 10.70)],
            },
            {
                "i": 3,
                "speaker": "other",
                "words": [
                    ("А", 13.60, 14.02),
                    ("тебя", 14.02, 14.42),
                    ("кто", 14.42, 14.56),
                    ("спрашивал?", 14.56, 15.30),
                ],
            },
            {
                "i": 4,
                "speaker": "other",
                "shout": True,
                "words": [
                    ("Ну", 18.05, 18.32),
                    ("чего", 18.32, 18.40),
                    ("ты", 18.40, 18.50),
                    ("уставилась,", 18.50, 19.02),
                    ("тварь?!", 19.02, 20.30),
                ],
            },
            {
                "i": 9,
                "speaker": "other",
                "shout": True,
                "words": [
                    ("Держи", 30.00, 30.58),
                    ("её!", 30.58, 31.32),
                    ("Дай", 31.46, 31.72),
                    ("мне!", 31.72, 32.30),
                ],
            },
            {
                "i": 10,
                "speaker": "other",
                "words": [
                    ("И", 32.80, 33.12),
                    ("чего", 33.12, 33.30),
                    ("ты", 33.30, 33.58),
                    ("сделаешь,", 33.58, 34.60),
                    ("а?", 34.60, 35.40),
                ],
            },
            {
                "i": 12,
                "speaker": "woman",
                "shout": True,
                "words": [
                    ("Сдохни!", 38.35, 39.16),
                    ("Сдохни!", 39.50, 40.30),
                ],
            },
            {
                "i": 14,
                "speaker": "other",
                "shout": True,
                "words": [
                    ("Ну", 41.02, 41.18),
                    ("давай!", 41.18, 42.02),
                    ("Давай!", 42.02, 42.65),
                ],
            },
            {
                "i": 16,
                "speaker": "guard",
                "shout": True,
                "words": [
                    ("Вы", 43.78, 44.30),
                    ("что", 44.30, 44.58),
                    ("творите?!", 44.58, 45.30),
                    ("Хватит!", 45.36, 46.10),
                ],
            },
        ],
    },
}


def ffmpeg_bin() -> str:
    import imageio_ffmpeg

    return imageio_ffmpeg.get_ffmpeg_exe()


def extract_wav(video: Path, wav_path: Path) -> None:
    cmd = [
        ffmpeg_bin(),
        "-y",
        "-i",
        str(video),
        "-ac",
        "1",
        "-ar",
        "16000",
        "-vn",
        "-f",
        "wav",
        str(wav_path),
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def read_pcm(wav_path: Path):
    with wave.open(str(wav_path), "rb") as wf:
        assert wf.getnchannels() == 1
        rate = wf.getframerate()
        n = wf.getnframes()
        raw = wf.readframes(n)
        samples = struct.unpack("<" + "h" * n, raw)
    return rate, samples


def rms(samples, rate: int, start: float, end: float) -> float:
    a = max(0, int(start * rate))
    b = min(len(samples), int(end * rate))
    if b <= a + 8:
        return 0.0
    chunk = samples[a:b]
    acc = sum(s * s for s in chunk) / len(chunk)
    return math.sqrt(acc) / 32768.0


def clamp(v: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, v))


def scale_from_delta(delta_db: float, shout: bool) -> float:
    # CAPTION_RULES §2: clamp(1.02 + volumeDelta * k, 1.02, cap)
    k = 0.035
    cap = 1.20 if shout else 1.10
    return round(clamp(1.02 + delta_db * k, 1.02, cap), 3)


def stretch_from_duration(duration: float, median_dur: float) -> float:
    if median_dur <= 0:
        return 1.0
    ratio = duration / median_dur
    if ratio < 1.4:
        return 1.0
    return round(clamp(1 + (ratio - 1) * 0.04, 1.0, 1.06), 3)


def analyze_scene(name: str, scene: dict) -> dict:
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / f"{name}.wav"
        extract_wav(scene["video"], wav)
        rate, samples = read_pcm(wav)

    # speaker medians
    by_speaker: dict[str, list[float]] = {}
    word_rms = []
    for cue in scene["cues"]:
        for text, start, end in cue["words"]:
            value = rms(samples, rate, start, end)
            word_rms.append((cue, text, start, end, value))
            by_speaker.setdefault(cue["speaker"], []).append(value)

    medians = {
        sp: sorted(vals)[len(vals) // 2] if vals else 1e-6 for sp, vals in by_speaker.items()
    }

    out_cues = []
    for cue in scene["cues"]:
        med = medians.get(cue["speaker"], 1e-6) or 1e-6
        words_out = []
        durs = [end - start for _, start, end in cue["words"]]
        median_dur = sorted(durs)[len(durs) // 2] if durs else 0.3
        scales = []
        for text, start, end in cue["words"]:
            value = rms(samples, rate, start, end)
            delta_db = 20 * math.log10(max(value, 1e-8) / med)
            word_scale = scale_from_delta(delta_db, cue.get("shout", False))
            stretch = stretch_from_duration(end - start, median_dur)
            scales.append(word_scale)
            words_out.append(
                {
                    "text": text,
                    "start": start,
                    "end": end,
                    "rms": round(value, 5),
                    "deltaDb": round(delta_db, 2),
                    "suggestScale": word_scale,
                    "suggestStretch": stretch,
                }
            )

        # cue scale = median of word scales, accents on peaks above cue + 0.03
        cue_scale = round(sorted(scales)[len(scales) // 2], 3) if scales else 1.03
        cue_stretch = max((w["suggestStretch"] for w in words_out), default=1.0)
        accents = []
        for w in words_out:
            if w["suggestScale"] >= cue_scale + 0.03:
                accents.append({"text": w["text"], "accent": w["suggestScale"]})
        # max 2 accents
        accents = sorted(accents, key=lambda a: -a["accent"])[:2]

        out_cues.append(
            {
                "cueIndex": cue["i"],
                "speaker": cue["speaker"],
                "suggestScale": cue_scale,
                "suggestStretch": cue_stretch,
                "accents": accents,
                "words": words_out,
            }
        )

    return {"scene": name, "speakerMedians": {k: round(v, 5) for k, v in medians.items()}, "cues": out_cues}


def main() -> None:
    result = {name: analyze_scene(name, scene) for name, scene in SCENES.items()}
    out = ROOT / "scripts" / "cue-loudness.json"
    out.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    print(f"\nWrote {out}")


if __name__ == "__main__":
    main()
