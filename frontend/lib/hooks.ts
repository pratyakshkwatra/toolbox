import { useState, useCallback, useRef } from "react";

export function useJobPoller() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
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
          setStatusText("Done! Downloading...");
          
          // Trigger download
          const downloadUrl = `${apiUrl}${job.result_url}`;
          const a = document.createElement("a");
          a.href = downloadUrl;
          a.download = `toolbox_${originalFileName}`;
          document.body.appendChild(a);
          a.click();
          a.remove();

          setIsProcessing(false);
          setStatusText("");
          ws.close();
          return;
        }

        if (job.status === "FAILED") {
          throw new Error(job.error || "Job failed");
        }

        setStatusText(`Processing (${job.status})...`);
      } catch (err: any) {
        console.error(err);
        alert(err.message || "An error occurred processing WS message.");
        setIsProcessing(false);
        setStatusText("");
        ws.close();
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      alert("Lost connection to processing server.");
      setIsProcessing(false);
      setStatusText("");
    };

    ws.onclose = () => {
      if (isProcessing) {
        // If it closed before completing, something went wrong
        setIsProcessing(false);
        setStatusText("");
      }
    };

  }, [isProcessing]);

  return { isProcessing, statusText, startPolling };
}
