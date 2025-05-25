import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from '@google/generative-ai';

@Injectable()
export class GeminiService {
    private readonly logger = new Logger(GeminiService.name);
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        if (!apiKey) {
            this.logger.error('GEMINI_API_KEY not found in environment variables');
            throw new Error('GEMINI_API_KEY is required');
        }

        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    async generateText(prompt: string): Promise<string> {
        try {
            const generationConfig = {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            };

            const safetySettings = [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
            ];

            const result = await this.model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig,
                safetySettings,
            });

            const response = result.response;
            return response.text();
        } catch (error) {
            this.logger.error(`Error generating text with Gemini: ${error.message}`);
            throw error;
        }
    }

    // Método para generar código a partir de diagramas UML
    // async generateCodeFromUML(umlData: string, language: string): Promise<string> {
    //     const prompt = `Generate ${language} code from the following UML diagram data:

    // ${umlData}

    // Please provide clean, well-structured ${language} code that implements the classes, 
    // relationships, and methods described in the UML diagram.`;

    //     return this.generateText(prompt);
    // }

    async generateCodeFromUML(umlData: string, language: string): Promise<string> {
        const prompt = `Generate ${language} code from the following UML diagram data:

        ${umlData}

        Please provide clean, well-structured ${language} code that implements the classes, 
        relationships, and methods described in the UML diagram.

        IMPORTANT FORMATTING INSTRUCTIONS:
        1. Place all code inside code blocks with triple backticks and language name.
        2. Example: \`\`\`${language} (code here) \`\`\`
        3. Any explanations should be outside code blocks.
        4. Use proper indentation within code blocks.
        5. Do not escape special characters in your response.
        `;

        return this.generateText(prompt);
    }
}

