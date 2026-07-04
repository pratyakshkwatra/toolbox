package kafka

type JobMessage struct {
	JobID      string            `json:"job_id"`
	Tool       string            `json:"tool"`
	InputPaths []string          `json:"input_paths"`
	Params     map[string]string `json:"params"`
}
