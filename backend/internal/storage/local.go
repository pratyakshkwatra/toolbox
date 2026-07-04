package storage

import (
	"io"
	"os"
	"path/filepath"
	"time"
)

type LocalStorage struct {
	BaseDir string
}

func NewLocalStorage(baseDir string) *LocalStorage {
	os.MkdirAll(baseDir, 0755)
	return &LocalStorage{BaseDir: baseDir}
}

func (s *LocalStorage) SaveFile(fileName string, reader io.Reader) (string, error) {
	path := filepath.Join(s.BaseDir, fileName)
	file, err := os.Create(path)
	if err != nil {
		return "", err
	}
	defer file.Close()

	_, err = io.Copy(file, reader)
	if err != nil {
		return "", err
	}

	return path, nil
}

func (s *LocalStorage) DeleteFile(fileName string) error {
	return os.Remove(filepath.Join(s.BaseDir, fileName))
}

func (s *LocalStorage) GetFilePath(fileName string) string {
	return filepath.Join(s.BaseDir, fileName)
}

// CleanupOldFiles deletes any file in the BaseDir that is older than the given duration
func (s *LocalStorage) CleanupOldFiles(maxAge time.Duration) error {
	entries, err := os.ReadDir(s.BaseDir)
	if err != nil {
		return err
	}

	now := time.Now()
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}

		info, err := entry.Info()
		if err != nil {
			continue
		}

		if now.Sub(info.ModTime()) > maxAge {
			os.Remove(filepath.Join(s.BaseDir, entry.Name()))
		}
	}
	return nil
}
