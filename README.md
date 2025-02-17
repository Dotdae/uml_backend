# UML Code Generator 🚀  

Este es un proyecto basado en **NestJS** que permite transformar diagramas **UML** en código fuente de lenguajes de programación.  

## 📌 Características  
✅ Convierte diagramas UML en código en varios lenguajes.  
✅ Soporte para clases, relaciones y atributos.  
✅ API REST para enviar diagramas en formato JSON.  
✅ Extensible y modular gracias a **NestJS**.  

## 🛠️ Tecnologías  
- **NestJS** (Framework backend en Node.js)  
- **TypeScript**  
- **Swagger** (Documentación de la API)  

## 🚀 Instalación  

1. Clona este repositorio:  
```bash  
git clone https://github.com/Dotdae/uml_backend
cd uml_backend
```
2. Instala las dependencias:  
```bash  
npm install  
```
3. Configura las variables de entorno en un archivo `.env`:  
```ini  
PORT=3000  
DATABASE_URL=mongodb://localhost:27017/uml  
```
4. Ejecuta el servidor en modo desarrollo:  
```bash  
npm run start:dev  
```

## 📡 Uso de la API  
### **1️⃣ Convertir UML a Código**  
- **Endpoint:** `POST /convert`  
- **Body:**  
```json  
{  
  "uml": "Diagrama en formato JSON",  
  "language": "typescript"  
}  
```
- **Respuesta:**  
```json  
{  
  "code": "Código generado aquí..."  
}  
```

## 🏗️ Estructura del Proyecto  
```
/src  
 ├── modules/  
 │   ├── uml/         # Módulo para procesar UML  
 │   ├── converter/   # Módulo para generar código  
 ├── main.ts          # Punto de entrada de la app  
 ├── app.module.ts    # Módulo principal  
```

## 📜 Licencia  
Este proyecto está bajo la licencia **MIT**.  

---  
## Autores

- [@Adriel Rodriguez](https://github.com/Adrieliyo)
- [@Christopher Ortega](https://www.github.com/Dotdae)
- [@Elisa Arce](https://github.com/EALisa03JKL)
- [@Iván Ibañez](https://github.com/kyrukato)
- [@Kevin Montalvo](https://github.com/KevinMontalvo27)
- [@Néstor Padilla](https://github.com/netor98)

