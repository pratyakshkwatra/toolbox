package processor

import (
	"bytes"
	"errors"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

type ImageProcessor struct{}

func NewImageProcessor() *ImageProcessor {
	return &ImageProcessor{}
}

// Compress takes an input path and creates a compressed version in the same directory.
// For Phase 1, we use pure Go standard library for JPEG/PNG processing.
func (p *ImageProcessor) Compress(inputPath string, quality int) (string, error) {
	inFile, err := os.Open(inputPath)
	if err != nil {
		return "", err
	}
	defer inFile.Close()

	img, format, err := image.Decode(inFile)
	if err != nil {
		return "", err
	}

	dir := filepath.Dir(inputPath)
	base := filepath.Base(inputPath)
	ext := filepath.Ext(base)
	nameWithoutExt := strings.TrimSuffix(base, ext)
	outFileName := nameWithoutExt + "_compressed" + ext
	outPath := filepath.Join(dir, outFileName)

	outFile, err := os.Create(outPath)
	if err != nil {
		return "", err
	}
	defer outFile.Close()

	switch format {
	case "jpeg", "jpg":
		opt := jpeg.Options{Quality: quality}
		err = jpeg.Encode(outFile, img, &opt)
	case "png":
		// PNG standard library lacks built-in lossy compression.
		// For a real app we'd use external libs (like libimagequant or libvips).
		// For Phase 1, we just write it back using fast compression.
		encoder := png.Encoder{CompressionLevel: png.BestSpeed}
		err = encoder.Encode(outFile, img)
	default:
		return "", errors.New("unsupported image format")
	}

	if err != nil {
		return "", err
	}

	return outFileName, nil
}

func (p *ImageProcessor) ResizeImage(inputPath string, width string, height string) (string, error) {
	dir := filepath.Dir(inputPath)
	ext := filepath.Ext(inputPath)
	outFileName := fmt.Sprintf("resized_%d%s", time.Now().UnixNano(), ext)
	outPath := filepath.Join(dir, outFileName)

	// Using ffmpeg to resize the image
	// Command: ffmpeg -i input.jpg -vf scale=800:600 output.jpg
	scale := fmt.Sprintf("scale=%s:%s", width, height)
	args := []string{"-i", inputPath, "-vf", scale, outPath}
	cmd := exec.Command("ffmpeg", args...)
	
	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return "", fmt.Errorf("ffmpeg failed: %s (%v)", stderr.String(), err)
	}
	return outFileName, nil
}
