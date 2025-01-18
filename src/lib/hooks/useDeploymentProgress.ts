import { useState, useEffect, useCallback } from 'react';
import { DeploymentProgress } from '@/components/utils/launchpad-types';

export const useDeploymentProgress = (baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api') => {
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [progress, setProgress] = useState<DeploymentProgress | null>(null);
  const [clientId, setClientId] = useState<string>('');

  const connect = useCallback((newClientId: string) => {
    if (eventSource) {
      eventSource.close();
    }

    setClientId(newClientId);
    const newEventSource = new EventSource(`${baseUrl}/events/${newClientId}`);

    newEventSource.onmessage = (event) => {
      try {
        const data: DeploymentProgress = JSON.parse(event.data);
        setProgress(data);

        // Close the connection when deployment is complete or has errored
        if (data.status === 'completed' || data.status === 'error') {
          setTimeout(() => {
            newEventSource.close();
            setEventSource(null);
          }, 2000); // Keep connection open briefly to ensure final message is shown
        }
      } catch (err) {
        console.error('Error parsing event data:', err);
      }
    };

    newEventSource.onerror = (err) => {
      console.error('SSE error:', err);
      newEventSource.close();
      setEventSource(null);
    };

    setEventSource(newEventSource);
  }, [baseUrl]);

  const disconnect = useCallback(() => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
      setProgress(null);
      setClientId('');
    }
  }, [eventSource]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    progress,
    clientId,
    connect,
    disconnect,
    isConnected: !!eventSource
  };
};