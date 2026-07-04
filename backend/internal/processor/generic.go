package processor

import (
	"bytes"
	"fmt"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

// CommandTemplate defines how a specific tool is executed via CLI
type CommandTemplate struct {
	Binary      string
	Args        []string
	OutputExt   string
}

// ToolRegistry maps tool slugs to their CLI execution templates
var ToolRegistry = map[string]CommandTemplate{
	"png-to-jpg": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".jpg"},
	"png-to-webp": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".webp"},
	"png-to-bmp": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".bmp"},
	"png-to-tiff": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".tiff"},
	"png-to-gif": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".gif"},
	"jpg-to-png": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".png"},
	"jpg-to-webp": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".webp"},
	"jpg-to-bmp": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".bmp"},
	"jpg-to-tiff": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".tiff"},
	"jpg-to-gif": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".gif"},
	"webp-to-png": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".png"},
	"webp-to-jpg": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".jpg"},
	"webp-to-bmp": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".bmp"},
	"webp-to-tiff": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".tiff"},
	"webp-to-gif": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".gif"},
	"bmp-to-png": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".png"},
	"bmp-to-jpg": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".jpg"},
	"bmp-to-webp": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".webp"},
	"bmp-to-tiff": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".tiff"},
	"bmp-to-gif": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".gif"},
	"tiff-to-png": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".png"},
	"tiff-to-jpg": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".jpg"},
	"tiff-to-webp": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".webp"},
	"tiff-to-bmp": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".bmp"},
	"tiff-to-gif": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".gif"},
	"gif-to-png": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".png"},
	"gif-to-jpg": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".jpg"},
	"gif-to-webp": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".webp"},
	"gif-to-bmp": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".bmp"},
	"gif-to-tiff": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".tiff"},
	"mp3-to-wav": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".wav"},
	"mp3-to-aac": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".aac"},
	"mp3-to-ogg": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".ogg"},
	"mp3-to-flac": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".flac"},
	"wav-to-mp3": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".mp3"},
	"wav-to-aac": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".aac"},
	"wav-to-ogg": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".ogg"},
	"wav-to-flac": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".flac"},
	"aac-to-mp3": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".mp3"},
	"aac-to-wav": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".wav"},
	"aac-to-ogg": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".ogg"},
	"aac-to-flac": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".flac"},
	"ogg-to-mp3": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".mp3"},
	"ogg-to-wav": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".wav"},
	"ogg-to-aac": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".aac"},
	"ogg-to-flac": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".flac"},
	"flac-to-mp3": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".mp3"},
	"flac-to-wav": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".wav"},
	"flac-to-aac": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".aac"},
	"flac-to-ogg": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".ogg"},
	"mp4-to-webm": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".webm"},
	"mp4-to-mkv": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".mkv"},
	"mp4-to-mov": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".mov"},
	"mp4-to-avi": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".avi"},
	"webm-to-mp4": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".mp4"},
	"webm-to-mkv": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".mkv"},
	"webm-to-mov": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".mov"},
	"webm-to-avi": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".avi"},
	"mkv-to-mp4": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".mp4"},
	"mkv-to-webm": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".webm"},
	"mkv-to-mov": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".mov"},
	"mkv-to-avi": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".avi"},
	"mov-to-mp4": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".mp4"},
	"mov-to-webm": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".webm"},
	"mov-to-mkv": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".mkv"},
	"mov-to-avi": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".avi"},
	"avi-to-mp4": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".mp4"},
	"avi-to-webm": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".webm"},
	"avi-to-mkv": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".mkv"},
	"avi-to-mov": {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".mov"},

	"video-to-gif":      {Binary: "ffmpeg", Args: []string{"-i", "{input}", "-vf", "fps=10,scale=320:-1:flags=lanczos", "-c:v", "gif", "{output}"}, OutputExt: ".gif"},
	"video-to-mp4":      {Binary: "ffmpeg", Args: []string{"-i", "{input}", "-c:v", "libx264", "-preset", "fast", "-crf", "22", "-c:a", "aac", "-b:a", "128k", "{output}"}, OutputExt: ".mp4"},
	"video-remove-audio":{Binary: "ffmpeg", Args: []string{"-i", "{input}", "-c", "copy", "-an", "{output}"}, OutputExt: ".mp4"},
	"image-to-png":      {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".png"},
	"image-to-webp":     {Binary: "ffmpeg", Args: []string{"-i", "{input}", "-c:v", "libwebp", "{output}"}, OutputExt: ".webp"},
	"image-to-jpg":      {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".jpg"},
	"audio-to-wav":      {Binary: "ffmpeg", Args: []string{"-i", "{input}", "{output}"}, OutputExt: ".wav"},
	"pdf-to-jpg":        {Binary: "pdftoppm", Args: []string{"-jpeg", "{input}", "{output_prefix}"}, OutputExt: ".jpg"}, // Note: pdftoppm outputs prefix-1.jpg
}

type GenericProcessor struct{}

func NewGenericProcessor() *GenericProcessor {
	return &GenericProcessor{}
}

// Process dynamically executes a CLI tool based on the registry
func (p *GenericProcessor) Process(toolSlug string, inputPath string, params map[string]string) (string, error) {
	template, exists := ToolRegistry[toolSlug]
	if !exists {
		return "", fmt.Errorf("tool %s not found in registry", toolSlug)
	}

	dir := filepath.Dir(inputPath)
	outFileName := fmt.Sprintf("output_%d%s", time.Now().UnixNano(), template.OutputExt)
	outPath := filepath.Join(dir, outFileName)
	outPrefix := filepath.Join(dir, fmt.Sprintf("output_%d", time.Now().UnixNano()))

	// Build arguments, replacing {input}, {output}, {output_prefix}, and any {param_name}
	var finalArgs []string
	for _, arg := range template.Args {
		arg = strings.ReplaceAll(arg, "{input}", inputPath)
		arg = strings.ReplaceAll(arg, "{output}", outPath)
		arg = strings.ReplaceAll(arg, "{output_prefix}", outPrefix)
		
		// Replace dynamic params from frontend (e.g., {quality}, {width})
		for k, v := range params {
			arg = strings.ReplaceAll(arg, fmt.Sprintf("{%s}", k), v)
		}
		
		finalArgs = append(finalArgs, arg)
	}

	cmd := exec.Command(template.Binary, finalArgs...)
	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return "", fmt.Errorf("%s failed: %s (%v)", template.Binary, stderr.String(), err)
	}

	// Handle special cases where output is a prefix (like pdftoppm)
	if strings.Contains(strings.Join(template.Args, " "), "{output_prefix}") {
		// pdftoppm creates output_prefix-1.jpg, output_prefix-2.jpg, etc.
		// For simplicity, we just return the first page or a zip. 
		// We'll just return the 1st page for now.
		return filepath.Base(outPrefix) + "-1" + template.OutputExt, nil
	}

	return outFileName, nil
}
