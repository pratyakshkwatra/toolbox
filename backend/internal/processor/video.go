package processor

import (
	"bytes"
	"fmt"
	"os/exec"
	"path/filepath"
	"time"
)

type VideoProcessor struct{}

func NewVideoProcessor() *VideoProcessor {
	return &VideoProcessor{}
}

// TrimVideo takes an input video and trims it between startTime and endTime (e.g. "00:01:15")
func (p *VideoProcessor) TrimVideo(inputPath string, startTime string, endTime string) (string, error) {
	dir := filepath.Dir(inputPath)
	ext := filepath.Ext(inputPath)
	outFileName := fmt.Sprintf("trimmed_%d%s", time.Now().UnixNano(), ext)
	outPath := filepath.Join(dir, outFileName)

	// Command: ffmpeg -i input.mp4 -ss [start] -to [end] -c copy output.mp4
	args := []string{
		"-i", inputPath,
		"-ss", startTime,
		"-to", endTime,
		"-c", "copy",
		outPath,
	}

	cmd := exec.Command("ffmpeg", args...)
	
	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	err := cmd.Run()
	if err != nil {
		return "", fmt.Errorf("ffmpeg failed: %s (%v)", stderr.String(), err)
	}

	return outFileName, nil
}

func (p *VideoProcessor) RotateVideo(inputPath string, degrees string) (string, error) {
	dir := filepath.Dir(inputPath)
	ext := filepath.Ext(inputPath)
	outFileName := fmt.Sprintf("rotated_%d%s", time.Now().UnixNano(), ext)
	outPath := filepath.Join(dir, outFileName)

	var transpose string
	switch degrees {
	case "90": transpose = "1"
	case "180": transpose = "2,transpose=2"
	case "270": transpose = "2"
	default: transpose = "1"
	}

	args := []string{"-i", inputPath, "-vf", "transpose=" + transpose, "-c:a", "copy", outPath}
	cmd := exec.Command("ffmpeg", args...)
	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return "", fmt.Errorf("ffmpeg failed: %s (%v)", stderr.String(), err)
	}
	return outFileName, nil
}

func (p *VideoProcessor) ExtractAudio(inputPath string) (string, error) {
	dir := filepath.Dir(inputPath)
	outFileName := fmt.Sprintf("audio_%d.mp3", time.Now().UnixNano())
	outPath := filepath.Join(dir, outFileName)

	args := []string{"-i", inputPath, "-vn", "-c:a", "libmp3lame", "-q:a", "2", outPath}
	cmd := exec.Command("ffmpeg", args...)
	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return "", fmt.Errorf("ffmpeg failed: %s (%v)", stderr.String(), err)
	}
	return outFileName, nil
}
