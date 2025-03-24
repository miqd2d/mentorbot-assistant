
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SpeechToTextProps {
  onTextCapture: (text: string) => void;
  placeholder?: string;
}

export default function SpeechToText({ onTextCapture, placeholder = "Speak now..." }: SpeechToTextProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const { toast } = useToast();

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if browser supports SpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-IN'; // Set language to Indian English

        recognitionInstance.onresult = (event) => {
          const current = event.resultIndex;
          const result = event.results[current];
          const transcriptValue = result[0].transcript;
          
          setTranscript(transcriptValue);
          if (result.isFinal) {
            onTextCapture(transcriptValue);
          }
        };

        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          toast({
            title: "Speech Recognition Error",
            description: `Error: ${event.error}. Please try again.`,
            variant: "destructive"
          });
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      } else {
        setIsSupported(false);
        toast({
          title: "Not Supported",
          description: "Speech recognition is not supported in your browser.",
          variant: "destructive"
        });
      }
      setIsInitializing(false);
    }
  }, [onTextCapture, toast]);

  const toggleListening = useCallback(() => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognition.start();
      setIsListening(true);
      toast({
        title: "Listening",
        description: "Speak now...",
      });
    }
  }, [isListening, recognition, toast]);

  if (isInitializing) {
    return (
      <Button variant="outline" disabled>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Initializing...
      </Button>
    );
  }

  if (!isSupported) {
    return (
      <Button variant="outline" disabled>
        <MicOff className="h-4 w-4 mr-2" />
        Not supported
      </Button>
    );
  }

  return (
    <div className="flex flex-col space-y-2 w-full">
      <Button 
        onClick={toggleListening} 
        variant={isListening ? "default" : "outline"}
        className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
      >
        {isListening ? (
          <>
            <MicOff className="h-4 w-4 mr-2" />
            Stop Listening
          </>
        ) : (
          <>
            <Mic className="h-4 w-4 mr-2" />
            Start Voice Search
          </>
        )}
      </Button>
      
      {isListening && transcript && (
        <div className="text-sm text-muted-foreground mt-2">
          "{transcript}"
        </div>
      )}
    </div>
  );
}
