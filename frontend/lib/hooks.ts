import { useState, useCallback, useRef } from "react";

export function useJobPoller() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const startPolling = useCallback(async (jobId: string, apiUrl: string, originalFileName: string) => {
    setIsProcessing(true);
    setStatusText("Waiting for worker...");

    // Convert http/https to ws/wss
    const wsUrl = apiUrl.replace(/^http/, 'ws') + `/api/v1/jobs/ws/${jobId}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const job = JSON.parse(event.data);

        if (job.status === "COMPLETED") {
          setStatusText("Done!");
          
          const downloadUrl = `${apiUrl}${job.result_url}`;
          setResultUrl(downloadUrl);

          setIsProcessing(false);
          ws.close();
          return;
        }

        if (job.status === "FAILED") {
          setError(job.error || "Job failed");
          throw new Error(job.error || "Job failed");
        }

        setStatusText(`Processing (${job.status})...`);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An error occurred processing WS message.");
        setIsProcessing(false);
        ws.close();
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("Lost connection to processing server.");
      setIsProcessing(false);
    };

    ws.onclose = () => {
      if (isProcessing) {
        setIsProcessing(false);
      }
    };

  }, [isProcessing]);

  return { isProcessing, statusText, startPolling, resultUrl, error };
}
