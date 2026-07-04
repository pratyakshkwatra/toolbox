package processor

import (
	"bytes"
	"fmt"
	"os/exec"
	"path/filepath"
	"time"
)

type AudioProcessor struct{}

func NewAudioProcessor() *AudioProcessor {
	return &AudioProcessor{}
}

func (p *AudioProcessor) ConvertAudio(inputPath string) (string, error) {
	dir := filepath.Dir(inputPath)
	outFileName := fmt.Sprintf("converted_%d.mp3", time.Now().UnixNano())
	outPath := filepath.Join(dir, outFileName)

	// Command: ffmpeg -i input.wav -c:a libmp3lame -q:a 2 output.mp3
	args := []string{"-i", inputPath, "-c:a", "libmp3lame", "-q:a", "2", outPath}
	cmd := exec.Command("ffmpeg", args...)
	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return "", fmt.Errorf("ffmpeg failed: %s (%v)", stderr.String(), err)
	}

	return outFileName, nil
}
