import { Controller, Body, Post, Res } from '@nestjs/common';
import { GenerateCodeDto } from './dto/generate-code.dto';
import { GenerateTextDto } from './dto/generate-text.dto';
import { GeminiService } from './gemini.service';
import { Response } from 'express';

@Controller('gemini')
export class GeminiController {
    constructor(private readonly geminiService: GeminiService) { }

    @Post('generate-text')
    async generateText(@Body() generateTextDto: GenerateTextDto) {
        const text = await this.geminiService.generateText(generateTextDto.prompt);
        return { text };
    }

    // @Post('generate-code')
    // async generateCode(@Body() generateCodeDto: GenerateCodeDto) {
    //     const code = await this.geminiService.generateCodeFromUML(
    //         generateCodeDto.umlData,
    //         generateCodeDto.language,
    //     );
    //     return { code };
    // }
    @Post('generate-code')
    async generateCode(
        @Body() generateCodeDto: GenerateCodeDto,
        @Res() res: Response
    ) {
        const code = await this.geminiService.generateCodeFromUML(
            generateCodeDto.umlData,
            generateCodeDto.language,
        );

        // Extraer bloques de código y explicaciones
        const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/g;
        const codeBlocks = [];
        let match;

        while ((match = codeBlockRegex.exec(code)) !== null) {
            codeBlocks.push(match[1]);
        }

        // Obtener explicaciones (texto fuera de los bloques de código)
        const explanation = code
            .replace(codeBlockRegex, '') // Eliminar bloques de código
            .trim();

        // Procesar el texto para eliminar caracteres de escape
        const processText = (text) => {
            return text
                 // Reemplazar caracteres de escape con equivalentes reales
                .replace(/\\n/g, '\n')
                .replace(/\\t/g, '\t')
                .replace(/\\r/g, '\r')
                .replace(/\\\\/g, '\\')
                .replace(/\\\*/g, '*')
                .replace(/\\_/g, '_')
                // Eliminar múltiples saltos de línea consecutivos
                .replace(/\n{3,}/g, '\n\n')
                // Eliminar asteriscos de negritas markdown
                .replace(/\*\*(.*?)\*\*/g, '$1')
                // Eliminar backticks markdown
                .replace(/`(.*?)`/g, '$1');
        };

        // Construir respuesta formateada
        const formattedResponse = {
            code: codeBlocks.length > 0 ? 
                  processText(codeBlocks.join('\n\n')) : 
                  processText(code),
            explanation: explanation.length > 0 ? 
                         processText(explanation) : 
                         null
        };

        // Configurar encabezados y enviar respuesta
        res.setHeader('Content-Type', 'application/json');
        
        // Usamos JSON.parse(JSON.stringify()) para asegurar que los caracteres especiales
        // sean representados literalmente en el JSON final
        const jsonString = JSON.stringify(formattedResponse, null, 2);
        res.send(jsonString);
    }
}
