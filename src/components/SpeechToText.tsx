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
      try {
        // Check if browser supports SpeechRecognition
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognitionAPI) {
          const recognitionInstance = new SpeechRecognitionAPI();
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
          setIsSupported(true);
        } else {
          setIsSupported(false);
          console.error("Speech recognition not supported in this browser");
        }
      } catch (error) {
        console.error("Error initializing speech recognition:", error);
        setIsSupported(false);
      } finally {
        setIsInitializing(false);
      }
    }
  }, [onTextCapture, toast]);

  const toggleListening = useCallback(() => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        setTranscript('');
        recognition.start();
        setIsListening(true);
        toast({
          title: "Listening",
          description: "Speak now...",
        });
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        toast({
          title: "Failed to start speech recognition",
          description: "There was an error starting the speech recognition service.",
          variant: "destructive"
        });
      }
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
        Speech recognition not supported in this browser
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
