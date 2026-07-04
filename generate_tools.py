import json
import os
import re

# We will generate dozens of conversion combinations
image_formats = ["png", "jpg", "webp", "bmp", "tiff", "gif"]
audio_formats = ["mp3", "wav", "aac", "ogg", "flac"]
video_formats = ["mp4", "webm", "mkv", "mov", "avi"]

frontend_tools = []
go_registry = []

# Generate Image Converters
for src in image_formats:
    for dst in image_formats:
        if src != dst:
            slug = f"{src}-to-{dst}"
            frontend_tools.append({
                "slug": slug,
                "name": f"{src.upper()} to {dst.upper()}",
                "description": f"Convert {src.upper()} image to {dst.upper()} format instantly.",
                "category": "image",
                "icon": "🖼️",
                "accept": f"image/{src}",
                "multiple": False
            })
            # ffmpeg command for images
            go_registry.append(f'\t"{slug}": {{Binary: "ffmpeg", Args: []string{{"-i", "{{input}}", "{{output}}"}}, OutputExt: ".{dst}"}},')

# Generate Audio Converters
for src in audio_formats:
    for dst in audio_formats:
        if src != dst:
            slug = f"{src}-to-{dst}"
            frontend_tools.append({
                "slug": slug,
                "name": f"{src.upper()} to {dst.upper()}",
                "description": f"Convert {src.upper()} audio to {dst.upper()} format.",
                "category": "audio",
                "icon": "🎧",
                "accept": f"audio/*",
                "multiple": False
            })
            go_registry.append(f'\t"{slug}": {{Binary: "ffmpeg", Args: []string{{"-i", "{{input}}", "{{output}}"}}, OutputExt: ".{dst}"}},')


# Generate Video Converters
for src in video_formats:
    for dst in video_formats:
        if src != dst:
            slug = f"{src}-to-{dst}"
            frontend_tools.append({
                "slug": slug,
                "name": f"{src.upper()} to {dst.upper()}",
                "description": f"Convert {src.upper()} video to {dst.upper()} format.",
                "category": "video",
                "icon": "🎥",
                "accept": f"video/*",
                "multiple": False
            })
            go_registry.append(f'\t"{slug}": {{Binary: "ffmpeg", Args: []string{{"-i", "{{input}}", "{{output}}"}}, OutputExt: ".{dst}"}},')

# Read existing frontend config
with open("frontend/config/tools.json", "r") as f:
    existing_tools = json.load(f)

# Append and write back
existing_tools.extend(frontend_tools)
with open("frontend/config/tools.json", "w") as f:
    json.dump(existing_tools, f, indent=2)

print(f"Generated {len(frontend_tools)} new tools for frontend.")

# Now for Go, we need to inject the registry lines into generic.go
with open("backend/internal/processor/generic.go", "r") as f:
    go_code = f.read()

# Find the ToolRegistry map and inject
injection = "\n" + "\n".join(go_registry) + "\n"
new_go_code = re.sub(r'(var ToolRegistry = map\[string\]CommandTemplate{)', r'\1' + injection, go_code)

with open("backend/internal/processor/generic.go", "w") as f:
    f.write(new_go_code)

print(f"Injected {len(go_registry)} templates into ToolRegistry.")
