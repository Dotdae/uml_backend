import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.logger.log('Initializing Gemini service...');
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY environment variable is not set');
      }

      // Initialize Gemini
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      
      // Configure the model with safety settings
      this.model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
        ],
      });

      this.logger.log('Gemini service initialized successfully');
    } catch (error) {
      this.logger.error(`Error initializing Gemini service: ${error.message}`, error.stack);
      throw error;
    }
  }

  async generateCode(prompt: string): Promise<string> {
    this.logger.debug('Generating code with prompt:', prompt);
    try {
      this.logger.debug('Sending request to Gemini API...');
      
      // Configure generation parameters
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      });

      const response = await result.response;
      this.logger.debug('Received response from Gemini API');
      this.logger.debug(response.text());
      
      if (!response.text()) {
        throw new Error('Empty response from Gemini API');
      }
      
      return response.text();
    } catch (error) {
      this.logger.error(`Error generating code: ${error.message}`, error.stack);
      if (error.message.includes('API key')) {
        return '```ts\n// Error: Invalid API key\nconsole.error("Please check your Gemini API key configuration");\n```';
      } else if (error.message.includes('not found')) {
        return '```ts\n// Error: Model not available\nconsole.error("The Gemini model is currently not available");\n```';
      } else {
        return '```ts\n// Error generating code\nconsole.error("An unexpected error occurred while generating code");\n```';
      }
    }
  }
}
